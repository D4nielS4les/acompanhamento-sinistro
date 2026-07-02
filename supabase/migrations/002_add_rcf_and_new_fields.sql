  -- ============================================================
  -- MIGRAÇÃO: Novos campos no claims + tabela rcf_third_parties
  -- Execute este SQL no Supabase SQL Editor
  -- ============================================================

  -- 1. Adicionar novos campos na tabela claims
  ALTER TABLE claims
    ADD COLUMN IF NOT EXISTS franchise_value text,
    ADD COLUMN IF NOT EXISTS claim_number text,
    ADD COLUMN IF NOT EXISTS rental_car_days text,
    ADD COLUMN IF NOT EXISTS driver_coverage text,
    ADD COLUMN IF NOT EXISTS driver_name text,
    ADD COLUMN IF NOT EXISTS driver_cpf text,
    ADD COLUMN IF NOT EXISTS driver_birth_date text,
    ADD COLUMN IF NOT EXISTS driver_cnh_number text,
    ADD COLUMN IF NOT EXISTS driver_cnh_category text,
    ADD COLUMN IF NOT EXISTS driver_cnh_expiry text,
    ADD COLUMN IF NOT EXISTS driver_relationship text,
    ADD COLUMN IF NOT EXISTS vehicle_chassis text,
    ADD COLUMN IF NOT EXISTS vehicle_renavam text;

  -- 2. Criar tabela de terceiros envolvidos (RCF)
  CREATE TABLE IF NOT EXISTS rcf_third_parties (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    claim_id uuid NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    name text NOT NULL,
    cpf text,
    phone text,
    email text,
    vehicle_plate text NOT NULL,
    vehicle_brand text,
    vehicle_model text,
    vehicle_year text,
    vehicle_color text,
    vehicle_chassis text,
    vehicle_renavam text,
    insurance_company text,
    sinistro_number text,
    created_at timestamptz DEFAULT now()
  );

  -- 3. Índices para performance
  CREATE INDEX IF NOT EXISTS idx_rcf_claim_id ON rcf_third_parties(claim_id);

  -- 4. Habilitar RLS (Row Level Security) — ajuste as políticas conforme necessário
  ALTER TABLE rcf_third_parties ENABLE ROW LEVEL SECURITY;

  -- Política permissiva para usuários autenticados (ajuste conforme seu auth)
  CREATE POLICY "Authenticated users can manage RCF"
    ON rcf_third_parties
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
