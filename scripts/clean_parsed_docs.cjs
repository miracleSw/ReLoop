const fs = require('fs');
const path = require('path');

function cleanXmlText(xmlSnippet) {
  // Strip all XML tags, decode entities
  return xmlSnippet
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseDocxClean(extractedDir, outputFile) {
  const xmlPath = path.join(extractedDir, 'word', 'document.xml');
  const relsPath = path.join(extractedDir, 'word', '_rels', 'document.xml.rels');

  if (!fs.existsSync(xmlPath)) {
    console.error(`File not found: ${xmlPath}`);
    return;
  }

  const relsMap = {};
  if (fs.existsSync(relsPath)) {
    const relsXml = fs.readFileSync(relsPath, 'utf8');
    const relRegex = /<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"[^>]*\/>/g;
    let match;
    while ((match = relRegex.exec(relsXml)) !== null) {
      relsMap[match[1]] = match[2];
    }
  }

  const xml = fs.readFileSync(xmlPath, 'utf8');
  const bodyMatch = xml.match(/<w:body>(.*?)<\/w:body>/s);
  if (!bodyMatch) return;
  const body = bodyMatch[1];

  let md = '';
  const elementRegex = /(<w:p[\s>].*?<\/w:p>|<w:tbl[\s>].*?<\/w:tbl>)/gs;
  let elemMatch;

  while ((elemMatch = elementRegex.exec(body)) !== null) {
    const elem = elemMatch[1];

    if (elem.startsWith('<w:tbl')) {
      const rows = elem.match(/<w:tr[\s>].*?<\/w:tr>/gs) || [];
      const parsedRows = [];

      for (const row of rows) {
        const cells = row.match(/<w:tc[\s>].*?<\/w:tc>/gs) || [];
        const parsedCells = cells.map((cell) => {
          let cellImg = '';
          const blipMatch = cell.match(/<a:blip[^>]*r:embed="([^"]+)"/);
          if (blipMatch && relsMap[blipMatch[1]]) {
            const target = relsMap[blipMatch[1]];
            cellImg = ` [IMAGE: ${target}](${path.join(extractedDir, 'word', target).replace(/\\/g, '/')}) `;
          }
          const text = cleanXmlText(cell).replace(/\|/g, '\\|');
          return (text + cellImg).trim();
        });
        parsedRows.push(parsedCells);
      }

      if (parsedRows.length > 0) {
        md += '\n\n';
        // Normalize column count
        const colCount = Math.max(...parsedRows.map((r) => r.length));
        const normalizedRows = parsedRows.map((r) => {
          while (r.length < colCount) r.push('');
          return r;
        });

        md += '| ' + normalizedRows[0].join(' | ') + ' |\n';
        md += '| ' + normalizedRows[0].map(() => '---').join(' | ') + ' |\n';
        for (let i = 1; i < normalizedRows.length; i++) {
          md += '| ' + normalizedRows[i].join(' | ') + ' |\n';
        }
        md += '\n';
      }
    } else if (elem.startsWith('<w:p')) {
      let imgMd = '';
      const blipMatches = elem.matchAll(/<a:blip[^>]*r:embed="([^"]+)"/g);
      for (const b of blipMatches) {
        if (relsMap[b[1]]) {
          const target = relsMap[b[1]];
          imgMd += `\n\n![Diagram: ${target}](${path.join(extractedDir, 'word', target).replace(/\\/g, '/')})\n\n`;
        }
      }

      const styleMatch = elem.match(/<w:pStyle[^>]*w:val="([^"]+)"/);
      const text = cleanXmlText(elem);

      if (text || imgMd) {
        if (styleMatch) {
          const style = styleMatch[1].toLowerCase();
          if (style.includes('heading1') || style.includes('heading 1') || style === '1') {
            md += `\n# ${text}\n`;
          } else if (style.includes('heading2') || style.includes('heading 2') || style === '2') {
            md += `\n## ${text}\n`;
          } else if (style.includes('heading3') || style.includes('heading 3') || style === '3') {
            md += `\n### ${text}\n`;
          } else if (style.includes('heading4') || style.includes('heading 4') || style === '4') {
            md += `\n#### ${text}\n`;
          } else {
            md += `\n${text}`;
          }
        } else {
          md += `\n${text}`;
        }
        if (imgMd) {
          md += imgMd;
        }
      }
    }
  }

  fs.writeFileSync(outputFile, md, 'utf8');
  console.log(`Successfully generated clean markdown: ${outputFile} (${md.length} chars)`);
}

parseDocxClean('D:/Project/DAPM/docs/extracted_srs', 'D:/Project/DAPM/docs/NEW_SRS_CLEAN.md');
parseDocxClean('D:/Project/DAPM/docs/extracted_usecase', 'D:/Project/DAPM/docs/NEW_USECASE_CLEAN.md');
