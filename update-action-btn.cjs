const fs = require('fs');

let appJs = fs.readFileSync('e:/TaxFlow-Antigravity/app.js', 'utf8');

// 1. Inject action dropdown HTML
const actionDropdownHTML = `
    // ----- 0.7 Action Dropdown -----
    const actionHTML = \`
    <div id="actionDropdown" class="absolute w-32 bg-surface-container-highest border border-outline-variant rounded-xl shadow-2xl hidden z-40">
        <div class="p-xs flex flex-col gap-1">
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full flex items-center gap-2" id="actionViewBtn">
                <span class="material-symbols-outlined text-[16px]">visibility</span> View
            </button>
            <button class="text-left px-sm py-2 hover:bg-error-container rounded text-error font-label-md w-full flex items-center gap-2" id="actionDeleteBtn">
                <span class="material-symbols-outlined text-[16px]">delete</span> Delete
            </button>
        </div>
    </div>
    \`;
    document.body.insertAdjacentHTML('beforeend', actionHTML);
    const actionDropdown = document.getElementById('actionDropdown');
    let currentActionTarget = null;
`;
appJs = appJs.replace(
    "const isDashboardPage =",
    actionDropdownHTML + "\n    const isDashboardPage ="
);

// 2. Update renderDashboardTable to include data attributes and class
appJs = appJs.replace(
    "tr.className = 'hover:bg-surface-variant/50 transition-colors';",
    "tr.className = 'hover:bg-surface-variant/50 transition-colors';\n            tr.dataset.id = client.id;\n            tr.dataset.table = client._table;\n            tr.dataset.type = client._type;"
);

appJs = appJs.replace(
    '<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_vert</button>',
    '<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors dash-action-btn">more_vert</button>'
);

// 3. Add click logic for action button and dropdown options
const actionClickLogic = `
        // Dashboard Action Button (more_vert)
        const actionBtn = e.target.closest('.dash-action-btn');
        if (actionBtn && isDashboardPage) {
            const rect = actionBtn.getBoundingClientRect();
            actionDropdown.style.top = (rect.bottom + window.scrollY + 4) + 'px';
            actionDropdown.style.left = (rect.left + window.scrollX - 80) + 'px'; 
            actionDropdown.classList.toggle('hidden');
            currentActionTarget = actionBtn.closest('tr');
            return;
        }

        // Action Dropdown Options
        if (e.target.closest('#actionViewBtn')) {
            if (currentActionTarget) {
                const type = currentActionTarget.dataset.type;
                window.location.href = type === 'GST' ? 'gst.html' : 'itr.html';
            }
            actionDropdown.classList.add('hidden');
            return;
        }

        if (e.target.closest('#actionDeleteBtn')) {
            if (currentActionTarget) {
                const id = currentActionTarget.dataset.id;
                const table = currentActionTarget.dataset.table;
                if (confirm('Are you sure you want to delete this recent activity client?')) {
                    const { error } = await supabase.from(table).delete().eq('id', id);
                    if (error) alert('Error deleting: ' + error.message);
                    else {
                        currentActionTarget.remove();
                        // Refetch to keep state synced
                        fetchClients();
                    }
                }
            }
            actionDropdown.classList.add('hidden');
            return;
        }

        // Hide action dropdown if clicking outside
        if (!e.target.closest('#actionDropdown') && !e.target.closest('.dash-action-btn')) {
            if (actionDropdown) actionDropdown.classList.add('hidden');
        }
`;

appJs = appJs.replace(
    "// Toggle Password Visibility",
    actionClickLogic + "\n        // Toggle Password Visibility"
);

fs.writeFileSync('e:/TaxFlow-Antigravity/app.js', appJs);
console.log("Updated app.js with action dropdown successfully!");
