const fs = require('fs');

const files = [
    'e:/TaxFlow-Antigravity/index.html',
    'e:/TaxFlow-Antigravity/gst.html',
    'e:/TaxFlow-Antigravity/reports.html',
    'e:/TaxFlow-Antigravity/test.html'
];

const targetBody = '<body class="bg-background text-on-surface custom-scrollbar">';
const targetHeaderTag = '<header class="flex justify-between items-center h-16 px-xl w-[calc(100%-260px)] ml-[260px] bg-surface dark:bg-surface border-b border-outline-variant dark:border-outline-variant sticky top-0 z-40">';
const targetMainTag = '<main class="ml-[260px] p-xl mb-16">';

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let html = fs.readFileSync(file, 'utf8');
    
    // 1. Unify Body tag
    html = html.replace(/<body[^>]*>/i, targetBody);
    
    // 2. Remove the flex wrapper specifically in index.html
    if (file.includes('index.html')) {
        html = html.replace(/<div class="flex-1 ml-\[260px\] flex flex-col min-h-screen bg-surface">/, '');
        // We also need to remove the closing </div> right before </body> or <footer>
        html = html.replace(/<\/div>\s*<\/body>/, '</body>');
    }
    
    // 3. Unify Header outer tag (preserve inner HTML)
    html = html.replace(/<header[^>]*>/, targetHeaderTag);
    
    // 4. Unify Main outer tag (preserve inner HTML)
    html = html.replace(/<main[^>]*>/, targetMainTag);
    
    fs.writeFileSync(file, html);
});

console.log('Top-level body and layout wrappers unified across all pages!');
