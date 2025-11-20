# Guia de Teste Local - Painel Admin

## 🚀 Como Testar o Painel Admin Localmente

### Pré-requisitos

- PHP instalado no seu computador (versão 7.4 ou superior)
- Navegador web (Chrome, Firefox, Edge, etc.)

### Método 1: Servidor PHP Integrado (Mais Simples)

1. **Abra o PowerShell ou Terminal**

   - No Windows: Pressione `Win + X` → "Windows PowerShell" ou "Terminal"
   - No Mac/Linux: Abra o Terminal

2. **Navegue até a pasta do projeto**

   ```powershell
   cd C:\Users\denes\Desktop\desenVUMBORA
   ```

3. **Inicie o servidor PHP**

   ```powershell
   php -S localhost:8000
   ```

   Ou se quiser usar outra porta:

   ```powershell
   php -S localhost:8080
   ```

4. **Acesse no navegador**

   - Abra seu navegador
   - Acesse: `http://localhost:8000/admin/`
   - Ou: `http://localhost:8000/admin/login.php`

5. **Credenciais de Login**

   - **Usuário:** `admin`
   - **Senha:** `senha123`

   _(Essas são as credenciais padrão definidas em `admin/config.php`)_

### Método 2: Usando o Router (Recomendado)

Se você tem o arquivo `router.php` na raiz do projeto:

1. **Inicie o servidor com o router**

   ```powershell
   php -S localhost:8000 router.php
   ```

2. **Acesse no navegador**
   - Site principal: `http://localhost:8000/`
   - Painel admin: `http://localhost:8000/admin/`

### Método 3: Live Server (VS Code)

Se você usa o VS Code com a extensão Live Server:

1. **Instale a extensão "Live Server"** no VS Code (se ainda não tiver)

2. **Abra o arquivo `admin/login.php`** no VS Code

3. **Clique com botão direito** no arquivo → "Open with Live Server"

4. **Nota:** O Live Server serve arquivos estáticos, então o PHP pode não funcionar completamente. Use o Método 1 ou 2 para funcionalidade completa.

## 📝 Verificar se o PHP está Instalado

Antes de começar, verifique se o PHP está instalado:

```powershell
php -v
```

Se aparecer a versão do PHP, está tudo certo! Se aparecer erro, você precisa instalar o PHP.

### Instalar PHP no Windows

1. Baixe o PHP de: https://windows.php.net/download/
2. Escolha a versão **Thread Safe (TS) x64** (ZIP)
3. Extraia para `C:\php`
4. Adicione `C:\php` ao PATH do sistema:
   - Win + R → `sysdm.cpl` → Aba "Avançado" → "Variáveis de Ambiente"
   - Em "Variáveis do sistema", encontre "Path" → "Editar"
   - Clique em "Novo" → Adicione `C:\php`
   - Clique em "OK" em todas as janelas
5. Reinicie o PowerShell/Terminal
6. Teste com `php -v`

## ✅ Testando o Painel Admin

### 1. Fazer Login

- Acesse: `http://localhost:8000/admin/login.php`
- Digite: `admin` / `senha123`
- Clique em "Entrar"

### 2. Painel Principal

- Você verá a lista de passeios cadastrados
- Pode adicionar, editar ou deletar passeios

### 3. Adicionar Passeio

- Clique em "Adicionar Novo Passeio"
- Preencha o formulário
- Faça upload de imagens
- Clique em "Salvar Passeio"

### 4. Editar Passeio

- Na lista, clique em "Editar" em um passeio
- Faça as alterações
- Clique em "Salvar Alterações"

### 5. Deletar Passeio

- Na lista, clique em "Deletar" em um passeio
- Confirme a exclusão

## 🔍 Verificar se Está Funcionando

### Teste Básico

1. O login deve funcionar
2. Você deve ver a lista de passeios
3. Deve conseguir adicionar um passeio de teste
4. As imagens devem fazer upload corretamente

### Verificar Pastas

Certifique-se de que as pastas existem e têm permissão de escrita:

- `data/` - deve existir
- `uploads/passeios/` - deve existir

### Problemas Comuns

**Erro: "php não é reconhecido"**

- PHP não está no PATH
- Siga as instruções de instalação acima

**Erro 404 ao acessar /admin/**

- Verifique se está usando `router.php` se tiver esse arquivo
- Ou acesse diretamente: `http://localhost:8000/admin/login.php`

**Upload de imagens não funciona**

- Verifique se a pasta `uploads/passeios/` existe
- Verifique permissões (no Windows geralmente não é problema)

**Erro de sessão**

- Limpe os cookies do navegador
- Tente em uma aba anônima/privada

## 🛑 Parar o Servidor

Para parar o servidor PHP:

- No terminal onde está rodando, pressione `Ctrl + C`

## 📌 Dicas

- Mantenha o terminal aberto enquanto testa
- Qualquer erro PHP aparecerá no terminal
- Use `Ctrl + C` para parar o servidor quando terminar
- As alterações são salvas em `data/passeios.json`

## 🔒 Segurança

**IMPORTANTE:** As credenciais padrão são apenas para teste local. Antes de colocar no ar:

1. Altere as credenciais em `admin/config.php`
2. Use senhas fortes
3. Não compartilhe as credenciais
