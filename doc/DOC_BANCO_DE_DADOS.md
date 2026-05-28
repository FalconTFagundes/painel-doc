# 🗄️ Central de Validações — Estrutura do Banco de Dados

**BigCard · TI · SQL Server**
Banco: `BIGCARD_VALIDACOES`

---

## Visão geral das tabelas

```
CV_SISTEMAS          → cadastro dos sistemas monitorados
CV_USUARIOS          → usuários com acesso ao sistema
CV_PROTOCOLOS        → registro principal de cada ajuste
CV_RETORNOS          → histórico de cada retorno ao desenvolvedor
CV_STATUS_HISTORICO  → auditoria completa de mudanças de status
```

Relacionamentos:

```
CV_SISTEMAS (1) ──< CV_PROTOCOLOS (N)
CV_USUARIOS (1) ──< CV_PROTOCOLOS (N)  [responsavel]
CV_PROTOCOLOS (1) ──< CV_RETORNOS (N)
CV_PROTOCOLOS (1) ──< CV_STATUS_HISTORICO (N)
```

---

## Scripts de criação

```sql
USE BIGCARD_VALIDACOES;
GO

-- ═══════════════════════════════════════════════════════════
-- 1. CV_SISTEMAS
--    Cadastro dos sistemas internos BigCard monitorados.
--    ativo: 1 = ativo | 0 = desativado
--    possui_homologacao: 1 = sim | 0 = não (ex: WebRepresentantes)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE CV_SISTEMAS (
    id_sistema        INT IDENTITY(1,1)   NOT NULL,
    chave             VARCHAR(50)         NOT NULL,  -- ex: 'webempresas'
    nome              VARCHAR(100)        NOT NULL,  -- ex: 'WebEmpresas'
    url_producao      VARCHAR(200)        NOT NULL,  -- ex: 'webempresas.bigcard.com.br'
    url_homologacao   VARCHAR(200)            NULL,  -- NULL quando não possui hom.
    possui_homologacao BIT               NOT NULL  DEFAULT 1,
    ativo             BIT                NOT NULL  DEFAULT 1,
    criado_em         DATETIME           NOT NULL  DEFAULT GETDATE(),
    atualizado_em     DATETIME               NULL,

    CONSTRAINT PK_CV_SISTEMAS PRIMARY KEY (id_sistema),
    CONSTRAINT UQ_CV_SISTEMAS_CHAVE UNIQUE (chave),
    CONSTRAINT UQ_CV_SISTEMAS_URL_PROD UNIQUE (url_producao)
);
GO

-- Dados iniciais
INSERT INTO CV_SISTEMAS (chave, nome, url_producao, url_homologacao, possui_homologacao, ativo) VALUES
('webempresas',       'WebEmpresas',            'webempresas.bigcard.com.br',      'homempresas.bigcard.com.br',     1, 1),
('webcartoes',        'WebCartões (WebView)',    'webcartoes.bigcard.com.br',       'homwebcartoes.bigcard.com.br',   1, 1),
('bigcash',           'BigCash',                'web.bigcash.com.br',              'homweb.bigcash.com.br',          1, 1),
('webusuarios',       'WebUsuários',            'webusuarios.bigcard.com.br',      'homusuarios.bigcard.com.br',     1, 1),
('webredes',          'WebRedes',               'webredes.bigcard.com.br',         'homredes.bigcard.com.br',        1, 1),
('webrepresentantes', 'WebRepresentantes',      'webrepresentantes.bigcard.com.br', NULL,                           0, 1),
('websuporte',        'WebSuporte',             'websuporte.bigcard.com.br',       'homsuporte.bigcard.com.br',      1, 1);
GO


-- ═══════════════════════════════════════════════════════════
-- 2. CV_USUARIOS
--    Usuários com acesso à Central de Validações.
--    ativo: 1 = ativo | 0 = desativado (sem excluir o registro)
--    perfil: 'admin' | 'validador' | 'visualizador'
-- ═══════════════════════════════════════════════════════════
CREATE TABLE CV_USUARIOS (
    id_usuario        INT IDENTITY(1,1)   NOT NULL,
    login             VARCHAR(50)         NOT NULL,
    nome              VARCHAR(100)        NOT NULL,
    senha_hash        VARCHAR(255)        NOT NULL,  -- bcrypt / hash — nunca plain text
    perfil            VARCHAR(20)         NOT NULL  DEFAULT 'validador',
    ativo             BIT                NOT NULL  DEFAULT 1,
    ultimo_acesso     DATETIME               NULL,
    criado_em         DATETIME           NOT NULL  DEFAULT GETDATE(),
    atualizado_em     DATETIME               NULL,

    CONSTRAINT PK_CV_USUARIOS PRIMARY KEY (id_usuario),
    CONSTRAINT UQ_CV_USUARIOS_LOGIN UNIQUE (login),
    CONSTRAINT CK_CV_USUARIOS_PERFIL CHECK (perfil IN ('admin', 'validador', 'visualizador'))
);
GO

-- Dados iniciais (senhas: hash ilustrativo — substituir por bcrypt real)
INSERT INTO CV_USUARIOS (login, nome, senha_hash, perfil, ativo) VALUES
('renan',   'Renan',   '$2b$12$HASH_RENAN',   'admin',      1),
('patrick', 'Patrick', '$2b$12$HASH_PATRICK', 'validador',  1),
('carla',   'Carla',   '$2b$12$HASH_CARLA',   'validador',  1),
('marcos',  'Marcos',  '$2b$12$HASH_MARCOS',  'validador',  1),
('ana',     'Ana',     '$2b$12$HASH_ANA',     'validador',  1),
('rafael',  'Rafael',  '$2b$12$HASH_RAFAEL',  'visualizador', 1);
GO


-- ═══════════════════════════════════════════════════════════
-- 3. CV_PROTOCOLOS
--    Registro principal de cada ajuste submetido a validação.
--
--    id_protocolo: formato visual AA.MM.DD.SEQ.RND (ex: 25.05.28.32.14)
--                  gerado pela aplicação, não pelo banco
--
--    status_hom:  'Pendente' | 'Aprovado' | 'Reprovado'
--    status_prod: 'Pendente' | 'EmProducao' | 'Aprovado' | 'Reprovado'
--
--    REGRA DE NEGÓCIO:
--      status_prod só pode sair de 'Pendente' se status_hom = 'Aprovado'
--      (garantida via CHECK e na aplicação)
--
--    ativo: 1 = ativo | 0 = arquivado/cancelado
-- ═══════════════════════════════════════════════════════════
CREATE TABLE CV_PROTOCOLOS (
    id_protocolo      VARCHAR(20)         NOT NULL,  -- PK no formato AA.MM.DD.SEQ.RND
    id_sistema        INT                 NOT NULL,
    id_responsavel    INT                 NOT NULL,
    data_registro     DATE               NOT NULL  DEFAULT CAST(GETDATE() AS DATE),
    anotacao          NVARCHAR(MAX)       NOT NULL,  -- texto livre colado do sistema externo
    obs               NVARCHAR(500)           NULL,

    -- Status de homologação
    status_hom        VARCHAR(20)         NOT NULL  DEFAULT 'Pendente',
    data_hom          DATETIME               NULL,  -- quando foi aprovado/reprovado em hom
    obs_hom           NVARCHAR(500)           NULL,

    -- Status de produção
    status_prod       VARCHAR(20)         NOT NULL  DEFAULT 'Pendente',
    data_prod         DATETIME               NULL,  -- quando foi aprovado/reprovado em prod
    obs_prod          NVARCHAR(500)           NULL,

    -- Retornos ao desenvolvedor (contador; histórico detalhado em CV_RETORNOS)
    qtd_retornos      INT                NOT NULL  DEFAULT 0,

    ativo             BIT                NOT NULL  DEFAULT 1,
    criado_em         DATETIME           NOT NULL  DEFAULT GETDATE(),
    atualizado_em     DATETIME               NULL,
    atualizado_por    INT                    NULL,  -- FK CV_USUARIOS

    CONSTRAINT PK_CV_PROTOCOLOS PRIMARY KEY (id_protocolo),
    CONSTRAINT FK_CV_PROT_SISTEMA  FOREIGN KEY (id_sistema)     REFERENCES CV_SISTEMAS(id_sistema),
    CONSTRAINT FK_CV_PROT_RESP     FOREIGN KEY (id_responsavel) REFERENCES CV_USUARIOS(id_usuario),
    CONSTRAINT FK_CV_PROT_ATUALPOR FOREIGN KEY (atualizado_por) REFERENCES CV_USUARIOS(id_usuario),

    CONSTRAINT CK_CV_PROT_STATUS_HOM  CHECK (status_hom  IN ('Pendente','Aprovado','Reprovado')),
    CONSTRAINT CK_CV_PROT_STATUS_PROD CHECK (status_prod IN ('Pendente','EmProducao','Aprovado','Reprovado')),

    -- Regra: prod só avança se hom estiver aprovado
    CONSTRAINT CK_CV_PROT_FLUXO CHECK (
        status_prod = 'Pendente'
        OR status_hom = 'Aprovado'
    )
);
GO

-- Índices de consulta frequente
CREATE INDEX IX_CV_PROT_SISTEMA    ON CV_PROTOCOLOS (id_sistema);
CREATE INDEX IX_CV_PROT_STATUS_HOM ON CV_PROTOCOLOS (status_hom);
CREATE INDEX IX_CV_PROT_STATUS_PROD ON CV_PROTOCOLOS (status_prod);
CREATE INDEX IX_CV_PROT_DATA       ON CV_PROTOCOLOS (data_registro DESC);
CREATE INDEX IX_CV_PROT_ATIVO      ON CV_PROTOCOLOS (ativo);
GO


-- ═══════════════════════════════════════════════════════════
-- 4. CV_RETORNOS
--    Histórico de cada retorno ao desenvolvedor.
--    Cada linha = 1 retorno registrado, com motivo e quem registrou.
--    A contagem em CV_PROTOCOLOS.qtd_retornos é mantida por trigger.
-- ═══════════════════════════════════════════════════════════
CREATE TABLE CV_RETORNOS (
    id_retorno        INT IDENTITY(1,1)   NOT NULL,
    id_protocolo      VARCHAR(20)         NOT NULL,
    fase              VARCHAR(10)         NOT NULL,  -- 'hom' | 'prod'
    motivo            NVARCHAR(500)           NULL,  -- opcional — preenchido manualmente
    registrado_por    INT                 NOT NULL,
    registrado_em     DATETIME           NOT NULL  DEFAULT GETDATE(),

    CONSTRAINT PK_CV_RETORNOS PRIMARY KEY (id_retorno),
    CONSTRAINT FK_CV_RET_PROTO FOREIGN KEY (id_protocolo) REFERENCES CV_PROTOCOLOS(id_protocolo),
    CONSTRAINT FK_CV_RET_USER  FOREIGN KEY (registrado_por) REFERENCES CV_USUARIOS(id_usuario),
    CONSTRAINT CK_CV_RET_FASE  CHECK (fase IN ('hom','prod'))
);
GO

CREATE INDEX IX_CV_RET_PROTOCOLO ON CV_RETORNOS (id_protocolo);
GO


-- ═══════════════════════════════════════════════════════════
-- 5. CV_STATUS_HISTORICO
--    Auditoria completa de toda mudança de status.
--    Imutável — nunca se atualiza ou deleta.
--    campo: 'status_hom' | 'status_prod' | 'qtd_retornos'
-- ═══════════════════════════════════════════════════════════
CREATE TABLE CV_STATUS_HISTORICO (
    id_historico      INT IDENTITY(1,1)   NOT NULL,
    id_protocolo      VARCHAR(20)         NOT NULL,
    campo             VARCHAR(20)         NOT NULL,
    valor_anterior    VARCHAR(50)             NULL,
    valor_novo        VARCHAR(50)         NOT NULL,
    alterado_por      INT                 NOT NULL,
    alterado_em       DATETIME           NOT NULL  DEFAULT GETDATE(),

    CONSTRAINT PK_CV_STATUS_HIST PRIMARY KEY (id_historico),
    CONSTRAINT FK_CV_HIST_PROTO FOREIGN KEY (id_protocolo) REFERENCES CV_PROTOCOLOS(id_protocolo),
    CONSTRAINT FK_CV_HIST_USER  FOREIGN KEY (alterado_por)  REFERENCES CV_USUARIOS(id_usuario),
    CONSTRAINT CK_CV_HIST_CAMPO CHECK (campo IN ('status_hom','status_prod','qtd_retornos','ativo'))
);
GO

CREATE INDEX IX_CV_HIST_PROTOCOLO ON CV_STATUS_HISTORICO (id_protocolo);
CREATE INDEX IX_CV_HIST_DATA      ON CV_STATUS_HISTORICO (alterado_em DESC);
GO
```

---

## Trigger — auto-incremento de retornos por reprovação

```sql
-- ═══════════════════════════════════════════════════════════
-- TR_CV_PROT_RETORNO_AUTO
-- Dispara ao UPDATE de status_hom ou status_prod.
-- Se o novo valor for 'Reprovado' e o anterior não era,
-- incrementa qtd_retornos e insere em CV_RETORNOS.
-- ═══════════════════════════════════════════════════════════
CREATE OR ALTER TRIGGER TR_CV_PROT_RETORNO_AUTO
ON CV_PROTOCOLOS
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Retorno por reprovação em homologação
    IF UPDATE(status_hom)
    BEGIN
        INSERT INTO CV_RETORNOS (id_protocolo, fase, motivo, registrado_por)
        SELECT
            i.id_protocolo,
            'hom',
            'Reprovado automaticamente em homologação',
            ISNULL(i.atualizado_por, 1)
        FROM inserted i
        JOIN deleted d ON i.id_protocolo = d.id_protocolo
        WHERE i.status_hom = 'Reprovado'
          AND d.status_hom <> 'Reprovado';

        UPDATE p SET
            p.qtd_retornos = p.qtd_retornos + 1,
            p.atualizado_em = GETDATE()
        FROM CV_PROTOCOLOS p
        JOIN inserted i ON p.id_protocolo = i.id_protocolo
        JOIN deleted  d ON p.id_protocolo = d.id_protocolo
        WHERE i.status_hom = 'Reprovado'
          AND d.status_hom <> 'Reprovado';
    END

    -- Retorno por reprovação em produção
    IF UPDATE(status_prod)
    BEGIN
        INSERT INTO CV_RETORNOS (id_protocolo, fase, motivo, registrado_por)
        SELECT
            i.id_protocolo,
            'prod',
            'Reprovado automaticamente em produção',
            ISNULL(i.atualizado_por, 1)
        FROM inserted i
        JOIN deleted d ON i.id_protocolo = d.id_protocolo
        WHERE i.status_prod = 'Reprovado'
          AND d.status_prod <> 'Reprovado';

        UPDATE p SET
            p.qtd_retornos = p.qtd_retornos + 1,
            p.atualizado_em = GETDATE()
        FROM CV_PROTOCOLOS p
        JOIN inserted i ON p.id_protocolo = i.id_protocolo
        JOIN deleted  d ON p.id_protocolo = d.id_protocolo
        WHERE i.status_prod = 'Reprovado'
          AND d.status_prod <> 'Reprovado';
    END

    -- Auditoria — grava histórico de mudanças de status_hom
    IF UPDATE(status_hom)
    BEGIN
        INSERT INTO CV_STATUS_HISTORICO (id_protocolo, campo, valor_anterior, valor_novo, alterado_por)
        SELECT i.id_protocolo, 'status_hom', d.status_hom, i.status_hom, ISNULL(i.atualizado_por, 1)
        FROM inserted i JOIN deleted d ON i.id_protocolo = d.id_protocolo
        WHERE i.status_hom <> d.status_hom;
    END

    -- Auditoria — grava histórico de mudanças de status_prod
    IF UPDATE(status_prod)
    BEGIN
        INSERT INTO CV_STATUS_HISTORICO (id_protocolo, campo, valor_anterior, valor_novo, alterado_por)
        SELECT i.id_protocolo, 'status_prod', d.status_prod, i.status_prod, ISNULL(i.atualizado_por, 1)
        FROM inserted i JOIN deleted d ON i.id_protocolo = d.id_protocolo
        WHERE i.status_prod <> d.status_prod;
    END
END;
GO
```

---

## View auxiliar — listagem completa para a API

```sql
CREATE OR ALTER VIEW VW_CV_PROTOCOLOS_FULL AS
SELECT
    p.id_protocolo,
    s.chave                 AS sistema_chave,
    s.nome                  AS sistema_nome,
    s.url_producao,
    s.url_homologacao,
    s.possui_homologacao,
    u.login                 AS responsavel_login,
    u.nome                  AS responsavel_nome,
    p.data_registro,
    p.anotacao,
    p.obs,
    p.status_hom,
    p.data_hom,
    p.obs_hom,
    p.status_prod,
    p.data_prod,
    p.obs_prod,
    p.qtd_retornos,
    -- fase calculada (espelha getFase() do frontend)
    CASE
        WHEN p.status_prod = 'Aprovado'                                        THEN 'done'
        WHEN p.status_hom  = 'Aprovado' AND p.status_prod IN ('Pendente','EmProducao') THEN 'prod'
        WHEN p.status_hom  = 'Reprovado' OR p.status_prod = 'Reprovado'       THEN 'rep'
        ELSE 'hom'
    END                     AS fase,
    p.ativo,
    p.criado_em,
    p.atualizado_em
FROM CV_PROTOCOLOS p
JOIN CV_SISTEMAS   s ON p.id_sistema     = s.id_sistema
JOIN CV_USUARIOS   u ON p.id_responsavel = u.id_usuario
WHERE p.ativo = 1;
GO
```

---

## Dicionário de dados

### CV_SISTEMAS

| Coluna | Tipo | Nulo | Descrição |
|---|---|---|---|
| id_sistema | INT IDENTITY | NÃO | PK — gerado automaticamente |
| chave | VARCHAR(50) | NÃO | Identificador interno único (ex: `webempresas`) |
| nome | VARCHAR(100) | NÃO | Nome amigável exibido na UI |
| url_producao | VARCHAR(200) | NÃO | URL do ambiente de produção |
| url_homologacao | VARCHAR(200) | SIM | URL de hom — NULL se não possui |
| possui_homologacao | BIT | NÃO | **1** = possui hom · **0** = não possui (ex: WebRepresentantes) |
| ativo | BIT | NÃO | **1** = ativo · **0** = desativado |
| criado_em | DATETIME | NÃO | Data de cadastro |
| atualizado_em | DATETIME | SIM | Data da última edição |

### CV_USUARIOS

| Coluna | Tipo | Nulo | Descrição |
|---|---|---|---|
| id_usuario | INT IDENTITY | NÃO | PK |
| login | VARCHAR(50) | NÃO | Login único (sem domínio) |
| nome | VARCHAR(100) | NÃO | Nome exibido no sistema |
| senha_hash | VARCHAR(255) | NÃO | Hash bcrypt — nunca armazenar senha em texto plano |
| perfil | VARCHAR(20) | NÃO | `admin` · `validador` · `visualizador` |
| ativo | BIT | NÃO | **1** = ativo · **0** = desativado |
| ultimo_acesso | DATETIME | SIM | Atualizado a cada login bem-sucedido |
| criado_em | DATETIME | NÃO | Data de cadastro |
| atualizado_em | DATETIME | SIM | Data da última edição |

### CV_PROTOCOLOS

| Coluna | Tipo | Nulo | Descrição |
|---|---|---|---|
| id_protocolo | VARCHAR(20) | NÃO | PK — formato `AA.MM.DD.SEQ.RND` gerado pela app |
| id_sistema | INT | NÃO | FK → CV_SISTEMAS |
| id_responsavel | INT | NÃO | FK → CV_USUARIOS |
| data_registro | DATE | NÃO | Data do registro |
| anotacao | NVARCHAR(MAX) | NÃO | Texto livre colado do sistema externo |
| obs | NVARCHAR(500) | SIM | Observações internas |
| status_hom | VARCHAR(20) | NÃO | `Pendente` · `Aprovado` · `Reprovado` |
| data_hom | DATETIME | SIM | Data/hora da aprovação ou reprovação em hom |
| obs_hom | NVARCHAR(500) | SIM | Observação específica de homologação |
| status_prod | VARCHAR(20) | NÃO | `Pendente` · `EmProducao` · `Aprovado` · `Reprovado` |
| data_prod | DATETIME | SIM | Data/hora da aprovação ou reprovação em prod |
| obs_prod | NVARCHAR(500) | SIM | Observação específica de produção |
| qtd_retornos | INT | NÃO | Contagem de retornos ao desenvolvedor (auto via trigger) |
| ativo | BIT | NÃO | **1** = ativo · **0** = arquivado/cancelado |
| criado_em | DATETIME | NÃO | Data/hora de criação |
| atualizado_em | DATETIME | SIM | Data/hora da última alteração |
| atualizado_por | INT | SIM | FK → CV_USUARIOS — quem fez a última alteração |

### CV_RETORNOS

| Coluna | Tipo | Nulo | Descrição |
|---|---|---|---|
| id_retorno | INT IDENTITY | NÃO | PK |
| id_protocolo | VARCHAR(20) | NÃO | FK → CV_PROTOCOLOS |
| fase | VARCHAR(10) | NÃO | `hom` · `prod` — em qual fase ocorreu o retorno |
| motivo | NVARCHAR(500) | SIM | Descrição do motivo (pode ser nulo se automático) |
| registrado_por | INT | NÃO | FK → CV_USUARIOS |
| registrado_em | DATETIME | NÃO | Data/hora do registro |

### CV_STATUS_HISTORICO

| Coluna | Tipo | Nulo | Descrição |
|---|---|---|---|
| id_historico | INT IDENTITY | NÃO | PK |
| id_protocolo | VARCHAR(20) | NÃO | FK → CV_PROTOCOLOS |
| campo | VARCHAR(20) | NÃO | `status_hom` · `status_prod` · `qtd_retornos` · `ativo` |
| valor_anterior | VARCHAR(50) | SIM | Valor antes da mudança (NULL na criação) |
| valor_novo | VARCHAR(50) | NÃO | Novo valor após a mudança |
| alterado_por | INT | NÃO | FK → CV_USUARIOS |
| alterado_em | DATETIME | NÃO | Data/hora da mudança |

---

## Convenções adotadas

- Prefixo `CV_` em todas as tabelas e views para isolar o schema da Central de Validações de outros objetos do banco.
- Campos `ativo` usam `BIT`: **1 = ativo**, **0 = desativado** — nunca deletar registros operacionais.
- Campos de data de criação (`criado_em`) usam `DEFAULT GETDATE()` e nunca são atualizados.
- Campos de atualização (`atualizado_em`) são atualizados pela aplicação ou por trigger.
- Senhas nunca armazenadas em texto plano — usar `bcrypt` ou `HASHBYTES('SHA2_256', ...)` no mínimo.
- A regra de fluxo HOM → PROD é garantida tanto pelo `CHECK CONSTRAINT` quanto pela aplicação.
- O trigger `TR_CV_PROT_RETORNO_AUTO` é a única fonte de verdade para o incremento automático de retornos.

---

*Central de Validações BigCard · Governador Valadares/MG*
