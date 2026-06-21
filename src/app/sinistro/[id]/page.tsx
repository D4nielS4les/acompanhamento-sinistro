"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useClaims } from "@/hooks/use-claims";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Timeline } from "@/components/ui/timeline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Download, 
  Shield,
  Info,
  Car,
  Wrench,
  MessageSquarePlus,
  Clock
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ClaimStatus } from "@/types/claim";

export default function ClaimDetail() {
  const { id } = useParams();
  const { getClaim, updateStatus, addTimelineEvent } = useClaims();
  const claim = getClaim(id as string);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  if (!claim) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Info className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Sinistro não encontrado</h2>
        <Button asChild>
          <Link href="/">Voltar para o Dashboard</Link>
        </Button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: ClaimStatus) => {
    if (newStatus === claim.status) return;

    const descriptions: Record<string, string> = {
      "Aberto": "Sinistro reiniciado para abertura.",
      "Em Análise": "Documentação recebida e em fase de análise técnica.",
      "Vistoria Agendada": "Vistoria técnica agendada para o local do evento.",
      "Documentação Pendente": "Necessário envio de comprovante de residência atualizado.",
      "Aprovado": "Sinistro aprovado. Processando pagamento.",
      "Pago/Encerrado": "Pagamento efetuado e sinistro encerrado com sucesso.",
    };

    updateStatus(claim.id, newStatus, descriptions[newStatus]);
    toast.info(`Status atualizado para: ${newStatus}`, {
      description: descriptions[newStatus],
    });
  };

  const handleAddMessage = () => {
    if (!newMessage.trim()) {
      toast.error("Digite uma mensagem para adicionar.");
      return;
    }
    addTimelineEvent(claim.id, newMessage.trim(), claim.status);
    setNewMessage("");
    setDialogOpen(false);
    toast.success("Mensagem adicionada ao acompanhamento!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-muted/30 p-6 border border-border/50"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="hover:bg-muted/50">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{claim.vehicle?.plate || claim.insuredName}</h1>
                <StatusBadge status={claim.status} />
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {claim.type} • Aberto em {new Date(claim.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <MessageSquarePlus className="h-4 w-4" /> Atualizar Acompanhamento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Atualizar Acompanhamento</DialogTitle>
                  <DialogDescription>
                    Adicione uma nova mensagem ao histórico deste sinistro.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Input
                      id="message"
                      placeholder="Ex: Documentação enviada, aguardando análise..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddMessage();
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>Status atual: <strong>{claim.status}</strong></span>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddMessage} className="gap-2">
                    <MessageSquarePlus className="h-4 w-4" /> Adicionar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Select value={claim.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Mudar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aberto">Aberto</SelectItem>
                <SelectItem value="Em Análise">Em Análise</SelectItem>
                <SelectItem value="Vistoria Agendada">Vistoria Agendada</SelectItem>
                <SelectItem value="Documentação Pendente">Documentação Pendente</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Pago/Encerrado">Pago/Encerrado</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
              Falar com Atendente
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Timeline and Status */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Acompanhamento
                    </CardTitle>
                    <CardDescription>Histórico de atualizações do seu sinistro.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Timeline events={claim.timeline} />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Descrição do Ocorrido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-xl">
                  {claim.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Data e Hora</p>
                      <p className="text-sm font-semibold">{claim.date} às {claim.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Local</p>
                      <p className="text-sm font-semibold line-clamp-1">{claim.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Documentos Anexados</CardTitle>
                <CardDescription>{claim.attachments.length} arquivos enviados.</CardDescription>
              </CardHeader>
              <CardContent>
                {claim.attachments.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/5">
                    <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Nenhum documento anexado.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {claim.attachments.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-all duration-200 group cursor-pointer">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="bg-primary/10 p-2.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Insured Info */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  Segurado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Nome Completo</p>
                  <p className="text-sm font-semibold">{claim.insuredName}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">CPF / CNPJ</p>
                  <p className="text-sm font-semibold font-mono">{claim.cpfCnpj}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Contato</p>
                  <div className="flex flex-col gap-3 mt-2">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-muted-foreground">{claim.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-muted-foreground">{claim.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  Dados da Apólice
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Seguradora</p>
                  <p className="text-sm font-semibold">{claim.insuranceCompany}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Número da Apólice</p>
                  <p className="text-sm font-mono font-bold text-primary bg-primary/5 px-3 py-2 rounded-lg inline-block">{claim.policyNumber}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Próximos Passos</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Nossa equipe técnica entrará em contato em até 48h úteis para prosseguir com a análise.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {claim.vehicle && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Car className="h-4 w-4 text-primary" />
                    </div>
                    Veículo
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Placa</p>
                    <p className="text-sm font-mono font-bold text-primary bg-primary/5 px-3 py-2 rounded-lg inline-block">{claim.vehicle.plate}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Marca</p>
                      <p className="text-sm font-semibold">{claim.vehicle.brand}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Modelo</p>
                      <p className="text-sm font-semibold">{claim.vehicle.model}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Ano</p>
                      <p className="text-sm font-semibold">{claim.vehicle.year}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Cor</p>
                      <p className="text-sm font-semibold">{claim.vehicle.color}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {claim.workshop && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Wrench className="h-4 w-4 text-primary" />
                    </div>
                    Oficina
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Nome da Oficina</p>
                    <p className="text-sm font-semibold">{claim.workshop.name}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">CNPJ</p>
                    <p className="text-sm font-mono">{claim.workshop.cnpj}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Telefone</p>
                    <p className="text-sm font-semibold">{claim.workshop.phone}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Endereço</p>
                    <p className="text-sm font-semibold">{claim.workshop.address}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button variant="outline" className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5 h-11">
              <Download className="h-4 w-4" /> Exportar Relatório
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
