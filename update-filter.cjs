const fs = require('fs');

let appJs = fs.readFileSync('e:/TaxFlow-Antigravity/app.js', 'utf8');

const filterCode = `
    // ----- 0.6 Filter Logic -----
    const filterHTML = \`
    <div id="filterDropdown" class="absolute w-48 bg-surface-container-highest border border-outline-variant rounded-xl shadow-2xl hidden z-40">
        <div class="p-sm flex flex-col gap-1">
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md" data-filter="ALL">All Activity</button>
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md" data-filter="GST">GST Only</button>
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md" data-filter="ITR">ITR Only</button>
        </div>
    </div>
    \`;
    document.body.insertAdjacentHTML('beforeend', filterHTML);
    const filterDropdown = document.getElementById('filterDropdown');
`;

appJs = appJs.replace(
    "const isDashboardPage =",
    filterCode + "\n    const isDashboardPage ="
);

const filterClickHandler = `
        // Dashboard Filter Button
        const filterBtn = e.target.closest('button');
        if (filterBtn && filterBtn.textContent.trim().includes('Filter') && isDashboardPage) {
            const rect = filterBtn.getBoundingClientRect();
            filterDropdown.style.top = (rect.bottom + window.scrollY + 8) + 'px';
            filterDropdown.style.left = (rect.left + window.scrollX) + 'px'; 
            filterDropdown.classList.toggle('hidden');
            return;
        }
        
        // Filter Dropdown Options
        const filterOption = e.target.closest('[data-filter]');
        if (filterOption) {
            const type = filterOption.dataset.filter;
            if (type === 'ALL') {
                renderDashboardTable(allClients);
            } else {
                renderDashboardTable(allClients.filter(c => c._type === type));
            }
            filterDropdown.classList.add('hidden');
            return;
        }

        // Hide filter dropdown if clicking outside
        if (!e.target.closest('#filterDropdown') && !(filterBtn && filterBtn.textContent.trim().includes('Filter'))) {
            if (filterDropdown) filterDropdown.classList.add('hidden');
        }
`;

appJs = appJs.replace(
    "// Toggle Password Visibility",
    filterClickHandler + "\n        // Toggle Password Visibility"
);

fs.writeFileSync('e:/TaxFlow-Antigravity/app.js', appJs);
console.log("Updated app.js with filter successfully!");
