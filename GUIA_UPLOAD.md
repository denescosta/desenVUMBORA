# Guia de Upload - Hostinger/HostGator

## 📦 Preparação dos Arquivos

Antes de fazer upload, certifique-se de que todos os arquivos estão prontos:

```
desenVUMBORA/
├── admin/              ← Pasta do painel admin
├── assets/             ← CSS, JS, imagens
├── components/         ← Componentes HTML
├── data/               ← JSON dos passeios
├── pages/              ← Páginas do site
├── sections/           ← Seções HTML
├── uploads/            ← Imagens dos passeios
├── index.html          ← Página inicial
└── ... outros arquivos
```

## 🔧 Método 1: Upload via FTP (Recomendado)

### Passo 1: Instalar Cliente FTP

- **FileZilla** (Windows/Mac/Linux): https://filezilla-project.org/
- **WinSCP** (Windows): https://winscp.net/
- **Cyberduck** (Mac): https://cyberduck.io/

### Passo 2: Obter Credenciais FTP

No painel da hospedagem (cPanel/Plesk), procure por:

- **FTP Accounts** ou **Gerenciador de FTP**
- Anote:
  - **Host/Servidor:** ftp.seudominio.com (ou IP fornecido)
  - **Usuário:** seu_usuario_ftp
  - **Senha:** sua_senha_ftp
  - **Porta:** 21 (FTP) ou 22 (SFTP)

### Passo 3: Conectar

1. Abra o FileZilla (ou outro cliente)
2. Preencha:
   - **Host:** ftp.seudominio.com
   - **Usuário:** seu_usuario_ftp
   - **Senha:** sua_senha_ftp
   - **Porta:** 21
3. Clique em "Conectar"

### Passo 4: Navegar até a Pasta Correta

- No lado direito (servidor), navegue até:
  - `public_html/` (Hostinger)
  - `public_html/` ou `www/` (HostGator)
  - `htdocs/` (alguns servidores)

### Passo 5: Fazer Upload

1. No lado esquerdo (seu computador), navegue até a pasta do projeto
2. Selecione TODOS os arquivos e pastas
3. Arraste para a pasta `public_html/` no servidor
4. Aguarde o upload completar

## 🌐 Método 2: Upload via Painel (cPanel)

### Passo 1: Acessar File Manager

1. Faça login no cPanel
2. Procure por **"File Manager"** ou **"Gerenciador de Arquivos"**
3. Clique para abrir

### Passo 2: Navegar até public_html

1. No File Manager, vá até a pasta `public_html/`
2. Clique nela para abrir

### Passo 3: Fazer Upload

1. Clique no botão **"Upload"** no topo
2. Selecione todos os arquivos do projeto
3. Aguarde o upload completar
4. Ou arraste e solte os arquivos diretamente

## ✏️ Método 3: Editar Arquivos Diretamente pelo Painel

**SIM, você pode editar arquivos diretamente pelo painel!** Não precisa sempre fazer upload.

### Como Editar:

1. **Acesse o File Manager** no cPanel
2. **Navegue até o arquivo** que deseja editar (ex: `admin/config.php`)
3. **Clique com botão direito** no arquivo
4. Selecione **"Edit"** ou **"Editar"**
5. O editor abre no navegador
6. **Faça suas alterações**
7. Clique em **"Save Changes"** ou **"Salvar"**
8. Pronto! As alterações são aplicadas imediatamente

### Tipos de Arquivos que Pode Editar:

- ✅ Arquivos de texto (`.txt`, `.html`, `.css`, `.js`, `.php`, `.json`)
- ✅ Arquivos de configuração
- ✅ Código fonte
- ❌ Arquivos binários (imagens, PDFs) - estes precisam ser substituídos via upload

### Quando Usar Cada Método:

**Editar pelo Painel:**

- ✅ Ajustes rápidos
- ✅ Mudanças em textos
- ✅ Correções pequenas
- ✅ Alterar configurações (ex: credenciais do admin)

**Editar Localmente + Upload:**

- ✅ Mudanças grandes em múltiplos arquivos
- ✅ Usar seu editor preferido (VS Code, etc.)
- ✅ Ter controle de versão (Git)
- ✅ Trabalhar offline

### Exemplo Prático:

**Cenário:** Você quer alterar a senha do admin:

1. Abra File Manager
2. Vá até `admin/config.php`
3. Clique com botão direito → "Edit"
4. Altere a linha:
   ```php
   define('ADMIN_PASS', 'sua_nova_senha');
   ```
5. Salve
6. Pronto! Sem precisar baixar, editar e fazer upload novamente

## ⚙️ Configurações Pós-Upload

### 1. Configurar Permissões

No File Manager ou FTP, configure as permissões:

```
uploads/              → 755 ou 775
uploads/passeios/     → 755 ou 775
data/                 → 755 ou 775
data/passeios.json    → 644 ou 666 (se já existir)
```

**Como fazer:**

- No File Manager: Clique com botão direito → "Change Permissions" → Marque 755
- No FTP: Clique com botão direito → "File Permissions" → Digite 755

### 2. Alterar Credenciais do Admin

Edite `admin/config.php` e altere:

```php
define('ADMIN_USER', 'admin'); // MUDE ISSO
define('ADMIN_PASS', 'senha123'); // MUDE ISSO
```

**Como editar:**

- No File Manager: Clique com botão direito → "Edit"
- Ou baixe, edite localmente, e faça upload novamente

### 3. Verificar Versão do PHP

No cPanel, procure por:

- **"Select PHP Version"** ou **"Versão do PHP"**
- Selecione **PHP 8.0** ou superior (recomendado)

## 🔍 Verificar se Funcionou

1. Acesse: `https://seudominio.com`

   - Deve abrir a página inicial

2. Acesse: `https://seudominio.com/admin/`

   - Deve abrir o painel de login

3. Teste criar um passeio no painel admin

## 📝 Estrutura Final no Servidor

```
public_html/
├── admin/
│   ├── config.php
│   ├── login.php
│   ├── painel.php
│   └── ...
├── assets/
│   ├── css/
│   ├── js/
│   └── ...
├── components/
├── data/
│   └── passeios.json
├── pages/
├── sections/
├── uploads/
│   └── passeios/
├── index.html
└── ...
```

## ⚠️ Problemas Comuns

### Arquivos não aparecem no site

- Verifique se fez upload para `public_html/` (não para a raiz)
- Verifique se o `index.html` está na pasta correta

### Erro 403 (Permissão Negada)

- Verifique as permissões das pastas (devem ser 755)
- Verifique se o arquivo `index.html` tem permissão 644

### Upload de imagens não funciona

- Verifique permissão da pasta `uploads/` (deve ser 755 ou 775)
- Verifique `upload_max_filesize` no PHP (recomendado: 10M)

### Painel admin não funciona

- Verifique se o PHP está ativado
- Verifique as credenciais em `admin/config.php`
- Verifique permissões da pasta `data/`

## 🔄 Atualizar o Site

Quando fizer alterações:

1. **Via FTP:**

   - Conecte no FileZilla
   - Faça upload apenas dos arquivos alterados
   - Ou substitua os arquivos antigos

2. **Via Painel:**
   - Use o File Manager
   - Faça upload dos arquivos novos
   - Ou edite diretamente no editor do cPanel

## 💡 Dicas

- **Backup:** Sempre faça backup do `data/passeios.json` antes de atualizar
- **Teste localmente:** Teste mudanças no Live Server antes de fazer upload
- **Use SFTP:** Mais seguro que FTP (porta 22)
- **Organize:** Mantenha a mesma estrutura de pastas do projeto local

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs de erro do PHP (geralmente em `error_log`)
2. Entre em contato com o suporte da hospedagem
3. Verifique a documentação do cPanel/Plesk
