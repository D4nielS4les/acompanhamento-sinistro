-- ============================================
-- RLS Policies com Autenticação
-- ============================================

-- ============================================
-- Remover TODAS as policies existentes
-- ============================================

-- claims
DROP POLICY IF EXISTS "Allow all access on claims" ON claims;
DROP POLICY IF EXISTS "Authenticated users can view claims" ON claims;
DROP POLICY IF EXISTS "Authenticated users can insert claims" ON claims;
DROP POLICY IF EXISTS "Authenticated users can update claims" ON claims;
DROP POLICY IF EXISTS "Only admins can delete claims" ON claims;
DROP POLICY IF EXISTS "Deny anon access on claims" ON claims;

-- claim_timeline
DROP POLICY IF EXISTS "Allow all access on claim_timeline" ON claim_timeline;
DROP POLICY IF EXISTS "Authenticated users can view timeline" ON claim_timeline;
DROP POLICY IF EXISTS "Authenticated users can insert timeline" ON claim_timeline;
DROP POLICY IF EXISTS "Deny anon access on claim_timeline" ON claim_timeline;

-- claim_attachments
DROP POLICY IF EXISTS "Allow all access on claim_attachments" ON claim_attachments;
DROP POLICY IF EXISTS "Authenticated users can view attachments" ON claim_attachments;
DROP POLICY IF EXISTS "Authenticated users can insert attachments" ON claim_attachments;
DROP POLICY IF EXISTS "Deny anon access on claim_attachments" ON claim_attachments;

-- ============================================
-- Criar policies novas
-- ============================================

-- Habilitar RLS
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_attachments ENABLE ROW LEVEL SECURITY;

-- claims: autenticados
CREATE POLICY "Authenticated users can view claims"
  ON claims FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert claims"
  ON claims FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update claims"
  ON claims FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Only admins can delete claims"
  ON claims FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- claim_timeline: autenticados
CREATE POLICY "Authenticated users can view timeline"
  ON claim_timeline FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert timeline"
  ON claim_timeline FOR INSERT TO authenticated WITH CHECK (true);

-- claim_attachments: autenticados
CREATE POLICY "Authenticated users can view attachments"
  ON claim_attachments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert attachments"
  ON claim_attachments FOR INSERT TO authenticated WITH CHECK (true);

-- anon: acesso negado
CREATE POLICY "Deny anon access on claims"
  ON claims FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access on claim_timeline"
  ON claim_timeline FOR ALL TO anon USING (false);

CREATE POLICY "Deny anon access on claim_attachments"
  ON claim_attachments FOR ALL TO anon USING (false);
