#!/bin/bash

echo "Cleaning old files..."

# clicknoffice aur dist ko chhodkar baki delete
find . -maxdepth 1 -mindepth 1 \
! -name "backend" \
! -name "dist" \
! -name ".env" \
-exec rm -rf {} +

echo "Moving dist files..."

# dist ka content bahar lao
mv dist/* .

# hidden files agar hain
mv dist/.[!.]* . 2>/dev/null

# dist folder delete
rm -rf dist

echo "Done!"