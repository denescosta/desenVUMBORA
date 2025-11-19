# Dockerfile para o painel admin PHP
FROM php:8.2-cli

# Instalar extensões PHP necessárias (se precisar de mais, adicione aqui)
RUN docker-php-ext-install -j$(nproc) opcache

# Criar diretório de trabalho
WORKDIR /app

# Copiar todos os arquivos do projeto
COPY . /app

# Criar diretórios necessários com permissões
RUN mkdir -p /app/uploads/passeios && \
    mkdir -p /app/data && \
    chmod -R 755 /app/uploads && \
    chmod -R 755 /app/data

# Expor porta (Railway injeta $PORT)
EXPOSE 8080

# Comando para iniciar o servidor PHP na pasta admin
CMD php -S 0.0.0.0:${PORT:-8080} -t admin

