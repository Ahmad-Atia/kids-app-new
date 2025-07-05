@echo off
echo ==========================================
echo   Testing Auth Login Endpoint (Port 3000)
echo ==========================================

echo Testing login endpoint at http://192.168.178.63:3000/api/auth/login
echo.

echo [Test 1] Testing with email/password format:
curl -X POST "http://192.168.178.63:3000/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}" ^
  -w "\nStatus: %%{http_code}\n\n" ^
  -v

echo [Test 2] Testing with username/password format:
curl -X POST "http://192.168.178.63:3000/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"username\":\"test@example.com\",\"password\":\"password123\"}" ^
  -w "\nStatus: %%{http_code}\n\n"

echo [Test 3] Testing with different credentials:
curl -X POST "http://192.168.178.63:3000/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}" ^
  -w "\nStatus: %%{http_code}\n\n"

echo [Test 4] Testing server response to invalid JSON:
curl -X POST "http://192.168.178.63:3000/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"invalid\":\"json\"}" ^
  -w "\nStatus: %%{http_code}\n\n"

echo [Test 5] Testing server health/connectivity:
curl -X GET "http://192.168.178.63:3000/api/health" ^
  -w "\nStatus: %%{http_code}\n\n"

echo [Test 6] Testing basic connectivity:
curl -X GET "http://192.168.178.63:3000/" ^
  -w "\nStatus: %%{http_code}\n\n"

echo [Test 7] Testing with explicit Content-Type and User-Agent:
curl -X POST "http://192.168.178.63:3000/api/auth/login" ^
  -H "Content-Type: application/json; charset=utf-8" ^
  -H "Accept: application/json" ^
  -H "User-Agent: PartiZip-Test/1.0" ^
  -d "{\"username\":\"test@example.com\",\"password\":\"password123\"}" ^
  -w "\nStatus: %%{http_code}\n\n"

echo.
echo Testing completed. Check the responses above for details.
echo Note: Status 200 = Success, 401 = Unauthorized, 404 = Not Found, 500 = Server Error
echo.

pause