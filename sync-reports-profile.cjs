const fs = require('fs');

const files = [
    'e:/TaxFlow-Antigravity/reports.html',
    'e:/TaxFlow-Antigravity/test.html'
];

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
    if (!fs.existsSync(file)) return;
    
    let html = fs.readFileSync(file, 'utf8');
    
    // Replace Agent profile block for reports/test.html style
    const oldProfileRegex = /<div class="mt-auto px-md pt-lg border-t border-outline-variant">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
    html = html.replace(oldProfileRegex, standardProfileHTML.trim());
    
    fs.writeFileSync(file, html);
});

console.log('Profile HTML synced for reports and test pages');
