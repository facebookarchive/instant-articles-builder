FROM php:7.4.16-cli

ARG GIT_BRANCH=feature/webserver-cache

RUN apt-get update && apt-get install -y libmemcached-dev zlib1g-dev \
    && pecl install memcached-3.1.5 \
    && docker-php-ext-enable memcached

RUN apt-get install -y git wget

EXPOSE 8000

WORKDIR /

# Install composer
RUN wget -O composer-setup.php https://getcomposer.org/installer && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    rm composer-setup.php

# Clone Instant Articles Builder GitHub repo
RUN git clone https://github.com/facebook/instant-articles-builder.git && \
    cd instant-articles-builder && \
    git checkout ${GIT_BRANCH}

WORKDIR /instant-articles-builder/webserver

# Install IA Builder webserver dependencies
RUN composer install

CMD ["php", "-S", "0.0.0.0:8000"]
