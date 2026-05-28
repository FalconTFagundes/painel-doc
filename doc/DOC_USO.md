# 📘 Central de Validações — Documentação de Uso

**BigCard Tecnologia e Serviços**
Versão 2.4.1 · TI / Governador Valadares - MG

---

## O que é a Central de Validações?

A **Central de Validações** é um sistema interno de controle de ajustes e publicações realizados nos sistemas da BigCard. Seu objetivo é garantir rastreabilidade completa de cada alteração, desde o desenvolvimento até a validação final em produção.

---

## Como acessar

Abra o arquivo `index.html` diretamente no navegador (Chrome, Edge ou Firefox). Não é necessário servidor ou instalação.

---

## Telas do sistema

### Dashboard

A tela inicial apresenta um resumo geral:

- **Cards KPI** — Total de protocolos, pendentes, validados, aguardando produção e não validados. Clique em qualquer card para ir à lista filtrada.
- **Gráfico de status** — Proporção visual dos resultados em produção.
- **Protocolos por sistema** — Barras comparativas de volume por sistema.
- **Atividade recente** — Últimas movimentações registradas.

### Protocolos

Lista completa de todos os protocolos cadastrados.

**Filtros disponíveis:**
- Por sistema (WebEmpresas, WebCartões, BigCash, etc.)
- Por ambiente (Homologação / Produção / Ambos)
- Por status de homologação
- Por status de produção
- Busca global (número, sistema, responsável, descrição)

**Ações na tabela:**
- Clique em qualquer linha para abrir os detalhes completos do protocolo.
- Botão **Ver** abre o modal de detalhe.
- Botão **↓** exporta o relatório Word daquele protocolo diretamente.
- Botão **CSV** exporta a listagem atual (com filtros aplicados) em formato CSV.

**Paginação:** 10 registros por página. Navegue pelos botões numerados na base da tabela.

### Detalhes do Protocolo (Modal)

Ao clicar em um protocolo, abre-se um painel detalhado com:

- Informações completas (sistema, responsável, ambiente, data)
- Descrição e ajustes realizados
- Resultado de homologação e produção
- Observações
- **Linha do Tempo** — visualização sequencial das etapas: Ajuste Criado → Homologação → Publicação → Validação Final

Cada etapa da timeline tem cor indicativa:
- 🟢 Verde — etapa concluída com sucesso
- 🟡 Amarelo — etapa pendente ou em andamento
- 🔴 Vermelho — etapa com falha ou reprovação
- ⚫ Cinza — etapa ainda não iniciada

### Novo Protocolo

Formulário para registrar um novo ajuste:

1. Selecione o **sistema** afetado.
2. Informe o **responsável** pelo ajuste.
3. Preencha a **descrição** e os **ajustes realizados**.
4. O sistema preenche automaticamente a URL de homologação.
   - Atenção: **WebRepresentantes não possui ambiente de homologação** — o campo é desabilitado automaticamente.
5. Informe a data e observações.
6. Clique em **Criar Protocolo**.

O novo protocolo aparece no topo da listagem com status `Pendente`.

### Exportar Relatório

1. Acesse **Relatórios > Exportar Relatório** pelo menu lateral.
2. Selecione o protocolo desejado.
3. Escolha o tipo:
   - **Homologação** — documenta apenas a fase de homologação
   - **Produção** — documenta apenas a validação em produção
   - **Completo** — inclui ambas as fases
4. Clique em **Exportar .docx**.

O arquivo gerado segue o padrão BigCard com campos de resultado e assinaturas.

---

## Significado dos Status

### Homologação
| Status | Significado |
|--------|-------------|
| Validado | Ajuste aprovado em homologação |
| Não validado | Ajuste reprovado, requer correção |
| N/A | Sistema sem ambiente de homologação |

### Produção
| Status | Significado |
|--------|-------------|
| Pendente | Aguardando publicação ou homologação |
| Aguardando validação | Publicado, aguardando verificação |
| Validado | Confirmado funcionando em produção |
| Não validado | Problema identificado em produção |

---

## Sistemas cadastrados

| Sistema | URL Produção | URL Homologação |
|---------|-------------|-----------------|
| WebEmpresas | webempresas.bigcard.com.br | homempresas.bigcard.com.br |
| WebCartões (WebView) | webcartoes.bigcard.com.br | homwebcartoes.bigcard.com.br |
| BigCash | web.bigcash.com.br | homweb.bigcash.com.br |
| WebUsuários | webusuarios.bigcard.com.br | homusuarios.bigcard.com.br |
| WebRedes | webredes.bigcard.com.br | homredes.bigcard.com.br |
| WebRepresentantes | webrepresentantes.bigcard.com.br | *(sem homologação)* |
| WebSuporte | websuporte.bigcard.com.br | homsuporte.bigcard.com.br |

---

## Barra de pesquisa global

O campo de busca no topo funciona como filtro global: pesquisa simultânea em número de protocolo, nome do sistema, responsável e descrição do ajuste. A pesquisa é aplicada em tempo real conforme você digita.

---

*Dúvidas: equipe de TI BigCard — ramal 200*
