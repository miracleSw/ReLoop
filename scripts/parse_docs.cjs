const fs = require('fs');
const path = require('path');

function parseDocx(extractedDir, outputFile) {
  const xmlPath = path.join(extractedDir, 'word', 'document.xml');
  const relsPath = path.join(extractedDir, 'word', '_rels', 'document.xml.rels');

  if (!fs.existsSync(xmlPath)) {
    console.error(`File not found: ${xmlPath}`);
    return;
  }

  // Parse relationships
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

  // Simple token parser for Word XML
  // We want to extract paragraphs, headings, tables, and images.
  let md = '';

  // Helper to extract text from a node
  function extractText(xmlSnippet) {
    const textMatches = xmlSnippet.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
    return textMatches
      .map((t) => t.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, ''))
      .join('');
  }

  // Process tables and paragraphs
  // Replace w:tbl with a marker, process tables, then paragraphs
  // Let's iterate over top-level body children
  const bodyMatch = xml.match(/<w:body>(.*?)<\/w:body>/s);
  if (!bodyMatch) {
    console.error('No w:body found');
    return;
  }
  const body = bodyMatch[1];

  // Regex to match top level w:p or w:tbl
  const elementRegex = /(<w:p[\s>].*?<\/w:p>|<w:tbl[\s>].*?<\/w:tbl>)/gs;
  let elemMatch;

  while ((elemMatch = elementRegex.exec(body)) !== null) {
    const elem = elemMatch[1];
    if (elem.startsWith('<w:tbl')) {
      // Parse table
      const rows = elem.match(/<w:tr[\s>].*?<\/w:tr>/gs) || [];
      const parsedRows = [];
      for (const row of rows) {
        const cells = row.match(/<w:tc[\s>].*?<\/w:tc>/gs) || [];
        const parsedCells = cells.map((cell) => {
          // Check for image inside cell
          let cellImg = '';
          const blipMatch = cell.match(/<a:blip[^>]*r:embed="([^"]+)"/);
          if (blipMatch && relsMap[blipMatch[1]]) {
            const target = relsMap[blipMatch[1]];
            cellImg = ` ![diagram](${path.join(extractedDir, 'word', target).replace(/\\/g, '/')}) `;
          }
          const text = extractText(cell).trim().replace(/\|/g, '\\|');
          return (text + cellImg).replace(/\s+/g, ' ');
        });
        parsedRows.push(parsedCells);
      }

      if (parsedRows.length > 0) {
        md += '\n';
        // Header row
        md += '| ' + parsedRows[0].join(' | ') + ' |\n';
        md += '| ' + parsedRows[0].map(() => '---').join(' | ') + ' |\n';
        for (let i = 1; i < parsedRows.length; i++) {
          md += '| ' + parsedRows[i].join(' | ') + ' |\n';
        }
        md += '\n';
      }
    } else if (elem.startsWith('<w:p')) {
      // Check for image inside paragraph
      const blipMatch = elem.match(/<a:blip[^>]*r:embed="([^"]+)"/);
      let imgMd = '';
      if (blipMatch && relsMap[blipMatch[1]]) {
        const target = relsMap[blipMatch[1]];
        imgMd = `\n\n![diagram](${path.join(extractedDir, 'word', target).replace(/\\/g, '/')})\n\n`;
      }

      // Check style
      const styleMatch = elem.match(/<w:pStyle[^>]*w:val="([^"]+)"/);
      const text = extractText(elem).trim();

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
  console.log(`Parsed ${outputFile} successfully (${md.length} chars)`);
}

parseDocx('D:/Project/DAPM/docs/extracted_srs', 'D:/Project/DAPM/docs/NEW_SRS_PARSED.md');
parseDocx('D:/Project/DAPM/docs/extracted_usecase', 'D:/Project/DAPM/docs/NEW_USECASE_PARSED.md');
