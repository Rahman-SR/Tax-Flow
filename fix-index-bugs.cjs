const fs = require('fs');

let indexHtml = fs.readFileSync('e:/TaxFlow-Antigravity/index.html', 'utf8');

// 1. Restore space-y-xl to main
indexHtml = indexHtml.replace(/<main class="ml-\[260px\] p-xl mb-16">/, '<main class="ml-[260px] p-xl mb-16 space-y-xl">');

// 2. Fix sidebar active tab for index.html
const activeClass = 'bg-surface-variant text-on-surface font-bold';
const inactiveClass = 'text-on-surface-variant hover:bg-surface-variant transition-colors';

// Find the links in the sidebar
// We want Total Clients to have activeClass, and ITR Clients to have inactiveClass
// Currently:
// Total Clients: class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-variant transition-colors transition-all duration-200"
// ITR Clients: class="flex items-center gap-md px-md py-sm bg-surface-variant text-on-surface font-bold transition-all duration-200"

indexHtml = indexHtml.replace(
    /<a class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-variant transition-colors transition-all duration-200" href="index\.html">/g,
    '<a class="flex items-center gap-md px-md py-sm bg-surface-variant text-on-surface font-bold transition-all duration-200" href="index.html">'
);

indexHtml = indexHtml.replace(
    /<a class="flex items-center gap-md px-md py-sm bg-surface-variant text-on-surface font-bold transition-all duration-200" href="itr\.html">/g,
    '<a class="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-variant transition-colors transition-all duration-200" href="itr.html">'
);

fs.writeFileSync('e:/TaxFlow-Antigravity/index.html', indexHtml);
console.log('Fixed index.html main spacing and active tab');
