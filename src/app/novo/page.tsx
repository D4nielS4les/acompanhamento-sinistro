"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useClaims } from "@/hooks/use-claims";
import { Claim } from "@/types/claim";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, X, File, AlertCircle, ArrowLeft, ArrowRight, Check, User, FileText, Car, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { maskCPF, maskPhone, maskCNPJ } from "@/lib/masks";
import { toast } from "sonner";

const claimSchema = z.object({
  insuredName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  policyNumber: z.string().min(5, "Número da apólice é obrigatório"),
  insuranceCompany: z.string().min(1, "Seguradora é obrigatória"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  type: z.enum(['Automóvel', 'Residencial', 'Vida', 'Saúde', 'Empresarial']),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Hora é obrigatória"),
  location: z.string().min(5, "Localização é obrigatória"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres").max(500, "Descrição muito longa"),
  vehiclePlate: z.string().optional(),
  vehicleBrand: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.string().optional(),
  vehicleColor: z.string().optional(),
  workshopName: z.string().optional(),
  workshopCnpj: z.string().optional(),
  workshopPhone: z.string().optional(),
  workshopAddress: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'Automóvel') {
    if (!data.vehiclePlate || data.vehiclePlate.length < 7) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Placa do veículo é obrigatória",
        path: ["vehiclePlate"],
      });
    }
    if (!data.vehicleBrand || data.vehicleBrand.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Marca do veículo é obrigatória",
        path: ["vehicleBrand"],
      });
    }
    if (!data.vehicleModel || data.vehicleModel.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Modelo do veículo é obrigatório",
        path: ["vehicleModel"],
      });
    }
  }
});

type ClaimFormData = z.infer<typeof claimSchema>;

export default function NewClaim() {
  const router = useRouter();
  const { saveClaim } = useClaims();
  const [step, setStep] = useState(1);
  const [attachments, setAttachments] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ClaimFormData>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      type: 'Automóvel',
    }
  });

  const description = watch("description") || "";
  const claimType = watch("type") || "";

  const onSubmit = (data: ClaimFormData) => {
    const newClaim: Claim = {
      ...data,
      id: `SIN-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: 'Aberto',
      insuranceCompany: data.insuranceCompany,
      vehicle: data.type === 'Automóvel' ? {
        plate: data.vehiclePlate || '',
        brand: data.vehicleBrand || '',
        model: data.vehicleModel || '',
        year: data.vehicleYear || '',
        color: data.vehicleColor || '',
      } : undefined,
      workshop: {
        name: data.workshopName || '',
        cnpj: data.workshopCnpj || '',
        phone: data.workshopPhone || '',
        address: data.workshopAddress || '',
      },
      attachments: attachments.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type,
        url: URL.createObjectURL(file)
      })),
      timeline: [
        {
          id: '1',
          date: new Date().toLocaleDateString('pt-BR'),
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          description: 'Sinistro aberto pelo segurado.',
          status: 'Aberto'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveClaim(newClaim);
    toast.success("Sinistro aberto com sucesso!", {
      description: `O ID do seu sinistro é ${newClaim.id}`,
    });
    router.push('/');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    // Validar campos do passo atual antes de prosseguir
    let fieldsToValidate: string[] = [];
    if (step === 1) {
      fieldsToValidate = ["insuredName", "cpfCnpj", "policyNumber", "insuranceCompany", "email", "phone"];
    } else if (step === 2) {
      fieldsToValidate = ["date", "time", "location", "description"];
      if (claimType === 'Automóvel') {
        fieldsToValidate.push("vehiclePlate", "vehicleBrand", "vehicleModel");
      }
    } else if (step === 3) {
      // No validation for workshop step (optional)
      fieldsToValidate = [];
    }
    
    // @ts-expect-error dynamic field validation
    const isValid = fieldsToValidate.every(field => !errors[field]);
    
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 border border-primary/10"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="hover:bg-background/50">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Abrir Novo Sinistro</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Preencha os dados abaixo para registrar seu sinistro
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-6 border border-border/50"
      >
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300",
                    step === s 
                      ? "bg-primary text-white shadow-lg shadow-primary/25" 
                      : step > s 
                        ? "bg-emerald-500 text-white" 
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                <span className={cn(
                  "text-xs mt-2 font-medium hidden sm:block",
                  step === s ? "text-primary" : "text-muted-foreground"
                )}>
                  {s === 1 ? "Dados Pessoais" : s === 2 ? "Ocorrência" : s === 3 ? "Documentos" : "Oficina"}
                </span>
              </div>
              {s < 4 && (
                <div className="flex-1 mx-3 mt-0 sm:-mt-6">
                  <div
                    className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      step > s ? "bg-emerald-500" : "bg-muted"
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} suppressHydrationWarning>
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  Dados do Segurado e Apólice
                </CardTitle>
                <CardDescription>Identifique-se e informe os dados da sua apólice.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="insuredName" className="text-sm font-medium">Nome Completo</Label>
                    <Input 
                      id="insuredName" 
                      {...register("insuredName")} 
                      placeholder="Ex: João Silva"
                      className="h-11"
                    />
                    {errors.insuredName && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.insuredName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpfCnpj" className="text-sm font-medium">CPF / CNPJ</Label>
                    <Input 
                      id="cpfCnpj" 
                      {...register("cpfCnpj")} 
                      placeholder="000.000.000-00"
                      className="h-11"
                      onChange={(e) => {
                        const masked = maskCPF(e.target.value);
                        setValue("cpfCnpj", masked);
                      }}
                    />
                    {errors.cpfCnpj && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.cpfCnpj.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policyNumber" className="text-sm font-medium">Número da Apólice</Label>
                    <Input 
                      id="policyNumber" 
                      {...register("policyNumber")} 
                      placeholder="POL-123456"
                      className="h-11"
                    />
                    {errors.policyNumber && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.policyNumber.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insuranceCompany" className="text-sm font-medium">Seguradora</Label>
                    <select
                      id="insuranceCompany"
                      {...register("insuranceCompany")}
                      className="flex h-11 w-full rounded-lg border border-input bg-white/70 text-gray-900 px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
                    >
                      <option value="">Selecione a seguradora</option>
                      <option value="Allianz Seguros">Allianz Seguros</option>
                      <option value="Bradesco Seguros">Bradesco Seguros</option>
                      <option value="Porto Seguro">Porto Seguro</option>
                      <option value="SulAmérica">SulAmérica</option>
                      <option value="Tokio Marine">Tokio Marine</option>
                      <option value="Liberty Seguros">Liberty Seguros</option>
                      <option value="Azul Seguros">Azul Seguros</option>
                      <option value="Itaú Seguros">Itaú Seguros</option>
                      <option value="BB Seguros">BB Seguros</option>
                      <option value="Caixa Seguros">Caixa Seguros</option>
                      <option value="Hdi Seguros">Hdi Seguros</option>
                      <option value="Pottencial Seguros">Pottencial Seguros</option>
                      <option value="Mapfre Seguros">Mapfre Seguros</option>
                      <option value="Sompo Seguros">Sompo Seguros</option>
                      <option value="Zurich Seguros">Zurich Seguros</option>
                      <option value="Generali Seguros">Generali Seguros</option>
                      <option value="AXA Seguros">AXA Seguros</option>
                      <option value="Yéllo Seguros">Yéllo Seguros</option>
                      <option value="Mercantil do Brasil Seguros">Mercantil do Brasil Seguros</option>
                      <option value="Sul America Embratel">Sul America Embratel</option>
                      <option value="Outra">Outra</option>
                    </select>
                    {errors.insuranceCompany && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.insuranceCompany.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">E-mail de Contato</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...register("email")} 
                      placeholder="joao@email.com"
                      className="h-11"
                    />
                    {errors.email && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
                    <Input 
                      id="phone" 
                      {...register("phone")} 
                      placeholder="(11) 99999-9999"
                      className="h-11 max-w-md"
                      onChange={(e) => {
                        const masked = maskPhone(e.target.value);
                        setValue("phone", masked);
                      }}
                    />
                    {errors.phone && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.phone.message}</p>}
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="button" onClick={nextStep} className="gap-2 h-11 px-6">
                    Próximo Passo <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} suppressHydrationWarning>
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  Detalhes da Ocorrência
                </CardTitle>
                <CardDescription>Conte-nos o que aconteceu e onde.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium">Tipo de Sinistro</Label>
                    <select
                      id="type"
                      {...register("type")}
                      className="flex h-11 w-full rounded-lg border border-input bg-transparent px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
                    >
                      <option value="Automóvel">Automóvel</option>
                      <option value="Residencial">Residencial</option>
                      <option value="Vida">Vida</option>
                      <option value="Saúde">Saúde</option>
                      <option value="Empresarial">Empresarial</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium">Data</Label>
                      <Input id="date" type="date" {...register("date")} className="h-11" />
                      {errors.date && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.date.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-sm font-medium">Hora</Label>
                      <Input id="time" type="time" {...register("time")} className="h-11" />
                      {errors.time && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.time.message}</p>}
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">Local do Evento</Label>
                    <Input 
                      id="location" 
                      {...register("location")} 
                      placeholder="Rua, Número, Bairro, Cidade, UF"
                      className="h-11"
                    />
                    {errors.location && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.location.message}</p>}
                  </div>

                  {claimType === 'Automóvel' && (
                    <div className="md:col-span-2 pt-6 border-t border-border/50">
                      <div className="flex items-center gap-2 mb-5">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Car className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="text-sm font-semibold">Dados do Veículo</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="vehiclePlate" className="text-sm font-medium">Placa</Label>
                          <Input id="vehiclePlate" {...register("vehiclePlate")} placeholder="ABC-1234" className="h-11" />
                          {errors.vehiclePlate && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.vehiclePlate.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vehicleBrand" className="text-sm font-medium">Marca</Label>
                          <Input id="vehicleBrand" {...register("vehicleBrand")} placeholder="Toyota" className="h-11" />
                          {errors.vehicleBrand && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.vehicleBrand.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vehicleModel" className="text-sm font-medium">Modelo</Label>
                          <Input id="vehicleModel" {...register("vehicleModel")} placeholder="Corolla" className="h-11" />
                          {errors.vehicleModel && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.vehicleModel.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="vehicleYear" className="text-sm font-medium">Ano</Label>
                            <Input id="vehicleYear" {...register("vehicleYear")} placeholder="2024" className="h-11" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="vehicleColor" className="text-sm font-medium">Cor</Label>
                            <Input id="vehicleColor" {...register("vehicleColor")} placeholder="Prata" className="h-11" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="md:col-span-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="description" className="text-sm font-medium">Descrição Detalhada</Label>
                      <span className={cn("text-xs font-medium", description.length > 450 ? "text-destructive" : "text-muted-foreground")}>
                        {description.length}/500
                      </span>
                    </div>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Descreva o ocorrido com o máximo de detalhes possível..."
                      className="min-h-[140px] rounded-xl"
                    />
                    {errors.description && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.description.message}</p>}
                  </div>
                </div>
                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep} className="gap-2 h-11">
                    <ArrowLeft className="h-4 w-4" /> Anterior
                  </Button>
                  <Button type="button" onClick={nextStep} className="gap-2 h-11 px-6">
                    Próximo Passo <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} suppressHydrationWarning>
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Upload className="h-4 w-4 text-primary" />
                  </div>
                  Documentação e Fotos
                </CardTitle>
                <CardDescription>Anexe fotos da ocorrência, BO, orçamentos ou outros documentos relevantes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div
                  className="border-2 border-dashed border-primary/20 rounded-2xl p-10 flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10 hover:to-primary/5 transition-all duration-300 cursor-pointer relative group"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="bg-primary/10 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-semibold mb-1">Arraste ou clique para enviar arquivos</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, PDF (Máx 5MB por arquivo)</p>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Arquivos Selecionados ({attachments.length})</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {attachments.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-all duration-200 group">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors shrink-0">
                              <File className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeAttachment(i)} className="shrink-0 ml-2 hover:bg-destructive/10 hover:text-destructive">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Certifique-se de que todas as fotos e documentos estejam legíveis para agilizar a análise do seu sinistro.
                  </p>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep} className="gap-2 h-11">
                    <ArrowLeft className="h-4 w-4" /> Anterior
                  </Button>
                  <Button type="button" onClick={nextStep} className="gap-2 h-11 px-6">
                    Próximo Passo <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} suppressHydrationWarning>
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Wrench className="h-4 w-4 text-primary" />
                  </div>
                  Cadastro da Oficina
                </CardTitle>
                <CardDescription>Informe os dados da oficina que irá reparar o veículo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="workshopName" className="text-sm font-medium">Nome da Oficina</Label>
                    <Input 
                      id="workshopName" 
                      {...register("workshopName")} 
                      placeholder="Oficina Exemplo Ltda"
                      className="h-11"
                    />
                    {errors.workshopName && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.workshopName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workshopCnpj" className="text-sm font-medium">CNPJ</Label>
                    <Input 
                      id="workshopCnpj" 
                      {...register("workshopCnpj")} 
                      placeholder="00.000.000/0000-00"
                      className="h-11"
                      onChange={(e) => {
                        const masked = maskCNPJ(e.target.value);
                        setValue("workshopCnpj", masked);
                      }}
                    />
                    {errors.workshopCnpj && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.workshopCnpj.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workshopPhone" className="text-sm font-medium">Telefone</Label>
                    <Input 
                      id="workshopPhone" 
                      {...register("workshopPhone")} 
                      placeholder="(11) 99999-9999"
                      className="h-11"
                      onChange={(e) => {
                        const masked = maskPhone(e.target.value);
                        setValue("workshopPhone", masked);
                      }}
                    />
                    {errors.workshopPhone && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.workshopPhone.message}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="workshopAddress" className="text-sm font-medium">Endereço</Label>
                    <Input 
                      id="workshopAddress" 
                      {...register("workshopAddress")} 
                      placeholder="Rua, Número, Bairro, Cidade, UF"
                      className="h-11"
                    />
                    {errors.workshopAddress && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.workshopAddress.message}</p>}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep} className="gap-2 h-11">
                    <ArrowLeft className="h-4 w-4" /> Anterior
                  </Button>
                  <Button type="submit" className="gap-2 h-11 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300">
                    Finalizar e Abrir Sinistro <Check className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </form>
    </div>
  );
}
