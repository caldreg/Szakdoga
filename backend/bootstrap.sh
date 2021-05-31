#!/bin/bash

# Clone the repository
git clone https://username_password@stash.sed.hu/scm/dep/inclouded-monitor.git
cd inclouded-monitor/backend

# Install the dependencies
npm install

# Build & run backend server in production mode
npm run build
npm run start:prod