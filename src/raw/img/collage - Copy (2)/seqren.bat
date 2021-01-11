@echo off

setlocal enableDelayedExpansion

set i=0

for /r %%a in (*.jpg) do (
	ren "%%~a" "!i!%%~xa"
	set /a i+=1
)