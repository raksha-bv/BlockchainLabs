#!/bin/bash
mkdir -p .solcx
cd .solcx
curl -o solc-v0.8.0 https://binaries.soliditylang.org/linux-amd64/solc-linux-amd64-v0.8.0+commit.c7dfd78e
chmod +x solc-v0.8.0