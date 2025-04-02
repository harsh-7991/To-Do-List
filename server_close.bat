@ECHO OFF
ECHO Closing Server

cd ./nginx-1.23.3/
start cmd.exe /C nginx -s quit

ECHO Server Closed

@REM PAUSE


