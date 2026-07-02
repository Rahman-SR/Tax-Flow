import fs from 'fs';

const files = ['gst.html', 'itr.html'];

files.forEach(file => {
    const filePath = `e:\\TaxFlow-Antigravity\\${file}`;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace everything inside <tbody>...</tbody> with an empty tbody
    content = content.replace(/<tbody>[\s\S]*?<\/tbody>/i, '<tbody></tbody>');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleared tbody in ${file}`);
});
