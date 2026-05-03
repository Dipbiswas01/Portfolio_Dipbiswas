@echo off
cd "c:\Users\bddip\Desktop\Protfolio Dip Biswas"

echo Checking git status...
git status

echo.
echo Adding all changes...
git add .

echo.
echo Committing changes...
git commit -m "Update portfolio: tighten spacing, hero text 20-22px, Google Sheets integration, remove Work section, update gallery frames"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo Done! Changes pushed to GitHub.
pause
