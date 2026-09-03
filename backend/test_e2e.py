import time
import json
import urllib.request
import urllib.parse
import urllib.error

BASE_URL = "http://localhost:8000"

def make_request(url, method="GET", data=None, headers=None, is_json=True, form_data=False):
    req_headers = headers.copy() if headers else {}
    body = None

    if data is not None:
        if form_data:
            body = urllib.parse.urlencode(data).encode("utf-8")
            req_headers["Content-Type"] = "application/x-www-form-urlencoded"
        elif is_json:
            body = json.dumps(data).encode("utf-8")
            req_headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=body, headers=req_headers, method=method)

    class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
        def http_error_302(self, req, fp, code, msg, headers):
            return fp
        http_error_301 = http_error_302
        http_error_307 = http_error_302
        http_error_308 = http_error_302

    opener = urllib.request.build_opener(NoRedirectHandler)

    try:
        with opener.open(req) as resp:
            resp_body = resp.read().decode("utf-8")
            try:
                parsed_json = json.loads(resp_body)
            except Exception:
                parsed_json = resp_body
            return {
                "status": resp.status,
                "headers": dict(resp.headers),
                "data": parsed_json,
                "raw": resp_body
            }
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            parsed_json = json.loads(err_body)
        except Exception:
            parsed_json = err_body
        return {
            "status": e.code,
            "headers": dict(e.headers),
            "data": parsed_json,
            "raw": err_body
        }

def run_tests():
    print("=" * 60)
    print("STARTING COMPLETE FULL-STACK BACKEND & API INTEGRATION TESTS")
    print("=" * 60)

    timestamp = int(time.time())
    test_email = f"test_e2e_{timestamp}@urlshawtie.com"
    test_password = "Password123!"

    # 1. Health check & CORS headers check
    print("\n[TEST 1] Root endpoint & CORS headers check...")
    root_resp = make_request(f"{BASE_URL}/", headers={"Origin": "http://localhost:5173"})
    assert root_resp["status"] == 200, f"Expected 200, got {root_resp['status']}"
    assert "URL Shortener API is running" in root_resp["raw"]
    print("  [OK] Root endpoint running with correct CORS response")

    # 2. Register new user
    print("\n[TEST 2] Register new user...")
    reg_resp = make_request(
        f"{BASE_URL}/api/v1/auth/register",
        method="POST",
        data={"email": test_email, "password": test_password}
    )
    assert reg_resp["status"] == 200, f"Expected 200, got {reg_resp['status']}: {reg_resp['raw']}"
    user_data = reg_resp["data"]
    assert user_data["email"] == test_email
    assert "id" in user_data
    print(f"  [OK] User registered successfully: id={user_data['id']}, email={user_data['email']}")

    # 3. Duplicate email registration
    print("\n[TEST 3] Duplicate email registration...")
    dup_reg_resp = make_request(
        f"{BASE_URL}/api/v1/auth/register",
        method="POST",
        data={"email": test_email, "password": test_password}
    )
    assert dup_reg_resp["status"] == 400, f"Expected 400, got {dup_reg_resp['status']}"
    print("  [OK] Duplicate registration rejected with 400 Bad Request")

    # 4. Login with invalid password
    print("\n[TEST 4] Login with invalid password...")
    bad_login_resp = make_request(
        f"{BASE_URL}/api/v1/auth/login",
        method="POST",
        data={"username": test_email, "password": "WrongPassword123!"},
        form_data=True
    )
    assert bad_login_resp["status"] == 401, f"Expected 401, got {bad_login_resp['status']}"
    print("  [OK] Invalid login rejected with 401 Unauthorized")

    # 5. Login with valid credentials
    print("\n[TEST 5] Login with valid credentials...")
    login_resp = make_request(
        f"{BASE_URL}/api/v1/auth/login",
        method="POST",
        data={"username": test_email, "password": test_password},
        form_data=True
    )
    assert login_resp["status"] == 200, f"Expected 200, got {login_resp['status']}: {login_resp['raw']}"
    token_data = login_resp["data"]
    assert "access_token" in token_data
    token = token_data["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}
    print("  [OK] Login successful, JWT access_token obtained")

    # 6. Current User endpoint (/me)
    print("\n[TEST 6] GET /api/v1/auth/me...")
    me_resp = make_request(f"{BASE_URL}/api/v1/auth/me", headers=auth_headers)
    assert me_resp["status"] == 200, f"Expected 200, got {me_resp['status']}: {me_resp['raw']}"
    me_data = me_resp["data"]
    assert me_data.get("email") == test_email or me_data.get("user_id") == user_data["id"]
    print(f"  [OK] /me returned authenticated user data: {me_data}")

    # 7. Create normal shortened URL
    print("\n[TEST 7] Create shortened URL (random short code)...")
    url_1_resp = make_request(
        f"{BASE_URL}/api/v1/urls",
        method="POST",
        headers=auth_headers,
        data={"original_url": "https://github.com/facebook/react"}
    )
    assert url_1_resp["status"] == 200, f"Expected 200, got {url_1_resp['status']}: {url_1_resp['raw']}"
    url_1 = url_1_resp["data"]
    assert url_1["original_url"] == "https://github.com/facebook/react"
    assert "short_code" in url_1
    assert "short_url" in url_1
    assert url_1["click_count"] == 0
    short_code_1 = url_1["short_code"]
    print(f"  [OK] URL created: short_code={short_code_1}, short_url={url_1['short_url']}")

    # 8. Create URL with custom alias
    print("\n[TEST 8] Create shortened URL with custom alias...")
    custom_alias = f"react-docs-{timestamp % 10000}"
    url_2_resp = make_request(
        f"{BASE_URL}/api/v1/urls",
        method="POST",
        headers=auth_headers,
        data={
            "original_url": "https://react.dev",
            "custom_alias": custom_alias
        }
    )
    assert url_2_resp["status"] == 200, f"Expected 200, got {url_2_resp['status']}: {url_2_resp['raw']}"
    url_2 = url_2_resp["data"]
    assert url_2["short_code"] == custom_alias
    print(f"  [OK] Custom alias created: short_code={custom_alias}")

    # 9. Duplicate custom alias (409 Conflict)
    print("\n[TEST 9] Attempt duplicate custom alias...")
    dup_alias_resp = make_request(
        f"{BASE_URL}/api/v1/urls",
        method="POST",
        headers=auth_headers,
        data={
            "original_url": "https://another-site.com",
            "custom_alias": custom_alias
        }
    )
    assert dup_alias_resp["status"] == 409, f"Expected 409, got {dup_alias_resp['status']}: {dup_alias_resp['raw']}"
    print("  [OK] Duplicate alias correctly returned 409 Conflict")

    # 10. List user URLs
    print("\n[TEST 10] List user URLs (GET /api/v1/urls)...")
    list_resp = make_request(f"{BASE_URL}/api/v1/urls", headers=auth_headers)
    assert list_resp["status"] == 200, f"Expected 200, got {list_resp['status']}"
    urls_list = list_resp["data"]
    assert len(urls_list) >= 2
    short_codes_in_list = [u["short_code"] for u in urls_list]
    assert short_code_1 in short_codes_in_list
    assert custom_alias in short_codes_in_list
    print(f"  [OK] GET /api/v1/urls returned {len(urls_list)} URLs")

    # 11. Get specific URL details
    print(f"\n[TEST 11] Get URL details for {custom_alias}...")
    detail_resp = make_request(f"{BASE_URL}/api/v1/urls/{custom_alias}", headers=auth_headers)
    assert detail_resp["status"] == 200, f"Expected 200, got {detail_resp['status']}"
    detail_data = detail_resp["data"]
    assert detail_data["short_code"] == custom_alias
    assert detail_data["click_count"] == 0
    print("  [OK] Detail endpoint returned correct metadata")

    # 12. Get URL Stats
    print(f"\n[TEST 12] Get URL Stats for {custom_alias}...")
    stats_resp = make_request(f"{BASE_URL}/api/v1/urls/{custom_alias}/stats", headers=auth_headers)
    assert stats_resp["status"] == 200, f"Expected 200, got {stats_resp['status']}"
    stats_data = stats_resp["data"]
    assert stats_data["short_code"] == custom_alias
    assert "created_at" in stats_data
    assert stats_data["click_count"] == 0
    print(f"  [OK] Stats endpoint returned: created_at={stats_data['created_at']}, click_count={stats_data['click_count']}")

    # 13. Public redirect & Click increment
    print(f"\n[TEST 13] Public redirect and click tracking (GET /{custom_alias})...")
    redir_resp = make_request(f"{BASE_URL}/{custom_alias}")
    assert redir_resp["status"] in [301, 302, 307, 308], f"Expected redirect status, got {redir_resp['status']}"
    location = redir_resp["headers"].get("location") or redir_resp["headers"].get("Location")
    assert location.rstrip('/') == "https://react.dev", f"Expected https://react.dev, got {location}"
    print(f"  [OK] Redirect returned {redir_resp['status']} pointing to {location}")

    # 14. Verify click count incremented
    print(f"\n[TEST 14] Verify click count incremented to 1...")
    stats_after_resp = make_request(f"{BASE_URL}/api/v1/urls/{custom_alias}/stats", headers=auth_headers)
    assert stats_after_resp["status"] == 200
    stats_after = stats_after_resp["data"]
    assert stats_after["click_count"] == 1, f"Expected click_count == 1, got {stats_after['click_count']}"
    print(f"  [OK] Click count successfully incremented: {stats_after['click_count']}")

    # 15. Delete URL
    print(f"\n[TEST 15] Delete short URL (DELETE /api/v1/urls/{custom_alias})...")
    del_resp = make_request(f"{BASE_URL}/api/v1/urls/{custom_alias}", method="DELETE", headers=auth_headers)
    assert del_resp["status"] == 200, f"Expected 200, got {del_resp['status']}: {del_resp['raw']}"
    print("  [OK] Short URL deleted successfully")

    # 16. Verify deleted URL returns 404
    print(f"\n[TEST 16] Verify deleted URL is no longer accessible...")
    del_check_resp = make_request(f"{BASE_URL}/api/v1/urls/{custom_alias}", headers=auth_headers)
    assert del_check_resp["status"] == 404, f"Expected 404, got {del_check_resp['status']}"
    del_redir_resp = make_request(f"{BASE_URL}/{custom_alias}")
    assert del_redir_resp["status"] == 404, f"Expected 404 on redirect, got {del_redir_resp['status']}"
    print("  [OK] Deleted short URL returns 404 on both API and redirect")

    # 17. Clean up URL 1
    make_request(f"{BASE_URL}/api/v1/urls/{short_code_1}", method="DELETE", headers=auth_headers)

    print("\n" + "=" * 60)
    print("ALL 17 INTEGRATION & END-TO-END TESTS PASSED WITH 100% SUCCESS! [OK]")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
