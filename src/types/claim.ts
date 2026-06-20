export type ClaimStatus = 
  | 'Aberto' 
  | 'Em Análise' 
  | 'Vistoria Agendada' 
  | 'Documentação Pendente' 
  | 'Aprovado' 
  | 'Pago/Encerrado';

export type ClaimType = 
  | 'Automóvel' 
  | 'Residencial' 
  | 'Vida' 
  | 'Saúde' 
  | 'Empresarial';

export interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  description: string;
  status: ClaimStatus;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface Vehicle {
  plate: string;
  brand: string;
  model: string;
  year: string;
  color: string;
}

export interface Workshop {
  name: string;
  cnpj: string;
  phone: string;
  address: string;
}

export interface Claim {
  id: string;
  insuredName: string;
  cpfCnpj: string;
  policyNumber: string;
  insuranceCompany: string;
  email: string;
  phone: string;
  type: ClaimType;
  date: string;
  time: string;
  location: string;
  description: string;
  status: ClaimStatus;
  attachments: Attachment[];
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
  workshop?: Workshop;
}
