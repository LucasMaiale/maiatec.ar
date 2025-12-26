@echo off
cd /d %~dp0

:loop
git status --porcelain index.htm > cambios.txt

for %%A in (cambios.txt) do (
    git add index.htm
    git commit -m "update clima"
    git push
    goto wait
)

:wait
del cambios.txt
timeout /t 30 /nobreak > nul
goto loop
