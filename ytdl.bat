@echo off
cd ../ytdl

:loop
set /p args="Insert -> "
node . %args%
goto loop