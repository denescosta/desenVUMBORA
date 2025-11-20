# Guia de Deploy - Painel Admin PHP

## ✅ Compatibilidade

O painel admin PHP foi desenvolvido para funcionar em **hospedagens compartilhadas tradicionais** como:

- Hostinger
- HostGator
- Bluehost
- Locaweb
- UOL Host
- E outras com suporte a PHP

## 📋 Requisitos

### Versão do PHP

- **Mínimo:** PHP 7.4
- **Recomendado:** PHP 8.0 ou superior
- **Testado com:** PHP 8.2

### Extensões PHP Necessárias

- `json` (geralmente já incluída)
- `fileinfo` (para upload de imagens)
- `gd` ou `imagick` (opcional, para redimensionamento de imagens)

### Permissões de Pastas

As seguintes pastas precisam ter **permissão de escrita** (755 ou 775):

```
uploads/
uploads/passeios/
data/
```

## 🔧 Passos para Deploy

### 1. Upload dos Arquivos

Faça upload de **todos os arquivos** do projeto para o servidor via FTP/SFTP ou painel de controle.

### 2. Configurar Permissões

No painel de controle da hospedagem ou via FTP:

- `uploads/` → Permissão: **755** ou **775**
- `uploads/passeios/` → Permissão: **755** ou **775**
- `data/` → Permissão: **755** ou **775**
- `data/passeios.json` → Permissão: **644** (se já existir)

### 3. Alterar Credenciais de Acesso

**IMPORTANTE:** Antes de colocar no ar, altere as credenciais em `admin/config.php`:

```php
define('ADMIN_USER', 'admin'); // MUDE ISSO
define('ADMIN_PASS', 'senha123'); // MUDE ISSO - use senha forte!
```

**Recomendação:** Use uma senha forte com pelo menos 12 caracteres, incluindo letras, números e símbolos.

### 4. Verificar Caminhos

Se a estrutura de pastas for diferente, pode ser necessário ajustar em `admin/config.php`:

```php
define('DATA_PATH', '../data/passeios.json');
define('UPLOADS_PATH', '../uploads/passeios/');
```

### 5. Testar o Painel

Acesse: `https://seudominio.com/admin/` ou `https://seudominio.com/admin/login.php`

## ⚠️ Ajustes Possíveis

### Se os uploads não funcionarem:

1. Verifique as permissões das pastas (deve ser 755 ou 775)
2. Verifique o `upload_max_filesize` no PHP (recomendado: 10M)
3. Verifique o `post_max_size` no PHP (deve ser maior que `upload_max_filesize`)

### Se o JSON não salvar:

1. Verifique a permissão da pasta `data/` (deve ser 755 ou 775)
2. Verifique a permissão do arquivo `passeios.json` (deve ser 644 ou 666)

### Se houver erro de sessão:

- Geralmente funciona automaticamente, mas se houver problemas, verifique se a pasta `tmp` do PHP tem permissão de escrita.

## 🔒 Segurança

### Antes de colocar no ar:

1. ✅ Alterar credenciais de admin
2. ✅ Usar HTTPS (SSL)
3. ✅ Considerar adicionar proteção contra brute force
4. ✅ Manter backups regulares do `passeios.json`

### Recomendações Adicionais:

- Não compartilhe as credenciais de acesso
- Faça backups regulares do arquivo `data/passeios.json`
- Mantenha o PHP atualizado

## 📝 Estrutura de Arquivos Necessária

```
/
├── admin/
│   ├── config.php
│   ├── login.php
│   ├── painel.php
│   ├── formulario-passeio.php
│   ├── salvar-passeio.php
│   ├── deletar-passeio.php
│   └── logout.php
├── data/
│   └── passeios.json (será criado automaticamente se não existir)
├── uploads/
│   └── passeios/ (será criado automaticamente)
├── assets/
├── components/
├── pages/
├── sections/
└── index.html
```

## 🚀 Após o Deploy

1. Teste o login no painel admin
2. Crie um passeio de teste
3. Verifique se as imagens são carregadas corretamente
4. Teste editar e deletar passeios
5. Verifique se o site frontend está exibindo os passeios corretamente

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs de erro do PHP (geralmente em `error_log` ou no painel de controle)
2. Verifique as permissões das pastas
3. Verifique se a versão do PHP é compatível
4. Teste com um arquivo PHP simples (`<?php phpinfo(); ?>`) para verificar configurações
