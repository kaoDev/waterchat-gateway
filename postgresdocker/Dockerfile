FROM postgres:latest
EXPOSE 5432
COPY dbscripts/init.sql /docker-entrypoint-initdb.d/10-init.sql
COPY dbscripts/waterchat.sql /docker-entrypoint-initdb.d/20-database.sql
