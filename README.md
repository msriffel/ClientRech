# ClientReach - CRM Inteligente

Um sistema de CRM (Customer Relationship Management) moderno e inteligente construído com Next.js, TypeScript e IA.

## 🚀 Funcionalidades

- **Dashboard Completo**: Visualização de estatísticas e lista de clientes
- **Gestão de Clientes**: Cadastro, edição e exclusão de empresas
- **Gestão de Contatos**: Adicionar e gerenciar contatos por empresa
- **Histórico de Interações**: Registrar e acompanhar todas as interações
- **IA Integrada**: Sugestões inteligentes de status baseadas no histórico
- **Interface Moderna**: Design responsivo com Tailwind CSS e shadcn/ui
- **Filtros e Busca**: Encontrar clientes rapidamente

## 🛠️ Tecnologias

- **Framework**: Next.js 14 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Ícones**: Lucide React
- **Formulários**: React Hook Form com Zod
- **Datas**: date-fns
- **IA**: Genkit (Google AI)
- **Fonte**: PT Sans (Google Fonts)

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd clientreach-crm
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   
   Edite o arquivo `.env.local` com suas configurações:
   ```env
   GOOGLE_CLOUD_PROJECT_ID=seu-projeto-id
   GOOGLE_APPLICATION_CREDENTIALS=caminho-para-sua-chave-json
   ```

4. **Execute o projeto**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🎯 Como Usar

### Dashboard
- Visualize estatísticas gerais dos seus clientes
- Use os filtros para encontrar clientes específicos
- Clique em um cliente para ver detalhes completos

### Gerenciar Clientes
1. **Adicionar Cliente**: Clique em "Nova Empresa" no dashboard
2. **Editar Cliente**: Na página de detalhes, clique em "Editar"
3. **Excluir Cliente**: Use o botão "Excluir" (com confirmação)

### Gerenciar Contatos
1. **Adicionar Contato**: Na página do cliente, clique em "Adicionar Contato"
2. **Editar Contato**: Use o ícone de edição ao lado do contato
3. **Excluir Contato**: Use o ícone de lixeira (com confirmação)

### Registrar Interações
1. **Nova Interação**: Preencha o formulário na página do cliente
2. **Sugestão de IA**: Use o botão "Sugerir Status (IA)" para obter recomendações
3. **Histórico**: Visualize todas as interações na coluna direita

## 🤖 Funcionalidade de IA

O sistema inclui integração com IA para sugerir o status mais apropriado do cliente baseado no histórico de interações:

- **Prospect Frio**: Cliente em fase inicial, poucas interações
- **Prospect Morno**: Cliente demonstrou interesse moderado
- **Prospect Quente**: Cliente muito interessado, alta probabilidade de conversão
- **Cliente Ativo**: Cliente que já fechou negócio
- **Cliente Fiel**: Cliente ativo há muito tempo, muito satisfeito
- **Cliente Inativo**: Cliente com baixo engajamento recente

## 📁 Estrutura do Projeto

```
src/
├── ai/                    # Configuração do Genkit e flows de IA
├── app/                   # Páginas e componentes da aplicação
│   ├── components/        # Componentes compartilhados
│   ├── clients/          # Páginas relacionadas a clientes
│   └── api/              # API routes
├── components/ui/         # Componentes UI do shadcn
├── lib/                  # Utilitários, tipos e dados
└── ...
```

## 🎨 Personalização

### Cores
As cores principais podem ser alteradas no arquivo `tailwind.config.js`:
- **Primária**: `#3F51B5` (azul profundo)
- **Destrutiva**: `#FF9800` (laranja)
- **Fundo**: `#F5F5F5` (cinza claro)

### Fonte
A aplicação usa a fonte PT Sans. Para alterar, edite o arquivo `src/app/layout.tsx`.

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas
O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run

## 📝 Notas Importantes

- **Dados Simulados**: O projeto usa dados simulados em memória. Para produção, implemente um banco de dados real.
- **IA**: A funcionalidade de IA requer configuração do Google Cloud e Genkit.
- **Autenticação**: O projeto não inclui sistema de autenticação. Adicione conforme necessário.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, abra uma issue no repositório ou entre em contato.

---

Desenvolvido com ❤️ usando Next.js e TypeScript
