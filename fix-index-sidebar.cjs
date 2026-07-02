const fs = require('fs');

const itrHtml = fs.readFileSync('e:/TaxFlow-Antigravity/itr.html', 'utf8');
let indexHtml = fs.readFileSync('e:/TaxFlow-Antigravity/index.html', 'utf8');

// Extract the perfect sidebar from itr.html
const sidebarMatch = itrHtml.match(/<!-- SIDE NAVIGATION BAR -->\s*<aside[\s\S]*?<\/aside>/i) || itrHtml.match(/<!-- Side Navigation Bar -->\s*<aside[\s\S]*?<\/aside>/i) || itrHtml.match(/<aside[\s\S]*?<\/aside>/i);
const pristineSidebar = sidebarMatch[0];

// Replace the mangled sidebar in index.html
indexHtml = indexHtml.replace(/<!-- Side Navigation Bar -->\s*<aside[\s\S]*?<\/aside>/i, pristineSidebar);

// Write it back
fs.writeFileSync('e:/TaxFlow-Antigravity/index.html', indexHtml);
console.log('Fixed index.html sidebar');
