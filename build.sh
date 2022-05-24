#!/bin/bash
red=`tput setaf 1`
green=`tput setaf 2`
yellow=`tput setaf 3`
blue=`tput setaf 4`
reset=`tput sgr0`

function message {
  printf $blue
  echo $@
  printf $reset
}

message "Moving to repository root"
cd "$(dirname "$0")"

message "Downloading PHP binaries for Windows..."
rm -Rf bin
mkdir bin
cd bin
mkdir php
cd php
curl -o php-win32.zip https://windows.php.net/downloads/releases/archives/php-7.4.9-Win32-vc15-x86.zip
message "Extracting PHP binary..."
unzip php-win32.zip -d ./win32
rm php-win32.zip
message "PHP binary extracted"
cp ../../php.ini ./win32/php.ini

message "Downloading PHP binaries for Mac..."
curl --insecure --show-error --location --globoff https://github.com/php/php-src/archive/refs/tags/php-7.4.29.tar.gz | tar -zx
message "PHP source code downloaded"
cd php-src-php-7.4.29
message "Configuring PHP source code..."
./buildconf --force
mkdir ../darwin
./configure --prefix=$(pwd)/../darwin --enable-shared=no --enable-static=yes --without-iconv --without-pdo-sqlite --without-sqlite3 -with-openssl=$(which openssl)
message "Installing PHP binaries for Mac..."
make -j8
make install
cd ..
rm -r -f php-src-php-7.4.29

message "Installing PHP dependencies..."
cd ../../
cd webserver
composer install
message "PHP dependencies installed"

message "Building packages..."
cd ..
npm run-script build

printf $green
echo "🍺  Build done! Open ./build to see the packages."
printf $reset
