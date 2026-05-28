# Central de Validações — BigCard

> Sistema interno de controle de protocolos de ajustes em ambientes de homologação e produção.

![Version](https://img.shields.io/badge/versão-2.4.1-blue)
![Tech](https://img.shields.io/badge/tech-HTML%20%2B%20CSS%20%2B%20JS-informational)
![Status](https://img.shields.io/badge/status-frontend--only-yellow)
![License](https://img.shields.io/badge/licença-interno-lightgrey)

---

## 📋 Sobre o Projeto

A **Central de Validações** é uma Single Page Application (SPA) desenvolvida para a equipe de TI da BigCard. Permite registrar e acompanhar todos os ajustes realizados nos sistemas internos, controlando as fases de homologação, publicação e validação em produção.

Esta versão é um **protótipo frontend** com dados mockados, desenvolvido para validação de UX e levantamento de requisitos antes da implementação com backend real.

---

## 🖥️ Demonstração

| Tela | Descrição |
|------|-----------|
| Dashboard | KPIs + gráficos + atividade recente |
| Protocolos | Listagem com filtros, busca e paginação |
| Detalhe | Modal completo com linha do tempo |
| Novo Protocolo | Formulário de cadastro |
| Relatório | Exportação em formato Word (.doc) |

---

## 🚀 Como Usar

Sem instalação necessária para o frontend:

```bash
# Clone o repositório
git clone https://github.com/bigcard-ti/central-validacoes.git

# Abra o sistema
# Opção 1: Abrir index.html diretamente no navegador
# Opção 2: Servir com Python (evita bloqueios CORS em alguns navegadores)
python -m http.server 8080
# Acesse: http://localhost:8080
```

Para geração real de relatórios `.docx`:

```bash
# Instalar dependências Node.js
npm install

# Gerar relatório de exemplo
node gerar_relatorio.js relatorio.docx
```

---

## 📁 Estrutura do Projeto

```
central-validacoes/
├── index.html              ← Aplicação principal (tudo em um arquivo)
├── gerar_relatorio.js      ← Gerador de .docx via Node.js
├── package.json            ← Dependências npm
├── DOC_USO.md              ← Manual do usuário
├── DOC_DESENVOLVIMENTO.md  ← Guia para desenvolvedores
├── DOC_ROLLBACK.md         ← Prompt de recriação / rollback
└── README.md               ← Este arquivo
```

---

## ⚙️ Tecnologias

- **Frontend:** HTML5 + CSS3 (Custom Properties) + JavaScript ES6+ puro
- **Tipografia:** [IBM Plex Sans + IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Sans) via Google Fonts
- **Geração Word:** [`docx`](https://www.npmjs.com/package/docx) (npm)
- **Sem dependências** de framework JS no frontend

---

## 🏗️ Sistemas Monitorados

| Sistema | Produção | Homologação |
|---------|----------|-------------|
| WebEmpresas | webempresas.bigcard.com.br | homempresas.bigcard.com.br |
| WebCartões (App WebView) | webcartoes.bigcard.com.br | homwebcartoes.bigcard.com.br |
| BigCash | web.bigcash.com.br | homweb.bigcash.com.br |
| WebUsuários | webusuarios.bigcard.com.br | homusuarios.bigcard.com.br |
| WebRedes | webredes.bigcard.com.br | homredes.bigcard.com.br |
| WebRepresentantes | webrepresentantes.bigcard.com.br | *(sem homologação)* |
| WebSuporte | websuporte.bigcard.com.br | homsuporte.bigcard.com.br |

---

## 📊 Status de Protocolos

### Homologação
| Badge | Status |
|-------|--------|
| 🟢 Validado | Aprovado em homologação |
| 🔴 Não validado | Reprovado, requer correção |
| ⚫ N/A | Sistema sem ambiente de homologação |

### Produção
| Badge | Status |
|-------|--------|
| 🟢 Validado | Confirmado em produção |
| 🟣 Aguardando | Publicado, aguardando validação |
| 🟡 Pendente | Não publicado ainda |
| 🔴 Não validado | Problema identificado em produção |

---

## 📄 Documentação

| Documento | Descrição |
|-----------|-----------|
| [DOC_USO.md](./DOC_USO.md) | Manual completo para usuários finais |
| [DOC_DESENVOLVIMENTO.md](./DOC_DESENVOLVIMENTO.md) | Guia técnico para desenvolvedores |
| [DOC_ROLLBACK.md](./DOC_ROLLBACK.md) | Como recriar o sistema em outra IA |

---

## 🗺️ Roadmap

- [ ] Backend real (FastAPI + SQL Server)
- [ ] Autenticação SSO com Active Directory
- [ ] Notificações por e-mail ao mudar status
- [ ] Dashboard com dados históricos
- [ ] Exportação PDF nativa via Puppeteer
- [ ] Workflow de aprovação (aprovador via link no e-mail)
- [ ] App mobile responsivo

---

## 🏢 Sobre

**BigCard Tecnologia e Serviços**
Governador Valadares, MG — Brasil

Desenvolvido pela equipe de TI para uso interno.

---

*Versão 2.4.1 · Maio/2025*
