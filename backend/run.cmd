@echo off
setlocal ENABLEDELAYEDEXPANSION

rem Navigate to this script's directory
pushd "%~dp0"

if not exist node_modules (
  echo Installing dependencies...
  call npm.cmd ci --no-audit --no-fund || goto :error
)

set PORT=4000
set MONGO_URI=memory

echo Starting server on http://localhost:%PORT% with in-memory MongoDB...
node src\server.js

popd
exit /b 0

:error
popd
exit /b 1


