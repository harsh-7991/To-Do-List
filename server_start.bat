@ECHO OFF
ECHO Sarting Server

start cmd.exe /K python main.py

cd ./nginx-1.23.3/
start cmd.exe /C start nginx

ECHO Server Started And Running

@REM PAUSE


