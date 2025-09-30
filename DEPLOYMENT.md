# Guia de Deploy - ClientReach CRM

Este guia explica como fazer o deploy do ClientReach CRM usando Git, Supabase e Vercel.

## 📋 Pré-requisitos

- Conta no [GitHub](https://github.com)
- Conta no [Supabase](https://supabase.com)
- Conta no [Vercel](https://vercel.com)
- Node.js 18+ instalado localmente

## 🗄️ Configuração do Supabase

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Escolha sua organização
4. Preencha:
   - **Name**: `clientreach-crm`
   - **Database Password**: (escolha uma senha forte)
   - **Region**: escolha a região mais próxima
5. Clique em "Create new project"

### 2. Configurar o banco de dados

1. No painel do Supabase, vá para **SQL Editor**
2. Copie o conteúdo do arquivo `supabase-schema.sql` e cole no editor
3. Clique em **Run** para executar o script
4. Aguarde a criação das tabelas e dados de exemplo

### 3. Obter as chaves de API

1. No painel do Supabase, vá para **Settings** > **API**
2. Copie:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## 🚀 Deploy no Vercel

### 1. Preparar o repositório Git

```bash
# Fazer commit das alterações
git add .
git commit -m "Add Supabase integration and Vercel config"

# Conectar ao GitHub (substitua por seu repositório)
git remote add origin https://github.com/SEU_USUARIO/clientreach-crm.git
git push -u origin main
```

### 2. Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"New Project"**
3. Conecte sua conta do GitHub
4. Selecione o repositório `clientreach-crm`
5. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`: Cole a URL do seu projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Cole a chave anônima do Supabase
6. Clique em **"Deploy"**

### 3. Configurar domínio personalizado (opcional)

1. No painel do Vercel, vá para **Settings** > **Domains**
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruído

## 🔧 Configuração Local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

1. Copie o arquivo de exemplo:
```bash
cp env.example .env.local
```

2. Edite `.env.local` com suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 3. Executar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📊 Estrutura do Banco de Dados

O banco de dados possui 3 tabelas principais:

- **clients**: Informações dos clientes
- **contacts**: Contatos de cada cliente
- **interactions**: Histórico de interações

### Relacionamentos

- `contacts.client_id` → `clients.id`
- `interactions.client_id` → `clients.id`

## 🔒 Segurança

- O Supabase está configurado com Row Level Security (RLS)
- As políticas permitem acesso público (ajuste conforme necessário)
- Para produção, considere implementar autenticação

## 🚨 Troubleshooting

### Erro de conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo

### Erro de build no Vercel
- Verifique se todas as dependências estão no `package.json`
- Confirme se as variáveis de ambiente estão configuradas

### Dados não aparecem
- Verifique se o script SQL foi executado corretamente
- Confirme se as políticas RLS estão configuradas

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do Vercel
2. Consulte a documentação do Supabase
3. Abra uma issue no repositório do projeto
