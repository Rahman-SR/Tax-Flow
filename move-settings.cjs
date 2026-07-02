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
    
    // Remove Settings from Sidebar
    html = html.replace(/<a class="[^"]*mt-auto[^"]*" href="#">\s*<span class="material-symbols-outlined"[^>]*>settings<\/span>\s*<span class="font-label-md">Settings<\/span>\s*<\/a>/i, '');
    
    // Add Settings to Header (near notifications/help)
    const targetHeaderIcons = /<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95" data-icon="notifications">notifications<\/button>/;
    const settingsButton = '<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95" data-icon="settings">settings</button>\n        ';
    
    if (html.match(targetHeaderIcons) && !html.includes('data-icon="settings">settings</button>')) {
        html = html.replace(targetHeaderIcons, settingsButton + '$&');
    }
    
    fs.writeFileSync(file, html);
});

console.log('Settings moved to top nav in all pages.');
