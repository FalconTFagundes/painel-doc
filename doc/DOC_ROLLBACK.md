# 🔄 Central de Validações — Documentação de Rollback / Recriação

**Uso:** Permite recriar o sistema do zero em qualquer IA generativa (ChatGPT, Gemini, Copilot, etc.) caso o código original seja perdido.

---

## Prompt de recriação completo

Copie e cole integralmente na IA desejada:

---

> Crie um sistema web de página única (SPA) chamado **"Central de Validações"** para controle de protocolos de ajuste em ambientes de homologação e produção, usando **HTML + CSS + JavaScript puro** (sem frameworks, sem backend).
>
> ### Visual
> Tema escuro corporativo. Fundo `#0d0f14`. Sidebar lateral escura. Header fixo.
> Fontes: IBM Plex Sans + IBM Plex Mono (Google Fonts).
> Cores: azul `#3d8ef0` (accent), verde `#27c483` (aprovado), amarelo `#f5a623` (pendente/retorno), vermelho `#e8455a` (reprovado), roxo `#9b72f5` (em produção).
>
> ### Estrutura crítica de posicionamento
> O `#app` tem `display:none` até o login. O `<div class="modal-overlay">` e `<div class="toast-container">` DEVEM ficar fora do `#app`, diretamente no `<body>`, caso contrário o modal não abrirá.
>
> ### Views (navegação JS sem reload)
> 1. **Dashboard** — 5 KPIs (Total, Em Homologação, Em Produção, Aprovados, Reprovados) + donut SVG + barras por sistema + feed recente
> 2. **Protocolos** — tabela com colunas: Protocolo, Sistema (só URL), Data, Responsável, Retornos, Fase·Status, Ações. Filtros por sistema e fase. Busca global. Paginação 10/página.
> 3. **Novo Registro** — campos: Sistema (select), Responsável (texto), Anotação (textarea grande para colar texto do sistema externo), Obs. internas, Data
> 4. **Exportar Relatório** — select de protocolo + tipo (hom/prod/completo) + botão exportar .doc
>
> ### Modal de detalhes (fora do #app!)
> Ao clicar em uma linha da tabela: modal com editor de retornos (− valor +), editor de status HOM→PROD (selects com seta entre eles), textarea editável da anotação, linha do tempo, botão Salvar e botão Exportar .docx. Click delegado nas linhas — nunca `onclick` inline no `<tr>`.
>
> ### Schema de cada protocolo
> ```js
> { id, sistema, data, responsavel,
>   statusHom:  'Pendente'|'Aprovado'|'Reprovado',
>   statusProd: 'Pendente'|'EmProducao'|'Aprovado'|'Reprovado',
>   retornos: number,
>   anotacao: string,  // texto livre — não desestruturar em campos
>   obs: string }
> ```
>
> ### Função getFase(p) — obrigatória
> ```js
> function getFase(p) {
>   if (p.statusProd === 'Aprovado') return 'done';
>   if (p.statusHom === 'Aprovado' && (p.statusProd === 'Pendente' || p.statusProd === 'EmProducao')) return 'prod';
>   if (p.statusHom === 'Reprovado' || p.statusProd === 'Reprovado') return 'rep';
>   return 'hom';
> }
> ```
>
> ### Regras de negócio
> - Select de PROD bloqueado enquanto HOM !== 'Aprovado'
> - Botão "↑ Copiar para Prod." aparece só quando statusHom==='Aprovado' && statusProd==='Pendente' — define statusProd='EmProducao'
> - Ao salvar: se novo status for 'Reprovado' e o anterior não era → retornos++ automático
> - Coluna Fase·Status: mostrar APENAS o status da fase atual (sem rótulo de fase), dot colorido + texto. Dot vermelho tem box-shadow
> - ID no formato AA.MM.DD.SEQ.RND (ex: 25.05.28.32.14)
>
> ### Sistemas cadastrados
> ```
> webempresas:       prod=webempresas.bigcard.com.br,       hom=homempresas.bigcard.com.br
> webcartoes:        prod=webcartoes.bigcard.com.br,        hom=homwebcartoes.bigcard.com.br  (WebView)
> bigcash:           prod=web.bigcash.com.br,               hom=homweb.bigcash.com.br
> webusuarios:       prod=webusuarios.bigcard.com.br,       hom=homusuarios.bigcard.com.br
> webredes:          prod=webredes.bigcard.com.br,          hom=homredes.bigcard.com.br
> webrepresentantes: prod=webrepresentantes.bigcard.com.br, hom=null  (sem homologação)
> websuporte:        prod=websuporte.bigcard.com.br,        hom=homsuporte.bigcard.com.br
> ```
>
> ### Login
> Tela de login com usuários mockados (senha `bigcard`): rafael, patrick, carla, marcos, renan, ana. Exibir só o primeiro nome no header (sem setor).
>
> ### Dados mockados
> Criar ~16 protocolos fictícios cobrindo todos os sistemas, todos os status e todas as fases. Incluir ao menos 2 com retornos > 0 e 2 com status Reprovado.
>
> ### Toast notifications
> Animação slide da direita, canto inferior direito. Desaparecem após 3s.
>
> ### Exportação
> `.doc` via Blob MSWord com anotação em `<pre>` (texto preservado) + blocos HOM/PROD com checkboxes ☑/☐.

---

## Checklist de verificação pós-recriação

- [ ] Modal abre ao clicar em qualquer linha da tabela
- [ ] Modal e toast estão fora do `#app` no HTML
- [ ] Botões da linha não disparam abertura do modal
- [ ] Contador − / + de retornos funciona e atualiza visualmente
- [ ] Select de PROD bloqueado enquanto HOM não estiver Aprovado
- [ ] "Copiar para Prod." aparece só quando aplicável e desaparece depois
- [ ] Marcar Reprovado → retornos incrementa automaticamente com toast
- [ ] getFase() calcula fase corretamente para os 4 cenários
- [ ] Coluna Fase·Status não exibe chip de fase — só dot + label
- [ ] Filtro por fase na sidebar e nos dropdowns funciona
- [ ] Busca global funciona em tempo real
- [ ] Paginação funciona e recalcula após filtros
- [ ] Login exibe nome sem setor no header
- [ ] Logout funciona (clique no nome/avatar)
- [ ] Novo Registro cria protocolo e vai para a lista
- [ ] Anotação é textarea livre sem campos estruturados no formulário
- [ ] Exportação .doc baixa arquivo e abre no Word
- [ ] Exportação CSV baixa com filtros aplicados

---

## Informações do projeto

| Atributo | Valor |
|---|---|
| Nome | Central de Validações |
| Empresa | BigCard Tecnologia e Serviços |
| Localização | Governador Valadares, MG, Brasil |
| Contexto | Sistema interno de TI — controle de deployments |
| Tecnologia | HTML5 + CSS3 + JavaScript ES6+ vanilla |
| Banco (futuro) | SQL Server — ver `DOC_BANCO_DE_DADOS.md` |
| Geração Word real | Node.js + `docx` (npm) — `gerar_relatorio.js` |

---

*Manter atualizado a cada versão significativa.*
