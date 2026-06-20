import { Badge } from "@/components/ui/badge";
import { ClaimStatus } from "@/types/claim";

interface StatusBadgeProps {
  status: ClaimStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (status: ClaimStatus) => {
    switch (status) {
      case 'Aberto':
        return 'info';
      case 'Em Análise':
        return 'warning';
      case 'Vistoria Agendada':
        return 'secondary';
      case 'Documentação Pendente':
        return 'destructive';
      case 'Aprovado':
        return 'success';
      case 'Pago/Encerrado':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <Badge variant={getVariant(status)} className={className}>
      {status}
    </Badge>
  );
}
