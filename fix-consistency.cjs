const fs = require('fs');

const standardProfile = `
<div class="px-md mt-auto pt-lg border-t border-outline-variant flex items-center gap-md">
    <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold">JD</div>
    <div>
        <p class="font-label-md font-bold text-on-surface">John Doe</p>
        <p class="text-[10px] text-on-surface-variant">Lead Tax Agent</p>
    </div>
</div>
</aside>`;

// 1. Fix index.html
let indexHtml = fs.readFileSync('e:/TaxFlow-Antigravity/index.html', 'utf8');
const indexOldProfileRegex = /<div class="flex items-center gap-sm">[\s\S]*?Administrator<\/p>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/aside>/;
indexHtml = indexHtml.replace(indexOldProfileRegex, standardProfile);
fs.writeFileSync('e:/TaxFlow-Antigravity/index.html', indexHtml);

// 2. Fix itr.html profile
let itrHtml = fs.readFileSync('e:/TaxFlow-Antigravity/itr.html', 'utf8');
const itrOldProfileRegex = /<div class="mt-auto px-md">[\s\S]*?Senior Tax Associate<\/p>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/aside>/;
itrHtml = itrHtml.replace(itrOldProfileRegex, standardProfile);

// 3. Fix itr.html table headers
const itrOldHeaders = `<thead class="bg-surface-container-highest sticky top-0 z-10">
<tr class="">
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">Client Name</th>
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">User ID</th>
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">Password</th>
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">PAN Card</th>
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">Mobile Number</th>
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">Address</th>
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant text-center">Actions</th>
</tr>
</thead>`;

const standardHeaders = `<thead class="bg-surface-container-highest sticky top-0 z-10">
<tr class="">
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">Client Name</th>
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">User ID</th>
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">Password</th>
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">PAN Card</th>
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">ADDRESS</th>
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">Mobile Number</th>
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">Aadhar Number</th>
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">Status</th>
<th class="px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant text-right">Actions</th>
</tr>
</thead>`;

itrHtml = itrHtml.replace(itrOldHeaders, standardHeaders);
fs.writeFileSync('e:/TaxFlow-Antigravity/itr.html', itrHtml);

console.log("Fixes applied.");
