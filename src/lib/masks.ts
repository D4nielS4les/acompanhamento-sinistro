export const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const maskCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

// LGPD: Mascaramento parcial de dados sensíveis
export const maskCPFDisplay = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 11) return value;
  return `${digits.slice(0,3)}.***.***-${digits.slice(9)}`;
};

export const maskCNPJDisplay = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 14) return value;
  return `**.***.***/${digits.slice(8,12)}-**`;
};

export const maskEmailDisplay = (value: string) => {
  if (!value) return '';
  const [local, domain] = value.split('@');
  if (!domain) return value;
  const maskedLocal = local.length > 2
    ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
    : local[0] + '*';
  return `${maskedLocal}@${domain}`;
};

export const maskPhoneDisplay = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 10) return value;
  return `(${digits.slice(0,2)}) ****-${digits.slice(-4)}`;
};
