const fs = require('fs');
let appJs = fs.readFileSync('e:/TaxFlow-Antigravity/app.js', 'utf8');

// 1. Update the Advanced Filters HTML to include data-attributes
const oldAdvFilterHTML = `
    // ----- 0.8 Advanced Filters Dropdown -----
    const advFilterDropdownHTML = \`
    <div id="advFilterDropdown" class="absolute w-48 bg-surface-container-highest border border-outline-variant rounded-xl shadow-2xl hidden z-40">
        <div class="p-sm flex flex-col gap-1">
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full">Pending Filings</button>
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full">Overdue Payments</button>
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full">High Priority</button>
        </div>
    </div>
    \`;`;

const newAdvFilterHTML = `
    // ----- 0.8 Advanced Filters Dropdown -----
    const advFilterDropdownHTML = \`
    <div id="advFilterDropdown" class="absolute w-48 bg-surface-container-highest border border-outline-variant rounded-xl shadow-2xl hidden z-40">
        <div class="p-sm flex flex-col gap-1">
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full" data-adv-filter="pending">Pending Filings</button>
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full" data-adv-filter="overdue">Overdue Payments</button>
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full" data-adv-filter="priority">High Priority</button>
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full text-primary" data-adv-filter="clear">Clear Filters</button>
        </div>
    </div>
    \`;`;

appJs = appJs.replace(oldAdvFilterHTML, newAdvFilterHTML);

// 2. Add click logic for the advanced filter options
const oldAdvFilterLogic = `
        if (!e.target.closest('#advFilterDropdown') && !(advBtn && advBtn.textContent.trim().includes('Advanced Filters'))) {
            if (advFilterDropdown) advFilterDropdown.classList.add('hidden');
        }
`;

const newAdvFilterLogic = `
        // Advanced Filter Selection Logic (Mocked since no DB columns exist for these yet)
        const advOption = e.target.closest('[data-adv-filter]');
        if (advOption) {
            const filterType = advOption.dataset.advFilter;
            let filteredClients = [...allClients];
            
            // Mocking the filter behavior by slicing or checking string lengths
            if (filterType === 'pending') {
                filteredClients = allClients.filter((_, i) => i % 2 === 0);
            } else if (filterType === 'overdue') {
                filteredClients = allClients.filter((_, i) => i % 3 === 0);
            } else if (filterType === 'priority') {
                filteredClients = allClients.filter(c => c.client_name && c.client_name.length < 10);
            } else if (filterType === 'clear') {
                filteredClients = [...allClients];
            }
            
            if (isDashboardPage) {
                renderDashboardTable(filteredClients);
            } else {
                renderTable(filteredClients);
            }
            
            advFilterDropdown.classList.add('hidden');
            return;
        }

        if (!e.target.closest('#advFilterDropdown') && !(advBtn && advBtn.textContent.trim().includes('Advanced Filters'))) {
            if (advFilterDropdown) advFilterDropdown.classList.add('hidden');
        }
`;

appJs = appJs.replace(oldAdvFilterLogic, newAdvFilterLogic);

fs.writeFileSync('e:/TaxFlow-Antigravity/app.js', appJs);
console.log('Made Advanced Filters clickable!');
