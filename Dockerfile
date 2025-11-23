# Dockerfile para o painel admin PHP
FROM php:8.2-cli

# Instalar extensões PHP necessárias (se precisar de mais, adicione aqui)
RUN docker-php-ext-install -j$(nproc) opcache

# Criar diretório de trabalho
WORKDIR /app

# Copiar todos os arquivos do projeto
COPY . /app

# Garantir que o php.ini customizado esteja disponível
# O start.sh irá usá-lo se existir

# Criar diretórios necessários com permissões
RUN mkdir -p /app/uploads/passeios && \
    mkdir -p /app/data && \
    chmod -R 755 /app/uploads && \
    chmod -R 755 /app/data

# Tornar script de inicialização executável
RUN chmod +x /app/start.sh

# Expor porta (Railway injeta $PORT)
EXPOSE 8080

# Comando para iniciar o servidor PHP na pasta admin
CMD ["/app/start.sh"]

