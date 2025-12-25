from playwright.sync_api import sync_playwright

def verify_sweets_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Navigate to the sign-in page to check if it redirects
        try:
            page.goto("http://localhost:8080/sweets")
            page.wait_for_load_state("networkidle")

            # Since we are not logged in, it should redirect to sign-in or show sign-in component
            # Based on the code, ProtectedRoute redirects to sign-in if not authenticated

            # Take a screenshot of what happens when accessing /sweets without auth
            page.screenshot(path="verification/sweets_unauth.png")
            print("Screenshot taken: verification/sweets_unauth.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_sweets_page()
