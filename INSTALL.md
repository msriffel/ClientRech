# Guia de Instalação - ClientReach CRM

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18 ou superior
- **npm** (vem com o Node.js)
- **Git** (para clonar o repositório)

## 🚀 Instalação Rápida

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd clientreach-crm
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo .env.local com suas configurações
nano .env.local
```

### 4. Execute o Projeto
```bash
npm run dev
```

### 5. Acesse a Aplicação
Abra seu navegador em [http://localhost:3000](http://localhost:3000)

## 🔧 Instalação Detalhada

### Passo 1: Verificar Pré-requisitos

```bash
# Verificar versão do Node.js
node --version
# Deve ser v18.0.0 ou superior

# Verificar versão do npm
npm --version
# Deve ser 8.0.0 ou superior
```

### Passo 2: Instalar Dependências

O projeto usa várias dependências principais:

- **Next.js 14**: Framework React
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **shadcn/ui**: Componentes UI
- **Genkit**: IA do Google
- **date-fns**: Manipulação de datas

```bash
npm install
```

### Passo 3: Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
# Google Cloud Configuration (para IA)
GOOGLE_CLOUD_PROJECT_ID=seu-projeto-id
GOOGLE_APPLICATION_CREDENTIALS=caminho/para/sua/chave.json

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Passo 4: Configurar IA (Opcional)

Para usar a funcionalidade de IA, você precisa:

1. **Criar um projeto no Google Cloud**
2. **Habilitar a API do Vertex AI**
3. **Criar uma chave de serviço**
4. **Configurar as variáveis de ambiente**

**Nota**: A aplicação funciona sem IA, mas a funcionalidade de sugestão de status não estará disponível.

### Passo 5: Executar o Projeto

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm run build
npm start

# Linting
npm run lint
```

## 🐛 Solução de Problemas

### Erro: "Cannot find module"
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 3000 is already in use"
```bash
# Use uma porta diferente
npm run dev -- -p 3001
```

### Erro de TypeScript
```bash
# Verifique se todas as dependências estão instaladas
npm install --save-dev @types/react @types/react-dom @types/node
```

### Erro de Tailwind CSS
```bash
# Recompile o CSS
npm run build
```

## 📁 Estrutura Após Instalação

```
clientreach-crm/
├── src/
│   ├── ai/                 # Configuração de IA
│   ├── app/               # Páginas Next.js
│   ├── components/        # Componentes React
│   └── lib/              # Utilitários e tipos
├── public/               # Arquivos estáticos
├── node_modules/         # Dependências (criado após npm install)
├── .env.local           # Variáveis de ambiente (você cria)
├── package.json         # Dependências do projeto
├── tailwind.config.js   # Configuração do Tailwind
├── tsconfig.json        # Configuração do TypeScript
└── next.config.js       # Configuração do Next.js
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Plataformas
- **Netlify**: Compatível com Next.js
- **Railway**: Deploy simples
- **AWS Amplify**: Para projetos empresariais

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs**: `npm run dev` mostra erros detalhados
2. **Consulte a documentação**: README.md tem informações completas
3. **Abra uma issue**: No repositório do GitHub
4. **Verifique as dependências**: `npm list` mostra versões instaladas

## ✅ Verificação Final

Após a instalação, você deve conseguir:

- [ ] Acessar http://localhost:3000
- [ ] Ver o dashboard com dados de exemplo
- [ ] Navegar entre as páginas
- [ ] Adicionar/editar clientes
- [ ] Registrar interações
- [ ] Usar filtros e busca

Se tudo funcionar, a instalação foi bem-sucedida! 🎉
