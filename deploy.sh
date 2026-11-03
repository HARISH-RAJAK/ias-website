#!/bin/bash

echo "Cleaning old files...."

# Root me agar .htaccess nahi hai aur frontend me hai toh pehle copy karo
if [ ! -f ".htaccess" ] && [ -f "frontend/.htaccess" ]; then
    cp frontend/.htaccess .
fi

# backend, dist, .env*, .git, deploy.sh, .htaccess ko chhodkar baki delete karo
find . -maxdepth 1 -mindepth 1 \
! -name "backend" \
! -name "dist" \
! -name ".env*" \
! -name ".git" \
! -name "deploy.sh" \
! -name ".htaccess" \
-exec rm -rf {} +

echo "Moving dist files..."

# dist ka content root me bahar lao
if [ -d "dist" ]; then
    cp -rn dist/* . 2>/dev/null || mv dist/* . 2>/dev/null || true
    cp -rn dist/.[!.]* . 2>/dev/null || mv dist/.[!.]* . 2>/dev/null || true
    rm -rf dist
fi

echo "Done!"
