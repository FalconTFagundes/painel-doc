# ⚙️ Central de Validações — Documentação de Desenvolvimento

**BigCard · TI · v2.4.1**

---

## Visão Geral da Arquitetura

A Central de Validações é uma aplicação **frontend pura** (SPA — Single Page Application), sem backend, sem banco de dados e sem dependências externas de runtime. Toda a lógica reside em um único arquivo HTML com JavaScript vanilla embutido.

```
central-validacoes/
├── index.html           ← Aplicação principal (HTML + CSS + JS)
├── gerar_relatorio.js   ← Script Node.js para geração .docx real
├── package.json         ← Dependência: docx (npm)
├── DOC_USO.md
├── DOC_DESENVOLVIMENTO.md
├── DOC_ROLLBACK.md
└── README.md
```

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | HTML5 + CSS3 + JavaScript ES6+ |
| Tipografia | IBM Plex Sans + IBM Plex Mono (Google Fonts) |
| Geração Word | Node.js + biblioteca `docx` (npm) |
| Armazenamento | Dados mockados em array JS (em memória) |
| Deploy | Arquivo local / servidor HTTP estático |

---

## Estrutura do Arquivo `index.html`

O arquivo está organizado em seções claramente demarcadas:

### CSS (`:root` — variáveis globais)
```css
:root {
  --bg: #0d0f14;        /* Fundo principal */
  --accent: #3d8ef0;    /* Azul primário */
  --green: #27c483;     /* Status validado */
  --yellow: #f5a623;    /* Status pendente */
  --red: #e8455a;       /* Status não validado */
  --purple: #9b72f5;    /* Status aguardando */
  /* ... */
}
```

Todas as cores, tamanhos e espaçamentos usam variáveis CSS, facilitando a criação de temas.

### Estrutura HTML

```
<header>           → Barra superior (logo + busca + usuário)
<nav.sidebar>      → Menu lateral
<main>
  #view-dashboard  → Cards KPI + gráficos + atividade recente
  #view-protocols  → Filtros + tabela + paginação
  #view-new        → Formulário de novo protocolo
  #view-relatorio  → Seleção e exportação de relatório
<div.modal-overlay> → Modal de detalhe do protocolo
<div.toast-container> → Sistema de notificações
```

### JavaScript — Seções Principais

#### Dados (`SISTEMAS` e `PROTOCOLS`)
```js
const SISTEMAS = {
  webempresas: {
    nome: 'WebEmpresas',
    url: 'webempresas.bigcard.com.br',
    hom: 'homempresas.bigcard.com.br'
  },
  // ...
};

let PROTOCOLS = [
  { id, sistema, ambiente, data, responsavel,
    statusHom, statusProd, desc, ajustes,
    obsHom, obsProd, obs },
  // 32 protocolos mockados
];
```

**Para adicionar um novo sistema:** inclua uma chave no objeto `SISTEMAS` e adicione as `<option>` nos selects relevantes.

#### Navegação (`showView`)
```js
function showView(name) {
  // Alterna visibilidade das .view
  // Atualiza estado ativo da sidebar
  // Inicializa dados da view quando necessário
}
```

#### Filtros e Tabela
```js
function filterProtocols()  // Lê todos os filtros, aplica sobre PROTOCOLS, chama renderTable()
function renderTable()       // Pagina filtered[], renderiza <tbody>
function renderPagination()  // Gera botões de página
```

#### Modal
```js
function openModal(id)      // Preenche todos os campos do modal
function buildTimeline(p)   // Constrói array de steps para a linha do tempo
function closeModalBtn()    // Fecha o modal
```

#### Exportação
```js
function exportWordById(id, tipo)  // Gera .doc (HTML compatível com Word)
function generateWordHTML(p, sis, tipo)  // Template HTML/MSWord com checkboxes
function exportCSV()               // Exporta filtered[] em CSV
```

---

## Adicionando Novos Protocolos (dados mockados)

Adicione um objeto ao array `PROTOCOLS` no topo do `<script>`:

```js
{
  id: 'PRO-2025-0033',
  sistema: 'webempresas',        // chave de SISTEMAS
  ambiente: 'AMBOS',             // HOM | PROD | AMBOS
  data: '29/05/2025',
  responsavel: 'Nome Sobrenome',
  statusHom: 'Validado',         // Validado | Não validado | —
  statusProd: 'Aguardando validação', // Validado | Não validado | Aguardando validação | Pendente
  desc: 'Descrição breve do ajuste.',
  ajustes: 'Detalhamento técnico dos arquivos/procedures alterados.',
  obsHom: 'Resultado observado em homologação.',
  obsProd: 'Resultado observado em produção.',
  obs: 'Observações adicionais.'
}
```

---

## Geração Real de .docx (Node.js)

O arquivo `gerar_relatorio.js` usa a biblioteca `docx` para gerar documentos Word reais (OOXML). Para usar:

```bash
# Instalar dependência
npm install

# Gerar relatório de exemplo
node gerar_relatorio.js relatorio.docx

# Gerar com dados customizados
# Edite o objeto `exemplo` no topo de gerar_relatorio.js
```

### Integrando o gerador com o frontend (futura evolução)

Para integrar com backend:
1. Crie um endpoint `POST /api/relatorios/:id` em Node.js/Express.
2. Receba os dados do protocolo via body.
3. Chame `buildDocument(data)` e envie o buffer como resposta com `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`.

---

## Adicionando Novos Campos ao Modal

1. Adicione o campo no `detail-grid` dentro de `.modal-body`:
```html
<div class="detail-field">
  <div class="detail-label">Novo Campo</div>
  <div class="detail-value" id="m-novo-campo">—</div>
</div>
```

2. Preencha no `openModal()`:
```js
document.getElementById('m-novo-campo').textContent = p.novoCampo || '—';
```

3. Adicione `novoCampo` ao schema de cada protocolo em `PROTOCOLS`.

---

## Extensões Futuras Recomendadas

| Feature | Abordagem |
|---------|-----------|
| Backend real | FastAPI (Python) ou Express (Node.js) + SQL Server |
| Autenticação | JWT / SSO com AD (já integrado em WebUsuários) |
| Notificações | WebSocket ou polling para alertas em tempo real |
| Histórico de edições | Campos `updatedAt`, `updatedBy` + log de mudanças |
| Aprovação por e-mail | Workflow de aprovação com tokens únicos |
| Relatório PDF | Puppeteer headless para renderizar o HTML como PDF |

---

## Convenções de Código

- **Nomes de funções:** camelCase, verbos em inglês (`renderTable`, `openModal`)
- **IDs HTML:** kebab-case com prefixo de contexto (`m-sistema`, `np-resp`, `f-ambiente`)
- **Classes CSS:** kebab-case semântico (`.badge-green`, `.kpi-card`, `.tl-dot`)
- **Dados:** português BR para labels, inglês para chaves de objeto

---

*Mantenedor: Equipe de TI — BigCard · Governador Valadares/MG*
