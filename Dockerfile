FROM php:8.3-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libicu-dev libzip-dev zip libonig-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libpq-dev

# PHP extensions
RUN docker-php-ext-install intl pdo pdo_mysql zip opcache

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www

# Copy your app (optional, since we also mount it in docker-compose)
COPY . .

# Permissions (optional)
RUN chown -R www-data:www-data /var/www
