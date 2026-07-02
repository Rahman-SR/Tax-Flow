const fs = require('fs');

const files = [
    'e:/TaxFlow-Antigravity/index.html',
    'e:/TaxFlow-Antigravity/gst.html',
    'e:/TaxFlow-Antigravity/itr.html',
    'e:/TaxFlow-Antigravity/reports.html',
    'e:/TaxFlow-Antigravity/test.html'
];

// 1. Read itr.html for reference
const itrHtml = fs.readFileSync('e:/TaxFlow-Antigravity/itr.html', 'utf8');

// 2. Extract components
const sidebarRegex = /<aside[\s\S]*?<\/aside>/i;
const headerRegex = /<header[\s\S]*?<\/header>/i;
const footerRegex = /<footer[\s\S]*?<\/footer>/i;

const itrSidebar = (itrHtml.match(sidebarRegex) || [''])[0];
const itrHeader = (itrHtml.match(headerRegex) || [''])[0];
const itrFooter = (itrHtml.match(footerRegex) || [''])[0];

const activeClass = 'flex items-center gap-md px-md py-sm bg-surface-variant text-on-surface font-bold transition-all duration-200';
const inactiveClass = 'flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-variant transition-colors transition-all duration-200';

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let html = fs.readFileSync(file, 'utf8');
    const fileName = file.split('/').pop();
    
    // Unify Body
    html = html.replace(/<body[^>]*>/i, '<body class="bg-background text-on-surface custom-scrollbar">');
    
    // Unify Sidebar (and fix active tab)
    if (itrSidebar) {
        let newSidebar = itrSidebar;
        // Make all inactive first
        newSidebar = newSidebar.replace(new RegExp(activeClass.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), inactiveClass);
        
        // Then make the target active
        let targetHref = fileName;
        if (fileName === 'test.html') targetHref = 'reports.html'; // Default test to reports tab
        
        const targetRegex = new RegExp(`<a class="${inactiveClass.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}" href="${targetHref}">`);
        newSidebar = newSidebar.replace(targetRegex, `<a class="${activeClass}" href="${targetHref}">`);
        
        html = html.replace(sidebarRegex, newSidebar);
    }
    
    // Unify Header
    if (itrHeader) {
        html = html.replace(headerRegex, itrHeader);
    }
    
    // Unify Main tag
    html = html.replace(/<main[^>]*>/, '<main class="ml-[260px] p-xl mb-16">');
    
    // Unify Footer
    if (itrFooter && html.match(footerRegex)) {
        html = html.replace(footerRegex, itrFooter);
    }
    
    // If it's index.html, we removed space-y-xl, so add mb-xl to sections inside main
    if (fileName === 'index.html') {
        html = html.replace(/<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">/g, '<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">');
        html = html.replace(/<section class="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-2xl"/g, '<section class="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-2xl mb-xl"');
        html = html.replace(/<div class="bg-primary-container text-on-primary-container p-md flex items-center justify-between shadow-lg animate-pulse"/g, '<div class="bg-primary-container text-on-primary-container p-md flex items-center justify-between shadow-lg animate-pulse mb-xl"');
    }
    
    fs.writeFileSync(file, html);
});

console.log('Ultimate strict layout unification applied.');
