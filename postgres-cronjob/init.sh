#!/bin/sh

PGUSER=${POSTGRES_USER}
PGPASSWORD=${POSTGRES_PASSWORD}
PGHOST=postgres-for-next-app
PGDATABASE=${POSTGRES_DB}

export PGPASSWORD

pg_dump -h $PGHOST -U $PGUSER -d $PGDATABASE > /backups/backup_$(date +%F_%T).sql

if [ $? -ne 0 ]; then
    echo "❌ Backup failed at $(date)" >> /var/log/cron-output.txt
    exit 1
fi 

# Compress the backup file
gzip /backups/backup_$(date +%F_%T).sql
if [ $? -ne 0 ]; then
    echo "❌ Compression failed at $(date)" >> /var/log/cron-output.txt
    exit 1
fi
# Remove old backups older than 7 days
find /backups -type f -name "*.sql.gz" -mtime +7 -exec rm {} \;

# Log the successful backup
echo "✅ Backup and compression completed successfully at $(date)" >> /var/log/cron-output.txt
# Check if the backup file exists
if [ -f /backups/backup_$(date +%F_%T).sql.gz ]; then
    echo "✅ Backup file exists at $(date)" >> /var/log/cron-output.txt
else
    echo "❌ Backup file does not exist at $(date)" >> /var/log/cron-output.txt
fi
