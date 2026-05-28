# Central de Validações — BigCard

> Sistema interno de controle de protocolos de ajuste em homologação e produção.

![Tech](https://img.shields.io/badge/tech-HTML%20%2B%20CSS%20%2B%20JS-informational)
![DB](https://img.shields.io/badge/banco-SQL%20Server-blue)
![Status](https://img.shields.io/badge/status-frontend--protótipo-yellow)
![License](https://img.shields.io/badge/licença-interno-lightgrey)

---

## Sobre

A **Central de Validações** é uma SPA (Single Page Application) desenvolvida para a equipe de TI da BigCard. Permite registrar e acompanhar todo o ciclo de ajustes nos sistemas internos: criação → homologação → publicação → validação em produção.

Esta versão é um **protótipo frontend** com dados mockados. O banco de dados SQL Server está documentado em `DOC_BANCO_DE_DADOS.md` pronto para implementação com backend.

---

## Como usar

```bash
# Clone
git clone https://github.com/bigcard-ti/central-validacoes.git

# Abra direto no navegador
# ou sirva localmente (recomendado):
python -m http.server 8080
# Acesse: http://localhost:8080
```

**Usuários de demonstração** — senha `bigcard`:
`rafael` · `patrick` · `carla` · `marcos` · `renan` · `ana`

Para geração de `.docx` real via Node.js:
```bash
npm install
node gerar_relatorio.js relatorio.docx
```

---

## Estrutura do projeto

```
central-validacoes/
├── central-validacoes.html   ← Aplicação completa (HTML + CSS + JS)
├── gerar_relatorio.js        ← Gerador .docx via Node.js
├── package.json              ← Dependência: docx (npm)
├── DOC_USO.md                ← Manual do usuário
├── DOC_DESENVOLVIMENTO.md    ← Guia técnico
├── DOC_BANCO_DE_DADOS.md     ← Estrutura SQL Server + triggers + views
├── DOC_ROLLBACK.md           ← Prompt de recriação em outra IA
└── README.md
```

---

## Sistemas monitorados

| Sistema | Produção | Homologação |
|---|---|---|
| WebEmpresas | webempresas.bigcard.com.br | homempresas.bigcard.com.br |
| WebCartões (WebView) | webcartoes.bigcard.com.br | homwebcartoes.bigcard.com.br |
| BigCash | web.bigcash.com.br | homweb.bigcash.com.br |
| WebUsuários | webusuarios.bigcard.com.br | homusuarios.bigcard.com.br |
| WebRedes | webredes.bigcard.com.br | homredes.bigcard.com.br |
| WebRepresentantes | webrepresentantes.bigcard.com.br | *(sem homologação)* |
| WebSuporte | websuporte.bigcard.com.br | homsuporte.bigcard.com.br |

---

## Ciclo de vida de um protocolo

```
Criado
  └─► HOM: Pendente ──► Aprovado ──► [Copiar para Prod.]
            │                                │
            └─► Reprovado (+1 retorno)       ▼
                                        PROD: Pendente
                                          └─► EmProducao ──► Aprovado ✓
                                                    │
                                                    └─► Reprovado (+1 retorno)
```

**Regra obrigatória:** Produção só avança quando Homologação estiver `Aprovado`. Garantido por CHECK CONSTRAINT no banco e validação no frontend.

**Retornos automáticos:** Ao marcar `Reprovado` em qualquer fase, o contador de retornos é incrementado automaticamente (frontend + trigger SQL Server).

---

## Status possíveis

| Status | Fase | Significado |
|---|---|---|
| Pendente | HOM ou PROD | Aguardando ação |
| Aprovado | HOM ou PROD | Validado com sucesso |
| Reprovado | HOM ou PROD | Falhou — retorna ao desenvolvedor |
| EmProducao | PROD | Publicado — aguardando validação final |

---

## Banco de dados (SQL Server)

```
BIGCARD_VALIDACOES
├── CV_SISTEMAS          → cadastro dos sistemas (ativo: 1/0)
├── CV_USUARIOS          → usuários do sistema (ativo: 1/0)
├── CV_PROTOCOLOS        → protocolos de ajuste (ativo: 1/0)
├── CV_RETORNOS          → histórico de retornos ao desenvolvedor
└── CV_STATUS_HISTORICO  → auditoria completa de mudanças
```

Ver `DOC_BANCO_DE_DADOS.md` para scripts completos de criação, trigger de auto-incremento de retornos e view auxiliar para API.

---

## Documentação

| Arquivo | Descrição |
|---|---|
| `DOC_USO.md` | Manual para usuários finais |
| `DOC_DESENVOLVIMENTO.md` | Guia técnico para desenvolvedores |
| `DOC_BANCO_DE_DADOS.md` | Estrutura SQL Server, triggers, views, dicionário |
| `DOC_ROLLBACK.md` | Prompt completo para recriar em outra IA |

---

## Roadmap

- [ ] Backend FastAPI + pyodbc + SQL Server
- [ ] Autenticação SSO com Active Directory
- [ ] Trigger de e-mail ao mudar status
- [ ] Histórico de auditoria visível na UI
- [ ] Export PDF via Puppeteer
- [ ] App mobile responsivo

---

**BigCard Tecnologia e Serviços · Governador Valadares/MG**
