#!/bin/sh
# Script de inicialização para Railway
PORT=${PORT:-8080}

# Usar php.ini customizado se existir
if [ -f /app/php.ini ]; then
    php -c /app/php.ini -S 0.0.0.0:$PORT router.php
else
    # Se não houver php.ini, definir diretivas via linha de comando
    php -d upload_max_filesize=20M \
        -d post_max_size=25M \
        -d max_file_uploads=50 \
        -d max_execution_time=300 \
        -d max_input_time=300 \
        -d memory_limit=256M \
        -S 0.0.0.0:$PORT router.php
fi
