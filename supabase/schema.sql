-- ============================================
-- Schema: Acompanhamento de Sinistros
-- ============================================

-- Enum para status do sinistro
CREATE TYPE claim_status AS ENUM (
  'Aberto',
  'Em Análise',
  'Vistoria Agendada',
  'Documentação Pendente',
  'Aprovado',
  'Pago/Encerrado'
);

-- Enum para tipo de sinistro
CREATE TYPE claim_type AS ENUM (
  'Automóvel',
  'Residencial',
  'Vida',
  'Saúde',
  'Empresarial'
);

-- Tabela principal de sinistros
CREATE TABLE claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  insured_name TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  policy_number TEXT NOT NULL,
  insurance_company TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  type claim_type NOT NULL DEFAULT 'Automóvel',
  incident_date DATE NOT NULL,
  incident_time TIME,
  location TEXT,
  description TEXT,
  status claim_status NOT NULL DEFAULT 'Aberto',
  vehicle_plate TEXT,
  vehicle_brand TEXT,
  vehicle_model TEXT,
  vehicle_year TEXT,
  vehicle_color TEXT,
  workshop_name TEXT,
  workshop_cnpj TEXT,
  workshop_phone TEXT,
  workshop_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de timeline dos sinistros
CREATE TABLE claim_timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  description TEXT NOT NULL,
  status claim_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de anexos
CREATE TABLE claim_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  size TEXT,
  file_type TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_type ON claims(type);
CREATE INDEX idx_claims_created_at ON claims(created_at DESC);
CREATE INDEX idx_timeline_claim_id ON claim_timeline(claim_id);
CREATE INDEX idx_attachments_claim_id ON claim_attachments(claim_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (Row Level Security) - Opcional
-- ============================================

-- Habilitar RLS (descomente se precisar de autenticação)
-- ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE claim_timeline ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE claim_attachments ENABLE ROW LEVEL SECURITY;

-- Policy para permitir acesso completo (para desenvolvimento)
-- CREATE POLICY "Allow all access" ON claims FOR ALL USING (true);
-- CREATE POLICY "Allow all access" ON claim_timeline FOR ALL USING (true);
-- CREATE POLICY "Allow all access" ON claim_attachments FOR ALL USING (true);
