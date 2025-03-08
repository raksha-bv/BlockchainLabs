#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Create the solcx directory
mkdir -p .solcx

# Download the solc binary directly
cd .solcx
echo "Downloading solc 0.8.0..."
curl -L -o solc-v0.8.0 https://binaries.soliditylang.org/linux-amd64/solc-linux-amd64-v0.8.0+commit.c7dfd78e
chmod +x solc-v0.8.0

# Additional solc versions if needed
echo "Downloading solc 0.8.2..."
curl -L -o solc-v0.8.2 https://binaries.soliditylang.org/linux-amd64/solc-linux-amd64-v0.8.2+commit.661d1103
chmod +x solc-v0.8.2

# Create a version list file for solcx to discover versions
echo "Creating versions.txt..."
echo "0.8.0,`pwd`/solc-v0.8.0" > versions.txt
echo "0.8.2,`pwd`/solc-v0.8.2" >> versions.txt

# Print confirmation
echo "Solidity compilers installed:"
ls -la
cat versions.txt

# Return to the original directory
cd ..

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Verify solcx installation
echo "Verifying solcx installation..."
python -c "
import solcx
import os
print(f'Current directory: {os.getcwd()}')
print(f'Content of .solcx: {os.listdir(\".solcx\")}')
print(f'SOLCX_BINARY_PATH: {os.environ.get(\"SOLCX_BINARY_PATH\", \"Not set\")}')
try:
    print(f'Installed versions: {solcx.get_installed_solc_versions()}')
except Exception as e:
    print(f'Error checking versions: {e}')
"