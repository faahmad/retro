#!/bin/bash

user_name=$1
db_name=$2

# Exit on error
set -e

if [[ ! -z $db_name && ! -z $user_name ]]; then
    psql -c "DROP DATABASE IF EXISTS $db_name;"
    psql -c "CREATE DATABASE $db_name;"
    psql -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $user_name;"
    psql -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $user_name;"
    psql -c "GRANT ALL PRIVILEGES ON DATABASE $db_name TO $user_name;"
    psql -h localhost -d $db_name -U $user_name -f bin/init.sql
else 
    psql -c "DROP DATABASE db_retro;"
    psql -c "CREATE DATABASE db_retro;"
    psql -h localhost -d db_retro -f bin/init.sql
fi 

