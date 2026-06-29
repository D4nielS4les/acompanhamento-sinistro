"use client";

import { useState, useEffect } from 'react';
import { Claim, ClaimStatus, TimelineEvent } from '@/types/claim';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const claimsWithTimeline = await Promise.all(
        (data || []).map(async (claim) => {
          const { data: timeline } = await supabase
            .from('claim_timeline')
            .select('*')
            .eq('claim_id', claim.id)
            .order('event_date', { ascending: false });

          return {
            id: claim.id,
            insuredName: claim.insured_name,
            cpfCnpj: claim.cpf_cnpj,
            policyNumber: claim.policy_number,
            insuranceCompany: claim.insurance_company,
            email: claim.email,
            phone: claim.phone,
            type: claim.type,
            date: claim.incident_date,
            time: claim.incident_time,
            location: claim.location,
            description: claim.description,
            status: claim.status,
            vehicle: claim.vehicle_plate ? {
              plate: claim.vehicle_plate,
              brand: claim.vehicle_brand,
              model: claim.vehicle_model,
              year: claim.vehicle_year,
              color: claim.vehicle_color
            } : undefined,
            workshop: claim.workshop_name ? {
              name: claim.workshop_name,
              cnpj: claim.workshop_cnpj,
              phone: claim.workshop_phone,
              address: claim.workshop_address
            } : undefined,
            timeline: (timeline || []).map(t => ({
              id: t.id,
              date: t.event_date,
              time: t.event_time,
              description: t.description,
              status: t.status
            })),
            attachments: [],
            createdAt: claim.created_at,
            updatedAt: claim.updated_at
          };
        })
      );

      setClaims(claimsWithTimeline);
    } catch (error) {
      console.error('Erro ao buscar sinistros:', error);
      toast.error('Erro ao carregar sinistros');
    } finally {
      setLoading(false);
    }
  };

  const saveClaim = async (claim: Claim) => {
    try {
      const claimData = {
        insured_name: claim.insuredName,
        cpf_cnpj: claim.cpfCnpj,
        policy_number: claim.policyNumber,
        insurance_company: claim.insuranceCompany,
        email: claim.email,
        phone: claim.phone,
        type: claim.type,
        incident_date: claim.date,
        incident_time: claim.time,
        location: claim.location,
        description: claim.description,
        status: claim.status,
        vehicle_plate: claim.vehicle?.plate || null,
        vehicle_brand: claim.vehicle?.brand || null,
        vehicle_model: claim.vehicle?.model || null,
        vehicle_year: claim.vehicle?.year || null,
        vehicle_color: claim.vehicle?.color || null,
        workshop_name: claim.workshop?.name || null,
        workshop_cnpj: claim.workshop?.cnpj || null,
        workshop_phone: claim.workshop?.phone || null,
        workshop_address: claim.workshop?.address || null
      };

      // Criar novo sinistro (banco gera UUID automaticamente)
      const { data, error } = await supabase
        .from('claims')
        .insert(claimData)
        .select()
        .single();

      if (error) throw error;

      // Adicionar evento na timeline
      if (data) {
        await supabase.from('claim_timeline').insert({
          claim_id: data.id,
          event_date: new Date().toISOString().split('T')[0],
          event_time: new Date().toTimeString().split(' ')[0],
          description: 'Sinistro aberto pelo segurado.',
          status: 'Aberto'
        });
      }

      toast.success('Sinistro aberto com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar sinistro:', error);
      toast.error('Erro ao salvar sinistro');
    }
  };

  const deleteClaim = async (id: string) => {
    try {
      const { error } = await supabase
        .from('claims')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClaims(prev => prev.filter(c => c.id !== id));
      toast.success('Sinistro removido.');
    } catch (error) {
      console.error('Erro ao deletar sinistro:', error);
      toast.error('Erro ao remover sinistro');
    }
  };

  const getClaim = (id: string) => {
    return claims.find(c => c.id === id);
  };

  const updateStatus = async (id: string, status: ClaimStatus, description: string) => {
    try {
      const claim = claims.find(c => c.id === id);
      if (!claim) return;

      // Atualizar status do sinistro
      const { error: updateError } = await supabase
        .from('claims')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;

      // Adicionar evento na timeline
      const { error: timelineError } = await supabase
        .from('claim_timeline')
        .insert({
          claim_id: id,
          event_date: new Date().toISOString().split('T')[0],
          event_time: new Date().toTimeString().split(' ')[0],
          description,
          status
        });

      if (timelineError) throw timelineError;

      toast.info(`Status atualizado para: ${status}`);
      await fetchClaims();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const addTimelineEvent = async (id: string, description: string, status: ClaimStatus) => {
    try {
      const { error } = await supabase
        .from('claim_timeline')
        .insert({
          claim_id: id,
          event_date: new Date().toISOString().split('T')[0],
          event_time: new Date().toTimeString().split(' ')[0],
          description,
          status
        });

      if (error) throw error;

      await fetchClaims();
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
      toast.error('Erro ao adicionar evento');
    }
  };

  return { claims, loading, saveClaim, deleteClaim, getClaim, updateStatus, addTimelineEvent };
}
