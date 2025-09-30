# Configuração do Supabase - Passo a Passo

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha:
   - **Name**: `clientreach-crm`
   - **Database Password**: (escolha uma senha forte)
   - **Region**: escolha a região mais próxima (ex: South America - São Paulo)
5. Clique em "Create new project"
6. Aguarde a criação (pode levar alguns minutos)

## 2. Configurar o Banco de Dados

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em "New query"
3. Copie TODO o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor SQL
5. Clique em **Run** para executar o script
6. Aguarde a criação das tabelas e dados de exemplo

## 3. Obter as Credenciais

1. No painel do Supabase, vá para **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL** (algo como: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (uma string longa que começa com `eyJ...`)

## 4. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto
2. Cole o seguinte conteúdo (substitua pelos seus valores):

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

## 5. Testar Localmente

1. Execute o servidor:
```bash
npm run dev
```

2. Acesse [http://localhost:3000](http://localhost:3000)

3. Teste criando um novo cliente:
   - Clique em "Nova Empresa"
   - Preencha os dados
   - Clique em "Criar Cliente"
   - Deve redirecionar para a página do cliente criado

## 6. Verificar se Funcionou

- Os clientes devem aparecer na lista principal
- Ao clicar em um cliente, deve abrir a página de detalhes
- Os dados devem persistir entre recarregamentos da página
- No console do navegador, não deve aparecer avisos sobre "mock storage"

## Troubleshooting

### Erro de Conexão
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique se o script SQL foi executado corretamente

### Dados Não Aparecem
- Verifique se as políticas RLS estão configuradas
- Confirme se as tabelas foram criadas corretamente
- Verifique os logs do Supabase

### Erro 404 ao Criar Cliente
- Verifique se o cliente está sendo criado no Supabase
- Confirme se o redirecionamento está funcionando
- Verifique os logs do console do navegador
