#!/bin/sh

set -e

PGUSER=${POSTGRES_USER}
PGPASSWORD=${POSTGRES_PASSWORD}
PGHOST=postgres-for-next-app
PGDATABASE=${POSTGRES_DB}
S3_BUCKET=${AWS_S3_BUCKET_NAME}
AWS_REGION=${AWS_S3_REGION}

export PGPASSWORD
export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
export AWS_DEFAULT_REGION=${AWS_REGION}

BACKUP_DIR=/backups
TIMESTAMP=$(date +%F_%H-%M-%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"
BACKUP_FILE_GZ="${BACKUP_FILE}.gz"

# Create the backup
pg_dump -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" > "$BACKUP_FILE"
if [ $? -ne 0 ]; then
    echo "❌ Backup failed at $(date)" >> /var/log/cron-output.txt
    exit 1
fi

# Compress it
gzip "$BACKUP_FILE"

# Remove old backups
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -exec rm {} \;

# Upload to S3
aws s3 cp "$BACKUP_FILE_GZ" "s3://${S3_BUCKET}/db_backups/"
if [ $? -eq 0 ]; then
    echo "✅ Backup uploaded to S3 at $(date)" >> /var/log/cron-output.txt
else
    echo "❌ Upload to S3 failed at $(date)" >> /var/log/cron-output.txt
fi
