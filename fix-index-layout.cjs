const fs = require('fs');
let indexHtml = fs.readFileSync('e:/TaxFlow-Antigravity/index.html', 'utf8');

// 1. Add rounded-xl to KPI Cards
indexHtml = indexHtml.replace(/<div class="bg-surface-container border border-outline-variant p-lg relative overflow-hidden/g, 
                             '<div class="bg-surface-container border border-outline-variant p-lg relative overflow-hidden rounded-xl');

// 2. Add rounded-xl shadow-2xl to the Table section
// Search for <section class="bg-surface-container border border-outline-variant"
indexHtml = indexHtml.replace(/<section class="bg-surface-container border border-outline-variant" style="transform: translateY\(0px\); transition: transform 0\.2s ease-out;">/, 
                              '<section class="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-2xl" style="transform: translateY(0px); transition: transform 0.2s ease-out;">');

// 3. Add bg-surface-container-high to the Table Header
indexHtml = indexHtml.replace(/<div class="px-lg py-md border-b border-outline-variant flex justify-between items-center">/, 
                              '<div class="px-lg py-md border-b border-outline-variant bg-surface-container-high flex justify-between items-center">');

// 4. Update the "Add Client" button to match the red style from ITR
// <button class="inline-flex items-center gap-xs px-md py-xs rounded-lg bg-primary-container text-white text-label-md font-bold uppercase transition-transform active:scale-95">
const oldBtn = `<button class="inline-flex items-center gap-xs px-md py-xs rounded-lg bg-primary-container text-white text-label-md font-bold uppercase transition-transform active:scale-95">
<span class="material-symbols-outlined text-sm" data-icon="person_add">person_add</span>
                            Add Client
                        </button>`;
const newBtn = `<button class="bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-bold flex items-center gap-sm hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-red-900/10">
<span class="material-symbols-outlined text-sm" data-icon="person_add">person_add</span>
<span class="uppercase tracking-tighter">Add Client</span>
</button>`;
indexHtml = indexHtml.replace(oldBtn, newBtn);


fs.writeFileSync('e:/TaxFlow-Antigravity/index.html', indexHtml);
console.log('index.html matched to ITR style');
