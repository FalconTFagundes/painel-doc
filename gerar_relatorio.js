const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  HeadingLevel, PageNumber, Header, Footer
} = require('docx');
const fs = require('fs');

// Exemplo de dados mockados para o relatório
const exemplo = {
  id: 'PRO-2025-0032',
  data: '28/05/2025',
  sistema: 'WebEmpresas',
  url: 'webempresas.bigcard.com.br',
  ambiente: 'AMBOS', // HOM, PROD, AMBOS
  ajustes: 'Ajuste na procedure sp_calcular_limite_pj no banco BIGCARD_PROD.\nAlteração no arquivo LimiteService.cs linha 312.\nDeploy realizado via GitLab CI/CD.',
  statusHom: 'Validado',   // Validado | Validado com Ressalvas | Não validado
  statusProd: 'Validado',
  obsHom: 'Testado com 3 CNPJs distintos, todos aprovados.',
  obsProd: 'Validado às 14:32 sem incidentes.',
  responsavel: 'Renan N.',
};

function checkBox(checked) {
  return new TextRun({ text: checked ? '☑' : '☐', font: 'Arial', size: 22 });
}

function label(text, bold = true) {
  return new TextRun({ text, bold, font: 'Arial', size: 22 });
}

function bodyText(text) {
  return new TextRun({ text: text || '—', font: 'Arial', size: 22 });
}

function spacer(lines = 1) {
  return Array(lines).fill(null).map(() =>
    new Paragraph({ children: [new TextRun({ text: '' })], spacing: { after: 80 } })
  );
}

function sectionTitle(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, font: 'Arial', size: 24, color: '2E4057' })],
    spacing: { before: 300, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '2E4057', space: 4 } }
  });
}

function fieldLine(labelText, value) {
  return new Paragraph({
    children: [
      new TextRun({ text: labelText + ': ', bold: true, font: 'Arial', size: 22 }),
      new TextRun({ text: value || '—', font: 'Arial', size: 22 }),
    ],
    spacing: { after: 120 }
  });
}

function multilineField(labelText, value) {
  const lines = (value || '—').split('\n');
  const paras = [];
  paras.push(new Paragraph({
    children: [new TextRun({ text: labelText + ':', bold: true, font: 'Arial', size: 22 })],
    spacing: { after: 60 }
  }));
  lines.forEach(l => paras.push(new Paragraph({
    children: [new TextRun({ text: l, font: 'Arial', size: 22 })],
    indent: { left: 360 },
    spacing: { after: 60 }
  })));
  return paras;
}

function resultadoField(status) {
  const val = status === 'Validado';
  const res = status === 'Validado com Ressalvas';
  const nval = status === 'Não validado' || status === 'Não Validado';
  return new Paragraph({
    children: [
      checkBox(val), new TextRun({ text: ' VALIDADO     ', font: 'Arial', size: 22 }),
      checkBox(res), new TextRun({ text: ' VALIDADO COM RESSALVAS     ', font: 'Arial', size: 22 }),
      checkBox(nval), new TextRun({ text: ' NÃO VALIDADO', font: 'Arial', size: 22 }),
    ],
    spacing: { after: 120 }
  });
}

function ambienteField(tipo) {
  const isHom = tipo === 'HOM' || tipo === 'AMBOS';
  const isProd = tipo === 'PROD' || tipo === 'AMBOS';
  return new Paragraph({
    children: [
      new TextRun({ text: 'AMBIENTE:', bold: true, font: 'Arial', size: 22 }),
      new TextRun({ text: '  ', font: 'Arial', size: 22 }),
      checkBox(isHom), new TextRun({ text: ' HOMOLOGAÇÃO     ', font: 'Arial', size: 22 }),
      checkBox(isProd), new TextRun({ text: ' PRODUÇÃO', font: 'Arial', size: 22 }),
    ],
    spacing: { after: 120 }
  });
}

function buildDocument(data) {
  const {
    id, data: dataField, sistema, url, ambiente,
    ajustes, statusHom, statusProd, obsHom, obsProd, responsavel
  } = data;

  const children = [
    // Header bloco
    new Paragraph({
      children: [new TextRun({ text: 'CENTRAL DE VALIDAÇÕES', bold: true, font: 'Arial', size: 32, color: '2E4057' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 }
    }),
    new Paragraph({
      children: [new TextRun({ text: 'BigCard Tecnologia e Serviços', font: 'Arial', size: 20, color: '888888' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: '2E4057', space: 6 } }
    }),

    // Identificação
    sectionTitle('IDENTIFICAÇÃO DO PROTOCOLO'),
    fieldLine('DATA', dataField),
    fieldLine('PROTOCOLO', id),
    fieldLine('SISTEMA', `${sistema}${url ? ` (${url})` : ''}`),
    fieldLine('RESPONSÁVEL', responsavel),
    ambienteField(ambiente),
    ...spacer(),

    // Ajustes
    sectionTitle('AJUSTES REALIZADOS'),
    ...multilineField('', ajustes),
    ...spacer(),
  ];

  // Bloco Homologação (se aplicável)
  if (ambiente !== 'PROD') {
    children.push(
      sectionTitle('RESULTADO — HOMOLOGAÇÃO'),
      new Paragraph({
        children: [label('RESULTADO:')],
        spacing: { after: 80 }
      }),
      resultadoField(statusHom),
      new Paragraph({
        children: [label('OBSERVAÇÕES:')],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [bodyText(obsHom)],
        indent: { left: 360 },
        spacing: { after: 80 }
      }),
      ...spacer()
    );
  }

  // Bloco Produção
  children.push(
    sectionTitle('VALIDAÇÃO EM PRODUÇÃO'),
    fieldLine('DATA', dataField),
    fieldLine('SISTEMA', `${sistema}${url ? ` (${url})` : ''}`),
    new Paragraph({
      children: [
        label('AMBIENTE:  '),
        checkBox(false), new TextRun({ text: ' HOMOLOGAÇÃO     ', font: 'Arial', size: 22 }),
        checkBox(true), new TextRun({ text: ' PRODUÇÃO', font: 'Arial', size: 22 }),
      ],
      spacing: { after: 120 }
    }),
    new Paragraph({
      children: [label('RESULTADO:')],
      spacing: { after: 80 }
    }),
    resultadoField(statusProd),
    new Paragraph({
      children: [label('OBSERVAÇÕES:')],
      spacing: { after: 80 }
    }),
    new Paragraph({
      children: [bodyText(obsProd)],
      indent: { left: 360 },
      spacing: { after: 80 }
    }),
    ...spacer(2),

    // Assinaturas
    sectionTitle('ASSINATURAS'),
    new Paragraph({
      children: [new TextRun({ text: '_'.repeat(40) + '     ' + '_'.repeat(40), font: 'Arial', size: 22 })],
      spacing: { before: 400, after: 80 }
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Responsável pelo Ajuste', font: 'Arial', size: 20, color: '888888' }),
        new TextRun({ text: '                                        Validador', font: 'Arial', size: 20, color: '888888' }),
      ],
      spacing: { after: 240 }
    }),

    // Rodapé info
    new Paragraph({
      children: [new TextRun({ text: `Documento gerado automaticamente pela Central de Validações BigCard — ${id}`, font: 'Arial', size: 18, color: 'AAAAAA' })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 }
    }),
  );

  return new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1134, bottom: 1440, left: 1134 }
        }
      },
      children
    }]
  });
}

async function main() {
  const doc = buildDocument(exemplo);
  const buffer = await Packer.toBuffer(doc);
  const outPath = process.argv[2] || 'relatorio_bigcard.docx';
  fs.writeFileSync(outPath, buffer);
  console.log(`✓ Relatório gerado: ${outPath}`);
}

main().catch(console.error);
