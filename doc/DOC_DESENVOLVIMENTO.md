# ⚙️ Central de Validações — Documentação de Desenvolvimento

**BigCard · TI**

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5 + CSS3 (Custom Properties) + JavaScript ES6+ puro |
| Tipografia | IBM Plex Sans + IBM Plex Mono (Google Fonts) |
| Geração Word | `application/msword` blob (HTML compatível) no browser |
| Geração Word real (.docx) | Node.js + biblioteca `docx` (npm) — `gerar_relatorio.js` |
| Banco de dados (futuro backend) | SQL Server — ver `DOC_BANCO_DE_DADOS.md` |
| Deploy atual | Arquivo único `central-validacoes.html` — abre direto no browser |

---

## Estrutura do arquivo `central-validacoes.html`

```
<head>
  <style> ─── todas as variáveis CSS, componentes e utilitários

<body>
  #login-screen   ─── tela de login (fora do #app)
  .modal-overlay  ─── modal de detalhes (fora do #app — crítico!)
  .toast-container─── notificações (fora do #app — crítico!)
  #app
    <header>      ─── logo + busca + usuário
    <nav.sidebar> ─── menu lateral
    <main>
      #view-dashboard  ─── KPIs + gráficos
      #view-protocols  ─── tabela com filtros
      #view-new        ─── formulário de novo registro
      #view-relatorio  ─── exportação Word

<script>
  USERS          ─── usuários mockados
  SISTEMAS       ─── sistemas cadastrados
  PROTOCOLS      ─── dados mockados
  Login/logout
  Navegação (showView)
  Filtros (filterProtocols, setFaseFilter, getFase)
  Tabela (renderTable, buildStatusCell, buildAndamentoInline)
  Modal (openModal, adjustRetornos, saveModalChanges, copiarParaProd)
  Exportação (exportWordById, exportCSV)
```

### Por que modal e toast ficam fora do `#app`?

O `#app` tem `display: none` até o login ser efetuado. Qualquer elemento filho herdará essa propriedade e não será renderizado — incluindo o modal ao tentar abrir via `classList.add('open')`. Modal e toast precisam estar no nível do `<body>`, fora do `#app`.

---

## Variáveis CSS globais

```css
:root {
  --bg: #0d0f14;          /* fundo principal */
  --bg2: #12151c;         /* cards, header, sidebar */
  --bg3: #181c26;         /* inputs, áreas de código */
  --bg4: #1e2330;         /* hover, destaque leve */
  --border: #252c3d;      /* bordas padrão */
  --border2: #2e3750;     /* bordas em foco/hover */
  --accent: #3d8ef0;      /* azul primário */
  --accent2: #5aa3ff;     /* azul hover */
  --green: #27c483;       /* Aprovado */
  --yellow: #f5a623;      /* Pendente / Retorno */
  --red: #e8455a;         /* Reprovado */
  --purple: #9b72f5;      /* Em Produção */
  --text: #e2e8f7;        /* texto principal */
  --text2: #8a95b0;       /* texto secundário */
  --text3: #5a6480;       /* texto terciário / labels */
}
```

---

## Schema de dados (frontend)

```js
// Protocolo
{
  id:          string,   // ex: '25.05.28.32.14' — gerado por gerarId()
  sistema:     string,   // chave do objeto SISTEMAS (ex: 'webcartoes')
  data:        string,   // 'DD/MM/YYYY'
  responsavel: string,   // nome do responsável
  statusHom:   'Pendente'|'Aprovado'|'Reprovado',
  statusProd:  'Pendente'|'EmProducao'|'Aprovado'|'Reprovado',
  retornos:    number,   // contador de retornos ao desenvolvedor
  anotacao:    string,   // texto livre — colado do sistema externo
  obs:         string,   // observações internas
}
```

### Regras de negócio (frontend)

```js
// Fluxo de fase (getFase)
statusProd === 'Aprovado'                              → fase = 'done'
statusHom  === 'Aprovado' && statusProd em 'Pendente'/'EmProducao' → fase = 'prod'
statusHom  === 'Reprovado' || statusProd === 'Reprovado'           → fase = 'rep'
default                                               → fase = 'hom'

// Copiar para produção
copiarParaProd() só executa se statusHom === 'Aprovado' && statusProd === 'Pendente'
→ define statusProd = 'EmProducao'

// Auto-incremento de retornos
saveModalChanges(): se newHom === 'Reprovado' && p.statusHom !== 'Reprovado' → retornos++
saveModalChanges(): se newProd === 'Reprovado' && p.statusProd !== 'Reprovado' → retornos++

// Bloqueio de produção
select de PROD desabilitado se statusHom !== 'Aprovado'
```

---

## Gerador de ID

```js
function gerarId(seq) {
  // Formato: AA.MM.DD.SEQ.RND
  // Exemplo: 25.05.28.32.14
  const d = new Date();
  return `${yy}.${mm}.${dd}.${seq padded 2}.${random 10-99}`;
}
```

---

## Funções principais

| Função | Responsabilidade |
|---|---|
| `showView(name)` | Alterna entre views, ativa nav item correto |
| `getFase(p)` | Calcula fase atual do protocolo: hom/prod/done/rep |
| `filterProtocols()` | Filtra `PROTOCOLS[]` → `filtered[]`, re-renderiza tabela |
| `setFaseFilter(fase)` | Atalho para filtrar por fase via sidebar |
| `renderTable()` | Gera HTML do tbody, registra listeners de click delegado |
| `buildStatusCell(p, fase)` | Retorna HTML do dot+label de status para a fase atual |
| `openModal(id)` | Preenche e exibe o modal de detalhes |
| `adjustRetornos(id, delta)` | Incrementa/decrementa contador manual de retornos |
| `saveModalChanges()` | Persiste alterações do modal, auto-incrementa retornos se Reprovado |
| `copiarParaProd(id)` | Move protocolo de HOM-aprovado para EmProducao |
| `exportWordById(id, tipo)` | Gera e faz download do relatório .doc |
| `exportCSV()` | Exporta `filtered[]` em CSV com filtros aplicados |

---

## Click nas linhas da tabela

O click das linhas usa **delegação de evento** com `dataset.id` — não `onclick` inline no `<tr>`. Isso evita conflito com os botões filhos:

```js
tbody.querySelectorAll('.proto-row').forEach(row => {
  row.addEventListener('click', function(e) {
    if (e.target.closest('button')) return; // ignora cliques em botões
    openModal(this.dataset.id);
  });
});
```

---

## Adicionando um novo sistema

1. Adicione em `SISTEMAS`:
```js
novosite: {
  nome: 'NovoSite',
  url:  'novosite.bigcard.com.br',
  hom:  'homnovosite.bigcard.com.br'   // null se não tiver hom
}
```

2. Adicione `<option>` nos selects: `f-sistema`, `np-sistema`, `rel-protocolo`.
3. Adicione item no `<nav.sidebar>` na seção Sistemas.
4. Se não tiver homologação: `hom: null` — o sistema já trata automaticamente.

---

## Integração com backend (roadmap)

| Funcionalidade atual | Substituto no backend |
|---|---|
| Array `PROTOCOLS[]` em memória | Tabela `CV_PROTOCOLOS` via API REST |
| `gerarId()` no frontend | `id_protocolo` gerado no servidor antes do INSERT |
| Auto-retornos no `saveModalChanges` | Trigger `TR_CV_PROT_RETORNO_AUTO` no SQL Server |
| Login mockado com `USERS{}` | Autenticação SSO via Active Directory |
| Export `.doc` via Blob | Endpoint `GET /api/protocolos/:id/relatorio?tipo=completo` |

Stack sugerida para backend: **FastAPI (Python)** + **pyodbc** + **SQL Server** — consistente com o ambiente BigCard existente (painel_protocolos, TEF monitor, etc.).

---

*Mantenedor: Equipe de TI · BigCard · Governador Valadares/MG*
