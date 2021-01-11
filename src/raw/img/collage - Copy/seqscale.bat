@echo off

setlocal enableDelayedExpansion

set "WIDTH=1024"
set i=0

for /r %%a in (*.jpg) do (
	set "fileName=%%~a"
	set "originalFilePath=!fileName!"
	echo Scaling: "!fileName!", to %WIDTH%px width
	if "!fileName:original=!" equ "!fileName!" (
		set "originalFilePath=%%~na-original%%~xa"
		ren "%%~a" !originalFilePath!

		if exist "!fileName!" (
			del "!fileName!"
		)

		convert !originalFilePath! -resize %WIDTH% -quality 100 "%%~a"
	)
	set /a i+=1
)