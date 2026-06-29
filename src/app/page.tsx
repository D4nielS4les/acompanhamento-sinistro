"use client";

import { useState, useMemo } from "react";
import { useClaims } from "@/hooks/use-claims";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  FileText,
  Calendar,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Car,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Claim } from "@/types/claim";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { RevealData } from "@/components/ui/reveal-data";

const stats = [
  { label: "Total de Sinistros", value: "0", icon: BarChart3, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Em Análise", value: "0", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Aprovados", value: "0", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Pendentes", value: "0", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
];

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { claims, loading, deleteClaim, saveClaim } = useClaims();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [editForm, setEditForm] = useState({
    insuredName: "",
    insuranceCompany: "",
    phone: "",
    location: "",
  });

  const filteredClaims = useMemo(() => {
    if (!search) return claims;
    const term = search.toLowerCase();
    return claims.filter(
      (c) =>
        c.insuredName.toLowerCase().includes(term) ||
        c.vehicle?.plate?.toLowerCase().includes(term) ||
        c.insuranceCompany.toLowerCase().includes(term) ||
        c.location?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
    );
  }, [claims, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-transparent border-b-primary/40 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-sm text-muted-foreground">Carregando sinistros...</p>
        </div>
      </div>
    );
  }

  const updateStats = () => {
    const total = filteredClaims.length;
    const emAnalise = filteredClaims.filter(c => c.status === "Em Análise").length;
    const aprovados = filteredClaims.filter(c => c.status === "Aprovado" || c.status === "Pago/Encerrado").length;
    const pendentes = filteredClaims.filter(c => c.status === "Aberto" || c.status === "Documentação Pendente").length;
    
    return [
      { ...stats[0], value: total.toString() },
      { ...stats[1], value: emAnalise.toString() },
      { ...stats[2], value: aprovados.toString() },
      { ...stats[3], value: pendentes.toString() },
    ];
  };

  const currentStats = updateStats();

  const handleDelete = () => {
    if (selectedClaim) {
      deleteClaim(selectedClaim.id);
      setDeleteDialogOpen(false);
      setSelectedClaim(null);
    }
  };

  const handleEdit = () => {
    if (selectedClaim) {
      const updatedClaim = {
        ...selectedClaim,
        insuredName: editForm.insuredName,
        insuranceCompany: editForm.insuranceCompany,
        phone: editForm.phone,
        location: editForm.location,
      };
      saveClaim(updatedClaim);
      setEditDialogOpen(false);
      setSelectedClaim(null);
    }
  };

  const openEditDialog = (claim: Claim) => {
    setSelectedClaim(claim);
    setEditForm({
      insuredName: claim.insuredName,
      insuranceCompany: claim.insuranceCompany,
      phone: claim.phone,
      location: claim.location,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (claim: Claim) => {
    setSelectedClaim(claim);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 border border-primary/10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Bem-vindo ao <span className="text-primary">SinistroFacil</span>
              </h1>
              <p className="text-muted-foreground mt-2 max-w-lg">
                Gerencie e acompanhe todos os seus sinistros de forma simples e rápida. 
                Abra novos registros, acompanhe o andamento e receba atualizações em tempo real.
              </p>
            </div>
            <Button asChild size="lg" className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
              <Link href="/novo" className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Novo Sinistro
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {currentStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-xl`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Claims Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Sinistros Recentes</h2>
            <p className="text-sm text-muted-foreground">Últimos sinistros registrados no sistema</p>
          </div>
          {claims.length > 0 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/sinistros" className="gap-2">
                Ver Todos
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {filteredClaims.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
                <div className="relative bg-gradient-to-br from-muted to-muted/50 p-6 rounded-2xl">
                  <ShieldAlert className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {search ? "Nenhum sinistro encontrado para a busca" : "Nenhum sinistro encontrado"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                {search ? "Tente buscar com outros termos." : "Você ainda não possui sinistros registrados. Comece abrindo seu primeiro sinistro agora mesmo."}
              </p>
              {!search && (
                <Button asChild size="lg">
                  <Link href="/novo" className="gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Abrir Primeiro Sinistro
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClaims.map((claim, index) => (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-mono font-bold text-primary tracking-wide bg-primary/10 px-3 py-1.5 rounded-md">
                        {claim.vehicle?.plate || claim.id}
                      </span>
                      <StatusBadge status={claim.status} />
                    </div>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {claim.type}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1 text-sm">
                      {claim.workshop?.name || "Oficina não informada"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-2.5 text-sm">
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <div className="bg-muted/50 p-1.5 rounded-lg">
                          <Calendar className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs">{claim.date} às {claim.time}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <div className="bg-muted/50 p-1.5 rounded-lg">
                          <MapPin className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs line-clamp-1">{claim.location}</span>
                      </div>
                      {claim.vehicle && (
                        <div className="flex items-center gap-2.5 text-muted-foreground">
                          <div className="bg-muted/50 p-1.5 rounded-lg">
                            <Car className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs">{claim.vehicle.brand} {claim.vehicle.model}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <div className="bg-muted/50 p-1.5 rounded-lg">
                          <FileText className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs">{claim.attachments.length} Documentos</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                      <button
                        onClick={() => router.push(`/sinistro/${claim.id}`)}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      >
                        Ver detalhes
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditDialog(claim)}
                          className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(claim)}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/sinistro/${claim.id}`)}
                          className="p-2 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary transition-all duration-300 cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Sinistro</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o sinistro <strong>{selectedClaim?.vehicle?.plate || selectedClaim?.id}</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash2 className="h-4 w-4" /> Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedClaim && (
            <>
              <DialogHeader>
                <DialogTitle>Editar Sinistro</DialogTitle>
                <DialogDescription>
                  Edite as informações do sinistro <strong>{selectedClaim.vehicle?.plate || selectedClaim.id}</strong>.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="editInsuredName">Nome do Segurado</Label>
                  <Input
                    id="editInsuredName"
                    value={editForm.insuredName}
                    onChange={(e) => setEditForm({ ...editForm, insuredName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editInsuranceCompany">Seguradora</Label>
                  <Input
                    id="editInsuranceCompany"
                    value={editForm.insuranceCompany}
                    onChange={(e) => setEditForm({ ...editForm, insuranceCompany: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPhone">Telefone</Label>
                  <Input
                    id="editPhone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLocation">Local</Label>
                  <Input
                    id="editLocation"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEdit} className="gap-2">
                  <Pencil className="h-4 w-4" /> Salvar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
