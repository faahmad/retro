#!/bin/bash

# Exit on error
set -e

psql -U me -d retro_dev -f database/seed.sql