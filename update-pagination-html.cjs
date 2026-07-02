const fs = require('fs');

// GST HTML
let gstHtml = fs.readFileSync('e:/TaxFlow-Antigravity/gst.html', 'utf8');
gstHtml = gstHtml.replace(
    '<span class="font-label-md text-on-surface-variant">Showing 1 to 4 of 128 clients</span>',
    '<span class="font-label-md text-on-surface-variant" id="paginationInfo">Showing 0 of 0 clients</span>'
);
gstHtml = gstHtml.replace(
    '<div class="flex gap-xs">\n                    <button class="p-2 border',
    '<div class="flex gap-xs" id="paginationControls">\n                    <button class="p-2 border'
);
fs.writeFileSync('e:/TaxFlow-Antigravity/gst.html', gstHtml);

// ITR HTML
let itrHtml = fs.readFileSync('e:/TaxFlow-Antigravity/itr.html', 'utf8');
itrHtml = itrHtml.replace(
    '<span class="font-label-sm text-label-sm text-on-surface-variant">Showing 1 to 4 of 142 clients</span>',
    '<span class="font-label-sm text-label-sm text-on-surface-variant" id="paginationInfo">Showing 0 of 0 clients</span>'
);
itrHtml = itrHtml.replace(
    '<div class="flex gap-base">\n<button class="w-8 h-8 flex',
    '<div class="flex gap-base" id="paginationControls">\n<button class="w-8 h-8 flex'
);
fs.writeFileSync('e:/TaxFlow-Antigravity/itr.html', itrHtml);

console.log('Added pagination IDs to HTML files');
