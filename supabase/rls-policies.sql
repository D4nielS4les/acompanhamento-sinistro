  -- ============================================
  -- RLS Policies para Acesso Completo
  -- ============================================

  -- Habilitar RLS nas tabelas
  ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
  ALTER TABLE claim_timeline ENABLE ROW LEVEL SECURITY;
  ALTER TABLE claim_attachments ENABLE ROW LEVEL SECURITY;

  -- Policies para claims
  CREATE POLICY "Allow all access on claims" ON claims
    FOR ALL USING (true) WITH CHECK (true);

  -- Policies para claim_timeline
  CREATE POLICY "Allow all access on claim_timeline" ON claim_timeline
    FOR ALL USING (true) WITH CHECK (true);

  -- Policies para claim_attachments
  CREATE POLICY "Allow all access on claim_attachments" ON claim_attachments
    FOR ALL USING (true) WITH CHECK (true);
