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
curl -o php.zip https://windows.php.net/downloads/releases/archives/php-7.4.9-Win32-vc15-x86.zip
message "Extracting PHP binary..."
unzip php.zip -d ./php
rm php.zip
message "PHP binary extracted"
cp ../php.ini ./php/php.ini

message "Installing PHP dependencies..."
cd ..
cd webserver
composer install
message "PHP dependencies installed"

message "Building packages..."
cd ..
npm run-script build

printf $green
echo "🍺  Build done! Open ./build to see the packages."
printf $reset
