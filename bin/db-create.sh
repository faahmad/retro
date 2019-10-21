#!/bin/bash

# Exit on error
set -e

psql -U me -d postgres -c "DROP DATABASE retro_dev;"
psql -U me -d postgres -c "CREATE DATABASE retro_dev;"
psql -U me -d retro_dev -f database/schema.sql