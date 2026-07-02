-- ============================================================
-- MIGRAÇÃO: Corrigir permissões de DELETE
-- Execute este SQL no Supabase SQL Editor
-- ============================================================

-- 1. Desabilitar RLS na tabela claims (libera todas as operações)
ALTER TABLE claims DISABLE ROW LEVEL SECURITY;

-- 2. Desabilitar RLS na tabela claim_timeline
ALTER TABLE claim_timeline DISABLE ROW LEVEL SECURITY;

-- 3. Desabilitar RLS na tabela rcf_third_parties
ALTER TABLE rcf_third_parties DISABLE ROW LEVEL SECURITY;

-- 4. Se quiser manter RLS mas permitir tudo, use isto EM VEZ das linhas acima:
-- ALTER TABLE claims FORCE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all on claims" ON claims FOR ALL USING (true) WITH CHECK (true);
-- ALTER TABLE claim_timeline FORCE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all on timeline" ON claim_timeline FOR ALL USING (true) WITH CHECK (true);
-- ALTER TABLE rcf_third_parties FORCE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all on rcf" ON rcf_third_parties FOR ALL USING (true) WITH CHECK (true);
