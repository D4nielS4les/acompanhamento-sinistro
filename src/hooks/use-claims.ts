"use client";

import { useState, useEffect } from 'react';
import { Claim, ClaimStatus } from '@/types/claim';
import { toast } from 'sonner';

const STORAGE_KEY = 'sinistro_facil_claims';

export function useClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setClaims(JSON.parse(stored));
    } else {
      // Mock initial data
      const mockClaims: Claim[] = [
        {
          id: 'SIN-2024-001',
          insuredName: 'João Silva',
          cpfCnpj: '123.456.789-00',
          policyNumber: 'POL-987654',
          insuranceCompany: 'Porto Seguro',
          email: 'joao.silva@email.com',
          phone: '(11) 98888-7777',
          type: 'Automóvel',
          date: '2024-06-15',
          time: '14:30',
          location: 'Av. Paulista, 1000 - São Paulo, SP',
          description: 'Colisão traseira no semáforo.',
          status: 'Em Análise',
          attachments: [],
          timeline: [
            {
              id: '1',
              date: '2024-06-15',
              time: '14:45',
              description: 'Sinistro aberto pelo segurado.',
              status: 'Aberto'
            },
            {
              id: '2',
              date: '2024-06-16',
              time: '09:00',
              description: 'Documentação recebida e em análise.',
              status: 'Em Análise'
            }
          ],
          vehicle: {
            plate: 'ABC-1234',
            brand: 'Toyota',
            model: 'Corolla',
            year: '2022',
            color: 'Prata'
          },
          workshop: {
            name: 'Oficina dos Amigos Ltda',
            cnpj: '12.345.678/0001-90',
            phone: '(11) 3333-3333',
            address: 'Rua das Oficinas, 456 - São Paulo, SP'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setClaims(mockClaims);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockClaims));
    }
    setLoading(false);
  }, []);

  const saveClaim = (claim: Claim) => {
    const updatedClaims = [...claims];
    const index = updatedClaims.findIndex(c => c.id === claim.id);
    
    if (index >= 0) {
      updatedClaims[index] = { ...claim, updatedAt: new Date().toISOString() };
      toast.success('Sinistro atualizado com sucesso!');
    } else {
      updatedClaims.push({ ...claim, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      toast.success('Sinistro aberto com sucesso!');
    }
    
    setClaims(updatedClaims);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClaims));
  };

  const deleteClaim = (id: string) => {
    const updatedClaims = claims.filter(c => c.id !== id);
    setClaims(updatedClaims);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClaims));
    toast.success('Sinistro removido.');
  };

  const getClaim = (id: string) => {
    return claims.find(c => c.id === id);
  };

  const updateStatus = (id: string, status: ClaimStatus, description: string) => {
    const claim = claims.find(c => c.id === id);
    if (claim) {
      const newEvent = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        description,
        status
      };
      
      const updatedClaim = {
        ...claim,
        status,
        timeline: [newEvent, ...claim.timeline],
        updatedAt: new Date().toISOString()
      };
      
      saveClaim(updatedClaim);
      toast.info(`Status atualizado para: ${status}`);
    }
  };

  const addTimelineEvent = (id: string, description: string, status: ClaimStatus) => {
    const claim = claims.find(c => c.id === id);
    if (claim) {
      const newEvent = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        description,
        status
      };

      const updatedClaim = {
        ...claim,
        timeline: [newEvent, ...claim.timeline],
        updatedAt: new Date().toISOString()
      };

      saveClaim(updatedClaim);
    }
  };

  return { claims, loading, saveClaim, deleteClaim, getClaim, updateStatus, addTimelineEvent };
}
