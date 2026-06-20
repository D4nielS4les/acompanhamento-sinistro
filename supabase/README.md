# Configuração do Supabase

## 1. Criar Tabelas no Banco

Acesse o painel do Supabase e execute o SQL do arquivo `schema.sql`:

1. Vá para **SQL Editor** no painel do Supabase
2. Cole o conteúdo do arquivo `supabase/schema.sql`
3. Clique em **Run** para criar as tabelas

## 2. Verificar Tabelas

Após executar o SQL, você deve ver as seguintes tabelas:

- `claims` - Sinistros principais
- `claim_timeline` - Timeline de eventos
- `claim_attachments` - Anexos dos sinistros

## 3. Variáveis de Ambiente

Configure o arquivo `.env.local` com suas credenciais:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## 4. Rodar o Projeto

```bash
npm run dev
```

## Estrutura do Banco

### claims (Sinistros)
- `id` - UUID único
- `insured_name` - Nome do segurado
- `cpf_cnpj` - CPF/CNPJ
- `policy_number` - Número da apólice
- `insurance_company` - Seguradora
- `email` - Email do segurado
- `phone` - Telefone
- `type` - Tipo (Automóvel, Residencial, etc)
- `incident_date` - Data do sinistro
- `incident_time` - Hora do sinistro
- `location` - Local do sinistro
- `description` - Descrição
- `status` - Status atual
- Dados do veículo e oficina (opcionais)

### claim_timeline (Timeline)
- `id` - UUID único
- `claim_id` - Referência ao sinistro
- `event_date` - Data do evento
- `event_time` - Hora do evento
- `description` - Descrição do evento
- `status` - Status no momento do evento
