-- ============================================================
-- MIGRAÇÃO: Adicionar campo oficina na tabela rcf_third_parties
-- Execute este SQL no Supabase SQL Editor
-- ============================================================

ALTER TABLE rcf_third_parties
  ADD COLUMN IF NOT EXISTS workshop_name text;
