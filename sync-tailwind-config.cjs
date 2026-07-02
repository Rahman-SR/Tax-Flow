const fs = require('fs');

const files = [
    'e:/TaxFlow-Antigravity/index.html',
    'e:/TaxFlow-Antigravity/gst.html',
    'e:/TaxFlow-Antigravity/reports.html',
    'e:/TaxFlow-Antigravity/test.html'
];

// 1. Read itr.html for reference
const itrHtml = fs.readFileSync('e:/TaxFlow-Antigravity/itr.html', 'utf8');

// 2. Extract Tailwind Config script block exactly
const tailwindRegex = /<script id="tailwind-config">[\s\S]*?<\/script>/i;
const itrTailwindConfig = (itrHtml.match(tailwindRegex) || [''])[0];

if (!itrTailwindConfig) {
    console.log("Could not find tailwind-config in itr.html");
    process.exit(1);
}

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let html = fs.readFileSync(file, 'utf8');
    
    // Replace the tailwind config block
    html = html.replace(tailwindRegex, itrTailwindConfig);
    
    fs.writeFileSync(file, html);
});

console.log('Tailwind config (spacing, fonts, borders) synced to all pages!');
