import fs from 'fs';
import path from 'path';

const DSA_DIR = 'c:/Users/Rahul Aher/.01 Rahul Aher/All Projects/My projects/portfolio-v1/content/articles/10-dsa-roadmap';

function generateVizHtml(data, isOutput) {
    if (typeof data === 'string') {
        data = data.split('');
    }
    if (!Array.isArray(data)) return null;
    if (data.length === 0) return null;

    const isMatrix = Array.isArray(data[0]);

    if (isMatrix) {
        let html = '\n<div class="arr-viz-wrapper">\n  <div class="arr-viz-grid">\n';
        data.forEach((row) => {
            html += '    <div class="arr-viz-grid-row">\n';
            row.forEach((val) => {
                let cellClass = isOutput ? 'arr-cell--green' : (val === 0 || val === '0' || val === '""' || val === 'null' || val === null ? 'arr-cell--zero' : 'arr-cell--filled');
                html += `      <div class="arr-cell arr-cell--grid ${cellClass}"><span class="arr-val">${val}</span></div>\n`;
            });
            html += '    </div>\n';
        });
        html += '  </div>\n</div>';
        return html;
    } else {
        if (data.length > 50) return null;
        let html = '\n<div class="arr-viz-wrapper">\n  <div class="arr-viz-row">\n';
        data.forEach((val, idx) => {
            let cellClass = isOutput ? 'arr-cell--green' : (val === 0 || val === '0' || val === '""' || val === 'null' || val === null ? 'arr-cell--zero' : 'arr-cell--filled');
            html += `    <div class="arr-cell ${cellClass}"><span class="arr-idx">${idx}</span><span class="arr-val">${val}</span></div>\n`;
        });
        html += '  </div>\n</div>';
        return html;
    }
}

function processLine(lineRaw) {
    const lineClean = lineRaw.replace(/\\/g, '');
    const isInput = lineClean.toLowerCase().includes('input:');
    const isOutput = lineClean.toLowerCase().includes('output:');
    if (!isInput && !isOutput) return null;

    // Try Array/Matrix match
    const firstBracket = lineClean.indexOf('[');
    const lastBracket = lineClean.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
        const arrayStr = lineClean.substring(firstBracket, lastBracket + 1);
        try {
            const data = JSON.parse(arrayStr);
            return generateVizHtml(data, isOutput);
        } catch (e) { }
    }

    // Try String match (e.g. s = "abc")
    const quoteMatches = lineClean.match(/"([^"]+)"/);
    if (quoteMatches) {
        return generateVizHtml(quoteMatches[1], isOutput);
    }

    return null;
}

function main() {
    const files = fs.readdirSync(DSA_DIR).filter(f => f.endsWith('.md'));
    let count = 0;

    for (const fname of files) {
        const fpath = path.join(DSA_DIR, fname);
        const content = fs.readFileSync(fpath, 'utf8');
        const lines = content.split(/\r?\n/);
        const newLines = [];
        let modified = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            newLines.push(line);

            // Check if we should generate a viz
            const viz = processLine(line);
            if (viz) {
                // Peek ahead to avoid duplicates
                let isDuplicate = false;
                for (let j = 1; j <= 3; j++) {
                    if (lines[i + j] && lines[i + j].includes('arr-viz-wrapper')) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newLines.push(viz);
                    modified = true;
                }
            }

            // Fix dangling labels: wrap lone <p class="arr-step-label"> tags in a div if not already
            if (line.includes('arr-step-label') && !line.includes('div')) {
                // If it's a simple <p>...</p> line, we wrap it
                const pIndex = newLines.length - 1;
                newLines[pIndex] = '<div class="arr-viz-wrapper">\n  ' + line.trim() + '\n</div>';
                modified = true;
            }
            if (line.includes('arr-caption') && !line.includes('div')) {
                const pIndex = newLines.length - 1;
                newLines[pIndex] = '<div class="arr-viz-wrapper">\n  ' + line.trim() + '\n</div>';
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(fpath, newLines.join('\n'), 'utf8');
            console.log(`  OPTIMIZED: ${fname}`);
            count++;
        }
    }
    console.log(`\nSuccess. Optimized ${count} files.`);
}

main();
