#!/bin/sh
# Script de inicialização para Railway
PORT=${PORT:-8080}
php -S 0.0.0.0:$PORT -t admin

