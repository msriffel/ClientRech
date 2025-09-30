-- Create clients table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  website TEXT,
  phone TEXT,
  logo_url TEXT NOT NULL DEFAULT 'https://picsum.photos/100/100',
  status TEXT NOT NULL CHECK (status IN (
    'Prospect Frio', 
    'Prospect Morno', 
    'Prospect Quente', 
    'Cliente Ativo', 
    'Cliente Fiel', 
    'Cliente Inativo'
  )),
  last_contact_date TIMESTAMPTZ NOT NULL,
  next_contact_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL
);

-- Create interactions table
CREATE TABLE interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Chamada', 'Email', 'Reunião', 'Outro')),
  notes TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_next_contact_date ON clients(next_contact_date);
CREATE INDEX idx_contacts_client_id ON contacts(client_id);
CREATE INDEX idx_interactions_client_id ON interactions(client_id);
CREATE INDEX idx_interactions_date ON interactions(date);

-- Enable Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your authentication needs)
CREATE POLICY "Allow public read access" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON clients FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON contacts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON contacts FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON interactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON interactions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON interactions FOR DELETE USING (true);

-- Insert sample data
INSERT INTO clients (company_name, website, phone, logo_url, status, last_contact_date, next_contact_date) VALUES
('TechCorp Solutions', 'https://techcorp.com', '+55 11 99999-1111', 'https://picsum.photos/seed/1/100/100', 'Cliente Ativo', '2024-01-15T10:00:00Z', '2024-02-15T10:00:00Z'),
('Inovação Digital', 'https://inovacao.com', '+55 21 88888-2222', 'https://picsum.photos/seed/2/100/100', 'Prospect Quente', '2024-01-10T14:30:00Z', '2024-01-25T14:30:00Z'),
('StartupXYZ', 'https://startupxyz.com', NULL, 'https://picsum.photos/seed/3/100/100', 'Prospect Frio', '2023-11-20T16:00:00Z', '2024-01-20T16:00:00Z'),
('Empresa Fiel Ltda', 'https://empresafiel.com', '+55 31 77777-3333', 'https://picsum.photos/seed/4/100/100', 'Cliente Fiel', '2024-01-12T11:00:00Z', '2024-02-12T11:00:00Z');

-- Insert sample contacts using CTE to avoid subquery issues
WITH client_ids AS (
  SELECT 
    id,
    company_name,
    ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM clients 
  WHERE company_name IN ('TechCorp Solutions', 'Inovação Digital', 'StartupXYZ', 'Empresa Fiel Ltda')
)
INSERT INTO contacts (client_id, name, email, phone, role) VALUES
((SELECT id FROM client_ids WHERE company_name = 'TechCorp Solutions' AND rn = 1), 'João Silva', 'joao@techcorp.com', '+55 11 99999-1111', 'CEO'),
((SELECT id FROM client_ids WHERE company_name = 'TechCorp Solutions' AND rn = 1), 'Maria Santos', 'maria@techcorp.com', '+55 11 99999-1112', 'CTO'),
((SELECT id FROM client_ids WHERE company_name = 'Inovação Digital' AND rn = 1), 'Carlos Oliveira', 'carlos@inovacao.com', '+55 21 88888-2222', 'Diretor'),
((SELECT id FROM client_ids WHERE company_name = 'StartupXYZ' AND rn = 1), 'Ana Costa', 'ana@startupxyz.com', NULL, 'Fundadora'),
((SELECT id FROM client_ids WHERE company_name = 'Empresa Fiel Ltda' AND rn = 1), 'Roberto Lima', 'roberto@empresafiel.com', '+55 31 77777-3333', 'Gerente'),
((SELECT id FROM client_ids WHERE company_name = 'Empresa Fiel Ltda' AND rn = 1), 'Fernanda Alves', 'fernanda@empresafiel.com', NULL, 'Assistente');

-- Insert sample interactions using CTE to avoid subquery issues
WITH client_ids AS (
  SELECT 
    id,
    company_name,
    ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM clients 
  WHERE company_name IN ('TechCorp Solutions', 'Inovação Digital', 'StartupXYZ', 'Empresa Fiel Ltda')
)
INSERT INTO interactions (client_id, date, type, notes) VALUES
((SELECT id FROM client_ids WHERE company_name = 'TechCorp Solutions' AND rn = 1), '2024-01-15T10:00:00Z', 'Reunião', 'Reunião de acompanhamento do projeto. Cliente satisfeito com o progresso.'),
((SELECT id FROM client_ids WHERE company_name = 'TechCorp Solutions' AND rn = 1), '2024-01-10T14:00:00Z', 'Email', 'Envio de relatório mensal e agendamento da próxima reunião.'),
((SELECT id FROM client_ids WHERE company_name = 'Inovação Digital' AND rn = 1), '2024-01-10T14:30:00Z', 'Chamada', 'Primeira conversa sobre possibilidade de parceria. Interesse demonstrado.'),
((SELECT id FROM client_ids WHERE company_name = 'StartupXYZ' AND rn = 1), '2023-11-20T16:00:00Z', 'Email', 'Envio de proposta inicial. Aguardando retorno.'),
((SELECT id FROM client_ids WHERE company_name = 'Empresa Fiel Ltda' AND rn = 1), '2024-01-12T11:00:00Z', 'Reunião', 'Reunião de renovação de contrato. Cliente muito satisfeito com os serviços.');
