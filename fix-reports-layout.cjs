const fs = require('fs');
let reportsHtml = fs.readFileSync('e:/TaxFlow-Antigravity/reports.html', 'utf8');

// Replace chart-container with exact ITR-matching classes
reportsHtml = reportsHtml.replace(/chart-container/g, 'bg-surface-container border border-outline-variant shadow-2xl');

// The main tag in reports.html is `<main class="ml-[260px] h-[calc(100vh-64px)] overflow-y-auto p-xl custom-scrollbar pb-24">`
// Let's remove the h-[calc...] and custom-scrollbar so it flows naturally like ITR page
reportsHtml = reportsHtml.replace(/h-\[calc\(100vh-64px\)\] overflow-y-auto p-xl custom-scrollbar pb-24/g, 'p-xl mb-16');

fs.writeFileSync('e:/TaxFlow-Antigravity/reports.html', reportsHtml);
console.log('reports.html matched to ITR style');
