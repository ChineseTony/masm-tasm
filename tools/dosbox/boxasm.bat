@echo off
if "%1"=="MASM" goto MASM
if "%1"=="TASM" goto TASM
goto end
:MASM
set path=%path%;c:\masm
masm T.ASM;>T.txt
link T.OBJ;>>T.txt
if  exist T.exe goto MASMNEXT
goto final
:MASMNEXT
if "%2"=="run" T.exe
if "%2"=="debug" debug T.exe
goto end

:TASM
set path=%path%;c:\tasm
tasm  T.ASM>T.txt
tlink  T.OBJ>>T.txt
if  exist T.exe goto TASMNEXT
goto final
:TASMNEXT
if "%2"=="run" T.exe
if "%2"=="debug" copy c:\\tasm\\TDC2.TD TDCONFIG.TD
if "%2"=="debug" td T.exe
goto end
@echo on
:end
if "%3"=="p" pause
if "%3"=="k" goto final2
:final
exit
:final2