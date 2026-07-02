const fs = require('fs');

let gstHtml = fs.readFileSync('e:/TaxFlow-Antigravity/gst.html', 'utf8');

// The new main content for gst.html, mirroring itr.html
const newGstMain = `<main class="ml-[260px] p-xl mb-16">
<!-- Dashboard Header & Summary Stats -->
<div class="flex justify-between items-end mb-xl">
    <div>
        <h3 class="font-display text-display text-on-surface mb-xs">GST Client Management</h3>
        <div class="flex items-center gap-lg">
            <div class="flex items-center gap-xs">
                <span class="text-primary font-bold font-display text-headline-md">128</span>
                <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Active Clients</span>
            </div>
            <div class="w-[1px] h-6 bg-outline-variant"></div>
            <div class="flex items-center gap-xs">
                <span class="text-error font-bold font-display text-headline-md">24</span>
                <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Pending Filings</span>
            </div>
        </div>
    </div>
    <button class="bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-bold flex items-center gap-sm hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-red-900/10">
        <span class="material-symbols-outlined" data-icon="person_add">person_add</span>
        <span class="uppercase tracking-tighter">Add New GST Client</span>
    </button>
</div>

<!-- Bento Grid Stats (Subtle) -->
<div class="grid grid-cols-12 gap-gutter mb-xl">
    <div class="col-span-3 bg-surface-container border border-outline-variant p-md rounded-xl hover:border-primary transition-colors cursor-pointer group">
        <div class="flex justify-between items-start mb-sm">
            <span class="material-symbols-outlined text-primary" data-icon="pending_actions">pending_actions</span>
            <span class="text-error font-bold text-label-sm">2 days</span>
        </div>
        <p class="text-on-surface-variant font-label-md mb-base">Overdue Filings</p>
        <h4 class="text-headline-md font-display">24 Clients</h4>
    </div>
    <div class="col-span-3 bg-surface-container border border-outline-variant p-md rounded-xl hover:border-primary transition-colors cursor-pointer">
        <div class="flex justify-between items-start mb-sm">
            <span class="material-symbols-outlined text-primary" data-icon="task_alt">task_alt</span>
            <span class="text-primary font-bold text-label-sm">+4 this month</span>
        </div>
        <p class="text-on-surface-variant font-label-md mb-base">New GST Registrations</p>
        <h4 class="text-headline-md font-display">128 Clients</h4>
    </div>
    <div class="col-span-6 bg-surface-container border border-outline-variant p-md rounded-xl flex items-center justify-between">
        <div>
            <p class="text-on-surface-variant font-label-md mb-base">GSTR-3B Submission Progress</p>
            <h4 class="text-headline-md font-display">20 Aug 2024</h4>
        </div>
        <div class="w-1/2 bg-surface-container-highest h-2 rounded-full overflow-hidden relative">
            <div class="absolute top-0 left-0 h-full bg-primary w-3/4"></div>
        </div>
    </div>
</div>

<!-- Data Table Container -->
<section class="bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-2xl">
    <div class="p-md border-b border-outline-variant bg-surface-container-high flex justify-between items-center">
        <div class="flex gap-md">
            <button class="font-label-sm text-label-sm bg-primary text-on-primary px-md py-xs rounded-full">All Clients</button>
            <button class="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface px-md py-xs">Quarterly</button>
            <button class="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface px-md py-xs">Monthly</button>
        </div>
        <div class="flex items-center gap-sm">
            <span class="font-label-sm text-label-sm text-on-surface-variant">Sort by:</span>
            <select class="bg-surface-container-lowest border-outline-variant rounded py-1 px-3 text-label-sm font-label-sm focus:ring-1 focus:ring-primary outline-none">
                <option>Name (A-Z)</option>
                <option>Status</option>
                <option>Filing Date</option>
            </select>
            <button class="flex items-center gap-xs text-on-surface-variant hover:text-on-surface transition-colors ml-sm">
                <span class="material-symbols-outlined text-[18px]" data-icon="filter_list">filter_list</span>
                <span class="font-label-sm text-label-sm">Advanced</span>
            </button>
        </div>
    </div>
    <div class="overflow-x-auto">
`;

// Extract everything from <table ... > onwards in the original gst.html
const tableIndex = gstHtml.indexOf('<table');
const tableContent = gstHtml.substring(tableIndex, gstHtml.indexOf('</main>'));

gstHtml = gstHtml.replace(/<main[\s\S]*?<table/, newGstMain + '<table');

// Fix closing wrapper for the new section
gstHtml = gstHtml.replace('</main>', '</section>\n</main>');

fs.writeFileSync('e:/TaxFlow-Antigravity/gst.html', gstHtml);
console.log('gst.html layout updated');
