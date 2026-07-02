const fs = require('fs');

const files = [
    'e:/TaxFlow-Antigravity/index.html',
    'e:/TaxFlow-Antigravity/gst.html',
    'e:/TaxFlow-Antigravity/itr.html',
    'e:/TaxFlow-Antigravity/reports.html',
    'e:/TaxFlow-Antigravity/test.html'
];

const standardHeaderInner = `
<div class="flex items-center gap-xl flex-grow">
    <h2 class="font-display text-headline-md font-black text-primary dark:text-primary whitespace-nowrap">TaxFlow Dashboard</h2>
    <div class="relative w-full max-w-md">
        <span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50" data-icon="search">search</span>
        <input class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-xs pl-xl pr-md text-body-md font-body-md focus:border-primary transition-all outline-none" placeholder="Search client by PAN, Name or UID..." type="text">
    </div>
</div>
<div class="flex items-center gap-lg">
    <div class="flex items-center gap-md">
        <button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95" data-icon="notifications">notifications</button>
        <button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95" data-icon="help">help</button>
    </div>
    <div class="h-8 w-[1px] bg-outline-variant"></div>
    <div class="flex items-center gap-md">
        <span class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary cursor-pointer transition-colors">Profile</span>
        <button class="bg-error text-on-error px-md py-1 rounded font-label-sm font-bold cursor-pointer active:scale-95 transition-transform flex items-center gap-1" data-auth-action="logout">
            Logout <span class="material-symbols-outlined text-[14px]">logout</span>
        </button>
    </div>
</div>
`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let html = fs.readFileSync(file, 'utf8');
    
    // 1. Unify Header Inner HTML
    html = html.replace(/<header([^>]*)>[\s\S]*?<\/header>/g, (match, attrs) => {
        return `<header${attrs}>\n${standardHeaderInner}\n</header>`;
    });
    
    // 2. Unify Sidebar Active styling (change from pink border to solid grey)
    const oldActiveClasses = 'flex items-center gap-md px-md py-sm border-l-4 border-primary bg-secondary-container text-on-secondary-container font-bold transition-all duration-200';
    const newActiveClasses = 'flex items-center gap-md px-md py-sm bg-surface-variant text-on-surface font-bold transition-all duration-200';
    
    html = html.replace(new RegExp(oldActiveClasses.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), newActiveClasses);
    
    fs.writeFileSync(file, html);
});

console.log('Unification applied across all HTML files');
