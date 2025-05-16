FROM alpine

RUN apk add --no-cache bash curl postgresql-client busybox-suid

COPY cronjob.sh /cronjob.sh
RUN echo "* * * * * /cronjob.sh" > /etc/crontabs/root

RUN chmod +x /cronjob.sh

CMD ["crond", "-f", "-l", "2"]
