FROM alpine

RUN apk add --no-cache bash curl postgresql-client busybox-suid python3 py3-pip \
    && pip3 install awscli
    
COPY init.sh /init.sh
RUN echo "* * * * * /init.sh" > /etc/crontabs/root

RUN chmod +x /init.sh

CMD ["crond", "-f", "-l", "2"]
