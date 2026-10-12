@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ======================================================================
echo    PUSH AGENT-ORCHESTRATION-SHOWCASE TO GITHUB (PORTFOLIO PAGES)
echo ======================================================================
echo Authenticated User: mibrahimai
echo Target Remote:     ssh://git@ssh.github.com:443/mibrahimai/agent-orchestration-showcase.git
echo Public Pages:      https://mibrahimai.github.io/agent-orchestration-showcase/
echo.

if not exist ".git" (
    echo [*] Initializing showcase git repository...
    git init
    git branch -M main
    git config user.name "Muhammad Ibrahim"
    git config user.email "mibrahimai@users.noreply.github.com"
)

git remote remove origin 2>nul
git remote add origin ssh://git@ssh.github.com:443/mibrahimai/agent-orchestration-showcase.git

echo [*] Staging showcase files...
git add .

echo [*] Committing changes...
git commit -m "feat: Distributed Agent Orchestrator Hollow Showcase & AI Architecture Academy"

echo [*] Pushing to GitHub (main branch)...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================================
    echo [SUCCESS] Showcase pushed successfully!
    echo.
    echo 1. Repository:   https://github.com/mibrahimai/agent-orchestration-showcase
    echo 2. Web Pages:    https://mibrahimai.github.io/agent-orchestration-showcase/
    echo.
    echo To enable GitHub Pages:
    echo   - Go to: https://github.com/mibrahimai/agent-orchestration-showcase/settings/pages
    echo   - Under "Source", select "GitHub Actions"
    echo ======================================================================
) else (
    echo.
    echo [NOTE] If GitHub returned "Repository not found":
    echo   Please create the empty repository on GitHub first:
    echo   https://github.com/new (Name: agent-orchestration-showcase)
    echo   Then re-run this script!
)

pause
