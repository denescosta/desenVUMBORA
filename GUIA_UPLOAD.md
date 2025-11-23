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

---

## ✅ CHECKLIST COMPLETO - Deploy na Hostinger

Use este checklist passo a passo para garantir que tudo está configurado corretamente.

### 📋 FASE 1: Antes de Contratar

- [ ] **Escolher plano:** Plano Premium recomendado (melhor custo-benefício)
- [ ] **Verificar domínio:** Ter domínio próprio ou usar subdomínio gratuito
- [ ] **Preparar arquivos localmente:** Testar tudo no Live Server antes

### 📋 FASE 2: Contratação e Configuração Inicial

- [ ] **Contratar plano Hostinger Premium**
- [ ] **Registrar/Configurar domínio:**
  - [ ] Se já tem domínio: configurar DNS
  - [ ] Se não tem: registrar domínio na Hostinger (1º ano grátis)
- [ ] **Aguardar propagação DNS** (pode levar 24-48h)
- [ ] **Acessar hPanel** (painel de controle da Hostinger)
- [ ] **Anotar credenciais:**
  - [ ] Usuário FTP
  - [ ] Senha FTP
  - [ ] Host FTP (ex: ftp.seudominio.com)
  - [ ] Usuário cPanel/hPanel
  - [ ] Senha cPanel/hPanel

### 📋 FASE 3: Configuração do Servidor

- [ ] **Configurar versão PHP:**

  - [ ] Acessar hPanel → "PHP Configuration" ou "Select PHP Version"
  - [ ] Selecionar **PHP 8.1** ou **PHP 8.2** (recomendado)
  - [ ] Salvar alterações

- [ ] **Configurar limites de upload (opcional):**

  - [ ] Acessar "PHP Configuration" → "Options"
  - [ ] Verificar `upload_max_filesize` (recomendado: 20M)
  - [ ] Verificar `post_max_size` (recomendado: 25M)
  - [ ] Se necessário, criar arquivo `.htaccess` na raiz com:
    ```apache
    php_value upload_max_filesize 20M
    php_value post_max_size 25M
    ```

- [ ] **Verificar SSL:**
  - [ ] Acessar "SSL" no hPanel
  - [ ] Ativar SSL gratuito (Let's Encrypt)
  - [ ] Aguardar ativação (alguns minutos)

### 📋 FASE 4: Upload dos Arquivos

- [ ] **Escolher método de upload:**

  - [ ] Método 1: FTP (FileZilla) - Recomendado para primeira vez
  - [ ] Método 2: File Manager (hPanel) - Para uploads pequenos
  - [ ] Método 3: ZIP + Extrair (mais rápido para muitos arquivos)

- [ ] **Se usar FTP:**

  - [ ] Instalar FileZilla
  - [ ] Conectar usando credenciais anotadas
  - [ ] Navegar até `public_html/`
  - [ ] Fazer upload de TODOS os arquivos e pastas
  - [ ] Aguardar conclusão (pode levar alguns minutos)

- [ ] **Se usar File Manager:**

  - [ ] Acessar "File Manager" no hPanel
  - [ ] Navegar até `public_html/`
  - [ ] Fazer upload de todos os arquivos
  - [ ] Ou fazer upload de ZIP e extrair no servidor

- [ ] **Verificar estrutura:**
  - [ ] Confirmar que `index.html` está em `public_html/`
  - [ ] Confirmar que pasta `admin/` existe
  - [ ] Confirmar que pasta `data/` existe
  - [ ] Confirmar que pasta `uploads/` existe

### 📋 FASE 5: Configuração de Permissões

- [ ] **Configurar permissões das pastas:**

  - [ ] `uploads/` → **755**
  - [ ] `uploads/passeios/` → **755**
  - [ ] `data/` → **755**
  - [ ] `admin/` → **755**

- [ ] **Configurar permissões dos arquivos:**

  - [ ] `data/passeios.json` → **644** (se já existir)
  - [ ] `data/testimonials.json` → **644** (se já existir)
  - [ ] `admin/config.php` → **644**

- [ ] **Como configurar:**
  - [ ] No File Manager: Clique direito → "Change Permissions"
  - [ ] Marque: Owner (Read, Write, Execute), Group (Read, Execute), Public (Read, Execute) = 755
  - [ ] Para arquivos: Owner (Read, Write), Group (Read), Public (Read) = 644

### 📋 FASE 6: Configuração de Segurança

- [ ] **Alterar credenciais do admin:**

  - [ ] Acessar `admin/config.php` via File Manager
  - [ ] Editar diretamente no navegador
  - [ ] Alterar `ADMIN_USER` para um usuário seguro
  - [ ] Alterar `ADMIN_PASS` para uma senha forte
  - [ ] Salvar alterações

- [ ] **Proteger pasta admin (opcional):**

  - [ ] Criar `.htaccess` em `admin/` com:
    ```apache
    # Proteção adicional (opcional)
    Options -Indexes
    ```

- [ ] **Verificar arquivos sensíveis:**
  - [ ] Confirmar que `php.ini` não está acessível publicamente
  - [ ] Confirmar que `.htaccess` está configurado corretamente

### 📋 FASE 7: Testes e Verificação

- [ ] **Testar site público:**

  - [ ] Acessar `https://seudominio.com`
  - [ ] Verificar se página inicial carrega
  - [ ] Verificar se imagens aparecem
  - [ ] Testar navegação entre páginas
  - [ ] Verificar se JSON carrega (abrir DevTools → Network)

- [ ] **Testar painel admin:**

  - [ ] Acessar `https://seudominio.com/admin/`
  - [ ] Verificar se página de login aparece
  - [ ] Fazer login com novas credenciais
  - [ ] Verificar se painel carrega corretamente

- [ ] **Testar funcionalidades:**

  - [ ] Criar um passeio de teste
  - [ ] Fazer upload de imagem de capa
  - [ ] Fazer upload de galeria de fotos
  - [ ] Verificar se imagens aparecem no site
  - [ ] Editar um passeio existente
  - [ ] Deletar passeio de teste
  - [ ] Testar depoimentos (criar, editar, deletar)

- [ ] **Testar em diferentes dispositivos:**

  - [ ] Desktop
  - [ ] Tablet
  - [ ] Mobile

- [ ] **Verificar performance:**
  - [ ] Testar velocidade no Google PageSpeed
  - [ ] Verificar se imagens carregam rápido
  - [ ] Verificar se JSON carrega rápido

### 📋 FASE 8: Configurações Finais

- [ ] **Configurar email profissional (opcional):**

  - [ ] Acessar "Email Accounts" no hPanel
  - [ ] Criar email: contato@seudominio.com
  - [ ] Configurar no formulário de contato (se usar)

- [ ] **Configurar backup:**

  - [ ] Verificar se backup automático está ativo
  - [ ] Fazer backup manual inicial (File Manager → Compactar → Download)
  - [ ] Anotar frequência de backups (semanal no Premium)

- [ ] **Configurar CDN (opcional - apenas Business):**

  - [ ] Se tiver plano Business, ativar CDN
  - [ ] Aguardar propagação (24-48h)

- [ ] **Verificar logs:**
  - [ ] Acessar "Error Log" no hPanel
  - [ ] Verificar se há erros
  - [ ] Corrigir erros se necessário

### 📋 FASE 9: Documentação e Manutenção

- [ ] **Documentar credenciais:**

  - [ ] Salvar credenciais FTP em local seguro
  - [ ] Salvar credenciais admin em local seguro
  - [ ] Salvar credenciais hPanel em local seguro
  - [ ] Usar gerenciador de senhas (LastPass, 1Password, etc.)

- [ ] **Criar rotina de backup:**

  - [ ] Fazer backup semanal de `data/passeios.json`
  - [ ] Fazer backup mensal completo do site
  - [ ] Testar restauração de backup

- [ ] **Monitoramento:**
  - [ ] Verificar site semanalmente
  - [ ] Verificar logs de erro mensalmente
  - [ ] Atualizar PHP quando houver novas versões

### 📋 FASE 10: Otimizações Futuras (Opcional)

- [ ] **Performance:**

  - [ ] Ativar compressão GZIP (geralmente já ativo)
  - [ ] Otimizar imagens (já está automático no código)
  - [ ] Considerar CDN se site crescer

- [ ] **Segurança:**

  - [ ] Atualizar senhas periodicamente
  - [ ] Monitorar acessos ao painel admin
  - [ ] Manter PHP atualizado

- [ ] **Funcionalidades:**
  - [ ] Considerar migração para MySQL quando necessário
  - [ ] Adicionar analytics (Google Analytics)
  - [ ] Configurar Google Search Console

---

## 🎯 Checklist Rápido (Versão Resumida)

Para quem já tem experiência, use esta versão resumida:

- [ ] Contratar plano Premium
- [ ] Configurar domínio e DNS
- [ ] Configurar PHP 8.1/8.2
- [ ] Fazer upload de arquivos para `public_html/`
- [ ] Configurar permissões (755 para pastas, 644 para arquivos)
- [ ] Alterar credenciais em `admin/config.php`
- [ ] Testar site público
- [ ] Testar painel admin
- [ ] Testar upload de imagens
- [ ] Fazer backup inicial

---

## 📝 Notas Importantes

1. **Tempo estimado:** 2-4 horas para primeira configuração completa
2. **Propagação DNS:** Pode levar 24-48 horas (site pode não funcionar imediatamente)
3. **Backup:** Sempre faça backup antes de grandes mudanças
4. **Suporte:** Hostinger tem suporte 24/7 via chat se precisar de ajuda
5. **Documentação:** Guarde este checklist para referência futura

---

## 🆘 Problemas? Volte Aqui

Se algo não funcionar, verifique:

1. ✅ Permissões corretas?
2. ✅ PHP 8.x configurado?
3. ✅ Arquivos na pasta `public_html/`?
4. ✅ SSL ativado?
5. ✅ DNS propagado? (pode levar até 48h)
6. ✅ Credenciais corretas no `admin/config.php`?

Se ainda tiver problemas, consulte a seção "⚠️ Problemas Comuns" acima.
