# 📸 Guia de Teste - Upload de Fotos na Galeria dos Passeios

## 🚀 Como Testar o Upload de Fotos na Galeria

### Passo 1: Iniciar o Servidor PHP Local

1. **Abra o PowerShell ou Terminal**

   - No Windows: Pressione `Win + X` → "Windows PowerShell" ou "Terminal"

2. **Navegue até a pasta do projeto**

   ```powershell
   cd C:\Users\denes\Desktop\desenVUMBORA
   ```

3. **Inicie o servidor PHP**

   ```powershell
   php -S localhost:8000
   ```

   ⚠️ **Mantenha o terminal aberto** enquanto testa!

### Passo 2: Acessar o Painel Admin

1. **Abra seu navegador** (Chrome, Firefox, Edge, etc.)

2. **Acesse o painel admin:**

   ```
   http://localhost:8000/admin/login.php
   ```

3. **Faça login:**
   - **Usuário:** `admin`
   - **Senha:** `senha123`

### Passo 3: Testar Upload na Galeria

Você tem **duas opções** para testar:

#### Opção A: Criar um Novo Passeio com Galeria

1. No painel admin, clique em **"Adicionar Novo Passeio"**

2. **Preencha os campos obrigatórios:**

   - Nome do Passeio (ex: "Teste Galeria")
   - Selecione pelo menos uma categoria
   - Descrição Curta
   - Descrição Completa
   - Duração
   - Tipo de Passeio
   - Mínimo de Pessoas
   - Posição

3. **Na seção "📸 Imagens":**

   - **Imagem de Capa:** Selecione uma imagem (obrigatório para novo passeio)
   - **Galeria de Fotos:** Clique na área "📁 Clique para adicionar fotos à galeria"
   - Selecione **múltiplas imagens** (pressione `Ctrl` e clique em várias imagens)
   - Você verá uma prévia das imagens selecionadas

4. **Clique em "💾 Criar Passeio"**

5. **Verifique se funcionou:**
   - Você será redirecionado para o painel
   - Edite o passeio novamente para ver as fotos na galeria

#### Opção B: Adicionar Fotos a um Passeio Existente

1. No painel admin, encontre um passeio existente

2. Clique em **"Editar"** no passeio

3. **Role até a seção "📸 Imagens"**

4. **Na seção "Galeria de Fotos":**

   - Você verá as fotos atuais (se houver)
   - Clique na área "📁 Clique para adicionar fotos à galeria"
   - Selecione **múltiplas imagens** para adicionar
   - Você verá uma prévia das novas imagens selecionadas

5. **Para remover fotos existentes:**

   - Marque o checkbox "Remover" nas fotos que deseja excluir
   - As fotos marcadas ficarão com borda vermelha

6. **Clique em "💾 Salvar Alterações"**

7. **Verifique se funcionou:**
   - As novas fotos devem aparecer na galeria
   - As fotos marcadas para remoção devem ter sido excluídas

### Passo 4: Verificar os Arquivos Enviados

1. **Navegue até a pasta de uploads:**

   ```
   uploads/passeios/[nome-do-passeio]/
   ```

2. **Você deve ver:**
   - `capa.jpg` (ou outro formato) - imagem de capa
   - Vários arquivos com nomes únicos (ex: `691e66c64c5d7.jpeg`) - fotos da galeria

### ✅ O que Verificar se Está Funcionando

- ✅ As imagens aparecem na prévia antes de salvar
- ✅ Após salvar, as fotos aparecem na galeria do passeio editado
- ✅ Os arquivos são salvos na pasta `uploads/passeios/[slug-do-passeio]/`
- ✅ É possível adicionar múltiplas fotos de uma vez
- ✅ É possível remover fotos existentes marcando o checkbox

### ⚠️ Problemas Comuns e Soluções

#### Erro: "Formato não permitido"

- **Causa:** A imagem não é JPG, PNG ou WEBP
- **Solução:** Use apenas imagens nos formatos permitidos

#### Erro: "Arquivo muito grande"

- **Causa:** A imagem tem mais de 5MB
- **Solução:** Reduza o tamanho da imagem antes de fazer upload

#### As fotos não aparecem após salvar

- **Verifique:** Se a pasta `uploads/passeios/` existe e tem permissão de escrita
- **No Windows:** Geralmente não há problema de permissão
- **Verifique:** Se os arquivos foram realmente salvos na pasta

#### Erro ao fazer upload

- **Verifique:** Se o servidor PHP está rodando (`php -S localhost:8000`)
- **Verifique:** Se está acessando pelo endereço correto (`localhost:8000`)
- **Verifique:** Se a pasta `uploads/passeios/` existe

### 📋 Formato das Imagens Aceitas

- ✅ **JPG/JPEG**
- ✅ **PNG**
- ✅ **WEBP**
- ❌ GIF (não suportado)
- ❌ Outros formatos

### 📏 Limites

- **Tamanho máximo:** 5MB por imagem
- **Quantidade:** Sem limite (pode adicionar quantas fotos quiser)

### 🔍 Testando no Site (Frontend)

Após fazer upload, você pode verificar se as fotos aparecem no site:

1. **Acesse:** `http://localhost:8000/pages/passeio.html?id=[id-do-passeio]`
2. **Ou navegue pelo catálogo:** `http://localhost:8000/pages/catalogo.html`
3. **As fotos da galeria devem aparecer** na página do passeio

### 💡 Dicas

- **Use imagens de teste pequenas** para testar mais rápido
- **Teste com diferentes formatos** (JPG, PNG, WEBP)
- **Teste adicionar e remover fotos** no mesmo passeio
- **Verifique a pasta de uploads** para confirmar que os arquivos foram salvos

### 🛑 Parar o Servidor

Quando terminar de testar:

- No terminal onde está rodando o servidor, pressione `Ctrl + C`

---

**Pronto!** Agora você pode testar o upload de fotos na galeria dos passeios. 🎉
