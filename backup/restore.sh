#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
mongorestore $DIR -h localhost -d task -u root -p root --authenticationDatabase admin