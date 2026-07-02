const fs = require('fs');

let itrHtml = fs.readFileSync('e:/TaxFlow-Antigravity/itr.html', 'utf8');

const standardHeaders = `<thead class="bg-surface-container-highest sticky top-0 z-10">
<tr>
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

// Replace everything between <thead...> and </thead>
itrHtml = itrHtml.replace(/<thead[\s\S]*?<\/thead>/, standardHeaders);

fs.writeFileSync('e:/TaxFlow-Antigravity/itr.html', itrHtml);
console.log('Headers fixed for itr.html');
