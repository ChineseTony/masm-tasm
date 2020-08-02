@echo off
if "%1"=="MASM" goto MASM
if "%1"=="TASM" goto TASM
goto end
:MASM
set path=%path%;c:\masm
masm T.ASM;
link T.OBJ;
if  exist T.exe goto MASMNEXT
masm T.ASM;>T.txt
link T.OBJ;>>T.txt
:MASMNEXT
if "%2"=="run" T.exe
if "%2"=="debug" debug T.exe
goto end

:TASM
set path=%path%;c:\tasm
tasm /zi T.ASM
tlink /v/3 T.OBJ
if  exist T.exe goto TASMNEXT
tasm  T.ASM>T.txt
tlink  T.OBJ>>T.txt
:TASMNEXT
if "%2"=="run" T.exe
if "%2"=="debug" copy c:\\tasm\\TDC2.TD TDCONFIG.TD
if "%2"=="debug" td T.exe
goto end
@echo on
:end
if "%3"=="p" pause
if "%3"=="p" exit
if "%3"=="e" exit