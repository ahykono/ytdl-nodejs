@echo off

:loop
set /p args="Insert -> "
node . %args%
goto loop
