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
  chassis: string;
  renavam: string;
}

export interface Workshop {
  name: string;
  cnpj: string;
  phone: string;
  address: string;
}

export interface RCF {
  id: string;
  claimId: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  vehicleChassis: string;
  vehicleRenavam: string;
  insuranceCompany: string;
  sinistroNumber: string;
  workshopName: string;
  createdAt: string;
}

export interface Claim {
  id: string;
  insuredName: string;
  cpfCnpj: string;
  policyNumber: string;
  insuranceCompany: string;
  email: string;
  phone: string;
  franchiseValue: string;
  claimNumber: string;
  rentalCarDays: string;
  driverCoverage: 'sim' | 'nao';
  driverName: string;
  driverCpf: string;
  driverBirthDate: string;
  driverCnhNumber: string;
  driverCnhCategory: string;
  driverCnhExpiry: string;
  driverRelationship: string;
  type: ClaimType;
  date: string;
  time: string;
  location: string;
  description: string;
  status: ClaimStatus;
  attachments: Attachment[];
  timeline: TimelineEvent[];
  rcfs: RCF[];
  parentClaimId?: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
  workshop?: Workshop;
}
