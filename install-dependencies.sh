#!/bin/bash

echo "🚀 Instalando dependências do ClientReach CRM..."

# Instalar dependências do npm
echo "📦 Instalando dependências do npm..."
npm install

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Dependências instaladas com sucesso!"
echo ""
echo "🎯 Próximos passos:"
echo "1. Configure as variáveis de ambiente (copie .env.example para .env.local)"
echo "2. Execute: npm run dev"
echo "3. Acesse: http://localhost:3000"
echo ""
echo "📚 Para mais informações, consulte o README.md"
