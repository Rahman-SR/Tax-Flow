const fs = require('fs');

const files = [
    'e:/TaxFlow-Antigravity/index.html',
    'e:/TaxFlow-Antigravity/gst.html',
    'e:/TaxFlow-Antigravity/itr.html',
    'e:/TaxFlow-Antigravity/reports.html',
    'e:/TaxFlow-Antigravity/test.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let html = fs.readFileSync(file, 'utf8');
    
    // Find the settings link and add mt-auto back
    const settingsRegex = /<a class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-variant transition-colors transition-all duration-200" href="#">\s*<span class="material-symbols-outlined" data-icon="settings">settings<\/span>/;
    const replacement = `<a class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-variant transition-colors transition-all duration-200 mt-auto" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>`;
    
    html = html.replace(settingsRegex, replacement);
    
    fs.writeFileSync(file, html);
});

console.log('Restored mt-auto to Settings link');
