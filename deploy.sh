#!/bin/bash

echo "Deploying to public_html..."

# 1. public_html me se purani files clean karo (ias-website, backend, .env, .well-known chhodkar)
find .. -maxdepth 1 -mindepth 1 \
! -name "ias-website" \
! -name "backend" \
! -name ".env*" \
! -name ".well-known*" \
-exec rm -rf {} +

# 2. backend files ko ../backend me sync karo
mkdir -p ../backend
cp -r backend/. ../backend/ 2>/dev/null || true

# 3. dist ke content ko public_html me copy karo (including hidden files)
if [ -d "dist" ]; then
    cp -r dist/. .. 2>/dev/null || true
fi

# 4. React routing ke liye root .htaccess set karo
if [ -f "frontend/.htaccess" ]; then
    cp frontend/.htaccess ../.htaccess
fi

# 5. Security: ias-website source code ko browser se direct download hone se bachao
echo -e "<IfModule mod_authz_core.c>\n    Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n    Deny from all\n</IfModule>" > .htaccess 2>/dev/null || true

echo "Done! Successfully deployed to public_html"
