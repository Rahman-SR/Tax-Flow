const fs = require('fs');
const glob = require('glob'); // wait I can just hardcode the files

const files = [
    'e:/TaxFlow-Antigravity/index.html',
    'e:/TaxFlow-Antigravity/gst.html',
    'e:/TaxFlow-Antigravity/itr.html',
    'e:/TaxFlow-Antigravity/reports.html'
];

const activeClasses = 'flex items-center gap-md px-md py-sm border-l-4 border-primary bg-secondary-container text-on-secondary-container font-bold transition-all duration-200';
const inactiveClasses = 'flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-variant transition-colors transition-all duration-200';

function getNavHtml(activePage) {
    return `<nav class="flex-1 flex flex-col gap-base">
<a class="${activePage === 'index.html' ? activeClasses : inactiveClasses}" href="index.html">
<span class="material-symbols-outlined" data-icon="group">group</span>
<span class="font-label-md">Total Clients</span>
</a>
<a class="${activePage === 'gst.html' ? activeClasses : inactiveClasses}" href="gst.html">
<span class="material-symbols-outlined" data-icon="receipt_long">receipt_long</span>
<span class="font-label-md">GST Clients</span>
</a>
<a class="${activePage === 'itr.html' ? activeClasses : inactiveClasses}" href="itr.html">
<span class="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
<span class="font-label-md">ITR Clients</span>
</a>
<a class="${activePage === 'reports.html' ? activeClasses : inactiveClasses}" href="reports.html">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
<span class="font-label-md">Reports</span>
</a>
<a class="${inactiveClasses}" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-label-md">Settings</span>
</a>
</nav>`;
}

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let html = fs.readFileSync(file, 'utf8');
    const fileName = file.split('/').pop();
    const navHtml = getNavHtml(fileName);
    
    // Replace existing <nav> block
    html = html.replace(/<nav[\s\S]*?<\/nav>/, navHtml);
    
    fs.writeFileSync(file, html);
});

console.log('Synchronized sidebars across all pages');
