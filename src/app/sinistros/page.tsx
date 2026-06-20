"use client";

import { useState, useMemo } from "react";
import { useClaims } from "@/hooks/use-claims";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  ArrowLeft,
  Search,
  Car,
  FileText,
  Calendar,
  ChevronRight,
  X,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ClaimStatus } from "@/types/claim";

const statusFilters: ClaimStatus[] = [
  "Aberto",
  "Em Análise",
  "Vistoria Agendada",
  "Documentação Pendente",
  "Aprovado",
  "Pago/Encerrado",
];

export default function AllClaims() {
  const { claims, loading } = useClaims();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | "">("");

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesSearch =
        search === "" ||
        claim.id.toLowerCase().includes(search.toLowerCase()) ||
        claim.vehicle?.plate?.toLowerCase().includes(search.toLowerCase()) ||
        claim.insuredName.toLowerCase().includes(search.toLowerCase()) ||
        claim.insuranceCompany.toLowerCase().includes(search.toLowerCase()) ||
        claim.location.toLowerCase().includes(search.toLowerCase()) ||
        claim.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "" || claim.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [claims, search, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando sinistros...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold tracking-tight">Todos os Sinistros</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {filteredClaims.length} sinistro{filteredClaims.length !== 1 ? "s" : ""} encontrado{filteredClaims.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por placa, nome, seguradora, local..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setStatusFilter("")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === ""
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Todos
                </button>
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(statusFilter === status ? "" : status)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            {filteredClaims.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum sinistro encontrado</h3>
                <p className="text-sm text-muted-foreground">
                  Tente ajustar os filtros de busca.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                        Placa / ID
                      </th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                        Segurado
                      </th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                        Seguradora
                      </th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                        Tipo
                      </th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                        Status
                      </th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                        Data
                      </th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                        Oficina
                      </th>
                      <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                        Docs
                      </th>
                      <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider px-6 py-4">
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClaims.map((claim, index) => (
                      <tr
                        key={claim.id}
                        className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/10"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-bold text-primary font-mono">
                              {claim.vehicle?.plate || claim.id}
                            </p>
                            <p className="text-xs text-muted-foreground">{claim.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium">{claim.insuredName}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-muted-foreground">{claim.insuranceCompany}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Car className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{claim.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={claim.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {new Date(claim.createdAt).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 max-w-[180px]">
                            <Car className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-xs text-muted-foreground truncate">
                              {claim.workshop?.name || "Não informada"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {claim.attachments.length}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link href={`/sinistro/${claim.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary/80">
                              Ver <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
