#!/bin/bash

# Stop the running container
docker stop dashboard-backend

# Remove the running container
docker rm -f dashboard-backend

# Start the container
docker run --name dashboard-backend -d -p 6000:3000 dashboard-backend