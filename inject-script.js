import fs from 'fs';

const files = ['index.html', 'gst.html', 'itr.html', 'reports.html'];

files.forEach(file => {
    const filePath = `e:\\TaxFlow-Antigravity\\${file}`;
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('src="/app.js"')) {
        content = content.replace('</body>', '<script type="module" src="/app.js"></script>\n</body>');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Injected script into ${file}`);
    }
});
