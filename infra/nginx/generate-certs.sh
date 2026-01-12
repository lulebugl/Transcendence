#!/bin/sh
set -e

if [ ! -f /certs/fullchain.pem ] || [ ! -f /certs/privkey.pem ]; then
  echo "Generating SSL certificates..."
  apk add --no-cache openssl > /dev/null 2>&1
  
  # Generate private key
  openssl genrsa -out /certs/privkey.pem 2048
  
  # Try to generate certificate with SAN (Subject Alternative Name)
  # Fallback to basic cert if -addext is not supported
  if openssl req -new -x509 -key /certs/privkey.pem -out /certs/fullchain.pem \
    -days 365 -subj '/CN=localhost' \
    -addext 'subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1,IP:::1' 2>/dev/null; then
    echo "Certificate generated with SAN extensions"
  else
    echo "Generating certificate without SAN extensions (older OpenSSL)"
    openssl req -new -x509 -key /certs/privkey.pem -out /certs/fullchain.pem \
      -days 365 -subj '/CN=localhost'
  fi
  
  chmod 644 /certs/fullchain.pem
  chmod 600 /certs/privkey.pem
  echo "Certificates generated successfully"
  ls -la /certs/
else
  echo "Certificates already exist"
fi
