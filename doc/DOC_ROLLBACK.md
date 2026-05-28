# 🔄 Central de Validações — Documentação de Rollback / Recriação

**Uso:** Este documento permite recriar o sistema do zero em qualquer IA generativa (ChatGPT, Gemini, Copilot, etc.) caso o código original seja perdido.

---

## Prompt de Recriação — Versão Completa

Copie e cole o prompt abaixo integralmente na IA desejada:

---

> **Prompt:**
>
> Crie um sistema web de página única (SPA) chamado **"Central de Validações"** para controle de protocolos de ajustes em ambientes de homologação e produção, usando **HTML + CSS + JavaScript puro** (sem frameworks, sem backend).
>
> ### Visual
> - Tema escuro corporativo. Fundo `#0d0f14`. Sidebar lateral escura. Header fixo.
> - Fontes: IBM Plex Sans + IBM Plex Mono (via Google Fonts).
> - Cores: azul `#3d8ef0` (accent), verde `#27c483` (validado), amarelo `#f5a623` (pendente), vermelho `#e8455a` (não validado), roxo `#9b72f5` (aguardando).
> - Cards com borda colorida no topo por categoria. Badges coloridas para status. Tabela com hover escuro.
>
> ### Estrutura de Views (navegação por JS, sem reload)
> 1. **Dashboard** — 5 cards KPI (total, pendentes, validados, aguardando prod., não validados) + donut chart SVG + bar chart por sistema + lista de atividade recente.
> 2. **Protocolos** — tabela com colunas: Protocolo, Sistema, Ambiente, Data, Status Hom., Status Prod., Responsável, Ações. Filtros por sistema/ambiente/status. Busca global. Paginação (10/página). Exportação CSV.
> 3. **Novo Protocolo** — formulário para criar protocolo (sistema, responsável, descrição, ajustes, data, observações). WebRepresentantes desabilita campo de homologação automaticamente.
> 4. **Exportar Relatório** — seleciona protocolo + tipo (hom/prod/completo) + exporta .doc (HTML MSWord).
>
> ### Modal de Detalhe
> Ao clicar em protocolo: modal com todas as informações + linha do tempo (Ajuste Criado → Homologação → Publicação → Validação Final) com dots coloridos por status.
>
> ### Sistemas Cadastrados
> ```
> webempresas: prod=webempresas.bigcard.com.br, hom=homempresas.bigcard.com.br
> webcartoes: prod=webcartoes.bigcard.com.br, hom=homwebcartoes.bigcard.com.br (Novo App WebView)
> bigcash: prod=web.bigcash.com.br, hom=homweb.bigcash.com.br
> webusuarios: prod=webusuarios.bigcard.com.br, hom=homusuarios.bigcard.com.br
> webredes: prod=webredes.bigcard.com.br, hom=homredes.bigcard.com.br
> webrepresentantes: prod=webrepresentantes.bigcard.com.br, hom=null (SEM homologação)
> websuporte: prod=websuporte.bigcard.com.br, hom=homsuporte.bigcard.com.br
> ```
>
> ### Schema de cada Protocolo
> ```js
> { id, sistema, ambiente, data, responsavel,
>   statusHom, statusProd, desc, ajustes,
>   obsHom, obsProd, obs }
> ```
> Status Hom: `Validado | Não validado | —`
> Status Prod: `Validado | Não validado | Aguardando validação | Pendente`
> Ambiente: `HOM | PROD | AMBOS`
>
> ### Dados Mockados
> Crie ao menos 20 protocolos fictícios espalhados pelos sistemas acima, com datas variadas de abril a maio de 2025, cobindo todos os status possíveis.
>
> ### Exportação Word
> Ao exportar, gere um arquivo `.doc` (HTML com namespace MSWord) com o layout:
> DATA: | PROTOCOLO: | SISTEMA: | AMBIENTE: ☐HOM ☐PROD | AJUSTES REALIZADOS: | RESULTADO: ☐VALIDADO ☐VALIDADO COM RESSALVAS ☐NÃO VALIDADO | OBSERVAÇÕES: | e bloco separado para VALIDAÇÃO EM PRODUÇÃO.
>
> ### Sidebar
> Menu: Dashboard, Protocolos (com badge de pendentes), Novo Protocolo, Homologação (filtro rápido), Produção (filtro rápido), sistemas individuais (filtro rápido), Exportar Relatório.
>
> ### Toast Notifications
> Notificações animadas no canto inferior direito para confirmações de ações.

---

## Especificações Técnicas para Recriação Fiel

Caso a IA precise de mais contexto para manter a fidelidade visual, forneça também:

### Paleta de cores exata
```
--bg:        #0d0f14
--bg2:       #12151c
--bg3:       #181c26
--bg4:       #1e2330
--border:    #252c3d
--border2:   #2e3750
--accent:    #3d8ef0
--accent2:   #5aa3ff
--green:     #27c483
--yellow:    #f5a623
--red:       #e8455a
--purple:    #9b72f5
--text:      #e2e8f7
--text2:     #8a95b0
--text3:     #5a6480
```

### Dimensões de layout
```
--sidebar-w:  240px
--header-h:   56px
--radius:     8px
--radius2:    12px
```

### Comportamentos obrigatórios
1. Clicar em card KPI → navega para lista com filtro aplicado
2. Clicar em item da sidebar de sistemas → filtra por sistema
3. Formulário de novo protocolo → sistema WebRepresentantes desabilita campo hom.
4. Modal fecha ao clicar fora ou no botão ✕
5. Busca global funciona em tempo real (oninput)
6. Paginação recalcula a cada filtro aplicado

---

## Checklist de Verificação Pós-Recriação

Após recriar, verifique:

- [ ] Dashboard exibe 5 cards KPI com números corretos
- [ ] Donut chart SVG renderiza visualmente (não precisa ser dinâmico)
- [ ] Tabela exibe todos os protocolos mockados
- [ ] Filtros reduzem a tabela corretamente
- [ ] Busca global funciona
- [ ] Clique na linha abre o modal com dados corretos
- [ ] Timeline do modal tem 4 etapas com cores corretas
- [ ] Botão ↓ na tabela inicia download do .doc
- [ ] Formulário de novo protocolo cria item e vai para a lista
- [ ] WebRepresentantes desabilita campo de homologação
- [ ] Exportação CSV funciona com filtros aplicados
- [ ] Notificações toast aparecem após ações
- [ ] Sidebar marca o item ativo corretamente

---

## Informações Complementares

**Nome do sistema:** Central de Validações
**Empresa:** BigCard Tecnologia e Serviços
**Localização:** Governador Valadares, MG, Brasil
**Contexto:** Sistema interno de TI para rastreamento de deployments
**Versão original:** 2.4.1
**Tecnologias originais:** HTML5, CSS3 (variáveis), JavaScript ES6+ vanilla
**Geração Word real:** Node.js + biblioteca `docx` (npm) — veja `gerar_relatorio.js`

---

*Este documento deve ser mantido atualizado a cada versão significativa do sistema.*
