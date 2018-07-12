FROM node:8-alpine
MAINTAINER Nikita Luchko <luchkonikita@gmail.com>

ENV CHROME_BIN=/usr/bin/chromium-browser
RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
      grep \
      chromium@edge \
      nss@edge

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN yarn global add zorki && \
  mkdir -p /var/zorki/config

WORKDIR /var/zorki
CMD zorki run --config=/var/zorki/config/zorki.json
