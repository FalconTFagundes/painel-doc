# 📘 Central de Validações — Documentação de Uso

**BigCard · TI · Governador Valadares/MG**

---

## O que é o sistema

A **Central de Validações** é o sistema interno de controle de ajustes realizados nos sistemas BigCard. Cada ajuste passa por um ciclo controlado: registro → homologação → publicação → validação em produção.

---

## Acesso

Abra o arquivo `central-validacoes.html` diretamente no navegador (Chrome, Edge ou Firefox). Nenhuma instalação é necessária.

**Usuários de demonstração** — senha `bigcard` para todos:

| Usuário | Nome |
|---|---|
| renan | Renan |
| patrick | Patrick |
| carla | Carla |
| marcos | Marcos |
| ana | Ana |
| rafael | Rafael |

---

## Telas

### Dashboard

Visão geral com cinco cards clicáveis:

- **Total** — todos os protocolos registrados
- **Em Homologação** — ainda em ciclo de teste em hom.
- **Em Produção** — hom. aprovada, aguardando validação em prod.
- **Aprovados** — ciclo encerrado com sucesso
- **Reprovados** — hom. ou prod. reprovadas, requer ação

Abaixo dos cards: gráfico de status, barras por sistema e feed de atividade recente.

### Protocolos

Lista completa com filtros por sistema e fase. Colunas exibidas:

| Coluna | Descrição |
|---|---|
| Protocolo | ID no formato `AA.MM.DD.SEQ.RND` |
| Sistema | URL do sistema |
| Data | Data do registro |
| Responsável | Nome de quem registrou |
| Retornos | Quantas vezes voltou ao desenvolvedor |
| Fase · Status | Status atual da fase em que o protocolo se encontra |
| Ações | Botões de ação contextual |

**Botão "↑ Copiar para Prod."** aparece automaticamente na coluna Ações quando a homologação está Aprovada e o protocolo ainda não foi enviado para produção. Um clique move o protocolo para a fase de produção.

**Clique em qualquer linha** abre o modal de detalhes.

### Modal de detalhes

O modal contém três áreas:

**1. Editor de retornos**
Botões `−` e `+` para ajustar manualmente a quantidade de retornos ao desenvolvedor. O contador também é incrementado automaticamente ao marcar Reprovado.

**2. Editor de status (HOM → PROD)**
Dois selects com seta de fluxo entre eles. O select de Produção permanece bloqueado enquanto Homologação não estiver Aprovada. Opções disponíveis: `Pendente`, `Aprovado`, `Reprovado`.

**3. Anotação**
Texto livre editável — o mesmo que foi colado ao criar o protocolo. Editável diretamente no modal.

Clique em **Salvar alterações** para confirmar. Clique fora do modal ou no `✕` para fechar sem salvar.

**Comportamento automático ao marcar Reprovado:**
Sempre que `status_hom` ou `status_prod` mudar de outro valor para `Reprovado`, o contador de retornos é incrementado em +1 automaticamente.

### Novo Registro

Formulário com três campos:

- **Sistema** — dropdown com todos os sistemas cadastrados
- **Responsável** — nome de quem está registrando
- **Anotação** — área de texto para colar o conteúdo completo do sistema de testes (sem reinterpretação de campos)
- **Obs. internas** — opcional, para notas internas

O protocolo criado começa sempre com `status_hom = Pendente` e `status_prod = Pendente`.

### Exportar Relatório

Selecione um protocolo e o tipo (Homologação, Produção ou Completo) e clique em **Exportar .docx**. O arquivo gerado abre diretamente no Word com o layout padrão BigCard.

---

## Fluxo de status

```
           ┌──────────────────────────────────────────────┐
           │                                              │
  Registro │   HOM: Pendente → Aprovado → (Prod. libera) │
  criado   │                ↘ Reprovado (+1 retorno)      │
           │                                              │
           │   PROD: Pendente → EmProducao → Aprovado    │
           │                  ↘ Reprovado (+1 retorno)   │
           └──────────────────────────────────────────────┘
```

Regras obrigatórias:

- Produção **nunca** avança enquanto Homologação não estiver `Aprovado`.
- Ao marcar `Reprovado` em qualquer fase, o contador de retornos sobe automaticamente.
- "Copiar para Prod." só aparece quando `statusHom = Aprovado` e `statusProd = Pendente`.

---

## Sistemas cadastrados

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

## Exportação CSV

Na tela de Protocolos, o botão **↓ CSV** exporta a listagem atual (com filtros aplicados) em formato separado por ponto-e-vírgula, compatível com Excel.

---

*Dúvidas: equipe de TI BigCard — ramal 200*
