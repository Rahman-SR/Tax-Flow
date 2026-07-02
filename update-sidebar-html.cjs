const fs = require('fs');

const files = ['e:/TaxFlow-Antigravity/index.html', 'e:/TaxFlow-Antigravity/gst.html', 'e:/TaxFlow-Antigravity/itr.html'];

const standardProfileHTML = `
<div class="px-md mt-auto pt-lg border-t border-outline-variant flex items-center gap-md mb-md">
    <div class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-lg logged-in-user-initials">JD</div>
    <div>
        <p class="font-label-md font-bold text-on-surface logged-in-user-name">John Doe</p>
        <p class="text-[10px] text-on-surface-variant">Lead Tax Agent</p>
    </div>
</div>
`;

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    
    // 1. Remove mt-auto from Settings
    html = html.replace('transition-colors transition-all duration-200 mt-auto" href="#"', 'transition-colors transition-all duration-200" href="#"');
    html = html.replace('mt-auto px-md py-sm', 'px-md py-sm');
    
    // Some pages might not have the mt-auto there, let's just do a generic replace
    html = html.replace(/<a class="([^"]*)mt-auto([^"]*)" href="#"/g, '<a class="$1$2" href="#"');
    
    // 2. Replace Agent profile block
    const oldProfileRegex = /<div class="px-md mt-auto pt-lg border-t border-outline-variant flex items-center gap-md">[\s\S]*?<\/div>\s*<\/div>/;
    html = html.replace(oldProfileRegex, standardProfileHTML.trim());
    
    // Also remove the extra <aside> closing that might have been left over if we matched too broadly
    html = html.replace('</aside>\n</aside>', '</aside>');
    
    fs.writeFileSync(file, html);
});

console.log('HTML files updated');
