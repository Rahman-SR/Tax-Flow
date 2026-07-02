const fs = require('fs');
let appJs = fs.readFileSync('e:/TaxFlow-Antigravity/app.js', 'utf8');

// 1. Advanced Filter HTML
const advFilterHTML = `
    // ----- 0.8 Advanced Filters Dropdown -----
    const advFilterDropdownHTML = \`
    <div id="advFilterDropdown" class="absolute w-48 bg-surface-container-highest border border-outline-variant rounded-xl shadow-2xl hidden z-40">
        <div class="p-sm flex flex-col gap-1">
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full">Pending Filings</button>
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full">Overdue Payments</button>
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full">High Priority</button>
        </div>
    </div>
    \`;
    document.body.insertAdjacentHTML('beforeend', advFilterDropdownHTML);
    const advFilterDropdown = document.getElementById('advFilterDropdown');
`;
appJs = appJs.replace(
    "const isDashboardPage =",
    advFilterHTML + "\n    const isDashboardPage ="
);

// 2. Click logic for advanced filters
const advFilterLogic = `
        // Advanced Filters Button
        const advBtn = e.target.closest('button');
        if (advBtn && advBtn.textContent.trim().includes('Advanced Filters')) {
            const rect = advBtn.getBoundingClientRect();
            advFilterDropdown.style.top = (rect.bottom + window.scrollY + 8) + 'px';
            advFilterDropdown.style.left = (rect.right + window.scrollX - 192) + 'px'; // 48 rem = 192px width approx
            advFilterDropdown.classList.toggle('hidden');
            return;
        }

        if (!e.target.closest('#advFilterDropdown') && !(advBtn && advBtn.textContent.trim().includes('Advanced Filters'))) {
            if (advFilterDropdown) advFilterDropdown.classList.add('hidden');
        }
`;
appJs = appJs.replace(
    "// Toggle Password Visibility",
    advFilterLogic + "\n        // Toggle Password Visibility"
);


// 3. Replace the broken Quick Filter toggle logic
const oldFilterLogic = `                filterBtns.forEach(b => {
                    if (['All Clients', 'Individual', 'HUF', 'Company', 'Quarterly', 'Monthly'].includes(b.textContent.trim())) {
                        b.classList.remove('bg-primary', 'text-on-primary', 'rounded-full');
                        b.classList.add('text-on-surface-variant', 'rounded');
                    }
                });
                btn.classList.remove('rounded');
                btn.classList.add('bg-primary', 'text-on-primary', 'rounded-full');
                btn.classList.remove('text-on-surface-variant');`;

const newFilterLogic = `                filterBtns.forEach(b => {
                    if (['All Clients', 'Individual', 'HUF', 'Company', 'Quarterly', 'Monthly'].includes(b.textContent.trim())) {
                        if (isGstPage) {
                            b.className = 'px-md py-1 rounded-full border border-outline-variant text-on-surface-variant font-label-md hover:border-on-surface transition-colors';
                        } else {
                            b.className = 'font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface px-md py-xs';
                        }
                    }
                });
                if (isGstPage) {
                    btn.className = 'px-md py-1 rounded-full border border-primary bg-primary/10 text-primary font-label-md';
                } else {
                    btn.className = 'font-label-sm text-label-sm bg-primary text-on-primary px-md py-xs rounded-full';
                }`;

appJs = appJs.replace(oldFilterLogic, newFilterLogic);

fs.writeFileSync('e:/TaxFlow-Antigravity/app.js', appJs);
console.log('Fixed Advanced Filters and Quick Filter toggles!');
