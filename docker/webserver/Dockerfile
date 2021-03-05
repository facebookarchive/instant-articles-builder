ARG PHP_IMAGE=7.2-alpine
FROM php:${PHP_IMAGE}

# Install git
RUN apk update
RUN apk add git

# Install composer
RUN apk add composer

EXPOSE 8000

WORKDIR /ia-builder

# Clone Instant Articles Builder GitHub repo
RUN git clone https://github.com/facebook/instant-articles-builder.git

WORKDIR /app

# Copy all contents from the webserver folder in the IA repo to our current dir
RUN cp -R /ia-builder/instant-articles-builder/webserver/* ./

# Install IA Builder webserver dependencies
RUN composer install

CMD ["php", "-S", "0.0.0.0:8000"]