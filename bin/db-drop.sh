#!/bin/bash

# Exit on error
set -e

psql -U me -d postgres -c "DROP DATABASE IF EXISTS retro_dev;"
psql -U me -d postgres -c "DROP DATABASE IF EXISTS retro_test;"