-- ============================================================
-- MIGRAÇÃO: Adicionar parent_claim_id na tabela claims
-- Execute este SQL no Supabase SQL Editor
-- ============================================================

ALTER TABLE claims
  ADD COLUMN IF NOT EXISTS parent_claim_id uuid REFERENCES claims(id) ON DELETE SET NULL;
