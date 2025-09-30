// Configuração do Genkit para desenvolvimento
// Em produção, use variáveis de ambiente

export const genkitConfig = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'clientreach-crm-dev',
  location: 'us-central1',
  // Para desenvolvimento, você pode usar uma chave de API simples
  // Em produção, use service account credentials
  apiKey: process.env.GOOGLE_AI_API_KEY || 'your-api-key-here'
};
