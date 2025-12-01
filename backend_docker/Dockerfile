FROM php:8.4-fpm-alpine

RUN apk update && apk add --no-cache \
    git \
    curl \
    unzip \
    zip \
    libpng-dev \
    libxml2-dev \
    oniguruma-dev \
    icu-dev \
    && docker-php-ext-install pdo_mysql mbstring gd intl

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

CMD ["php-fpm"]
