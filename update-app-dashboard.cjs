const fs = require('fs');

let appJs = fs.readFileSync('e:/TaxFlow-Antigravity/app.js', 'utf8');

// 1. Add notification logic
const notifCode = `
    // ----- 0.5 Notification Logic -----
    const notifHTML = \`
    <div id="notifDropdown" class="absolute top-16 right-4 w-80 bg-surface-container-highest border border-outline-variant rounded-xl shadow-2xl hidden z-50">
        <div class="p-md border-b border-outline-variant flex justify-between items-center">
            <h3 class="font-label-lg font-bold text-on-surface">Notifications</h3>
            <span class="text-xs text-primary cursor-pointer hover:underline">Mark all read</span>
        </div>
        <div class="p-md flex flex-col gap-sm max-h-64 overflow-y-auto">
            <div class="p-sm bg-error-container text-on-error-container rounded-lg border border-error">
                <p class="font-label-sm font-bold flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">warning</span> URGENT DEADLINE</p>
                <p class="text-xs mt-1">GST Monthly Return (GSTR-3B) for Q3 is due in 3 days. 42 clients pending.</p>
            </div>
            <div class="p-sm bg-surface-variant text-on-surface-variant rounded-lg">
                <p class="font-label-sm font-bold flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">check_circle</span> SUCCESS</p>
                <p class="text-xs mt-1">12 ITR filings were successfully submitted today.</p>
            </div>
        </div>
    </div>
    \`;
    document.body.insertAdjacentHTML('beforeend', notifHTML);
    const notifDropdown = document.getElementById('notifDropdown');
`;
appJs = appJs.replace("let currentSession = null;", notifCode + "\n    let currentSession = null;");

// 2. Add isDashboardPage and update fetch check
appJs = appJs.replace(
    "const isGstPage = window.location.pathname.includes('gst.html');",
    "const isDashboardPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.includes('#');\n    const isGstPage = window.location.pathname.includes('gst.html');"
);
appJs = appJs.replace(
    "if (tableName && allClients.length === 0) fetchClients();",
    "if ((tableName || isDashboardPage) && allClients.length === 0) fetchClients();"
);

// 3. Update Modal HTML to include Client Type if dashboard
const clientTypeDropdown = `
                \${isDashboardPage ? \`
                <div class="col-span-2">
                    <label class="block font-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">Client Type</label>
                    <select id="clientTypeSelect" class="w-full bg-surface-dim border border-outline-variant rounded-lg px-md py-2 text-on-surface focus:border-primary outline-none">
                        <option value="gst_clients">GST Client</option>
                        <option value="itr_clients">ITR Client</option>
                    </select>
                </div>
                \` : ''}`;
appJs = appJs.replace('<form id="addClientForm" class="grid grid-cols-2 gap-md">', '<form id="addClientForm" class="grid grid-cols-2 gap-md">' + clientTypeDropdown);

// 4. Overwrite fetchClients to handle dashboard
const newFetchClients = `
    // ----- 3. Fetch Data from Supabase -----
    const fetchClients = async (searchTerm = '') => {
        if (!tbody || !currentSession) return;
        
        let finalData = [];
        
        if (isDashboardPage) {
            let q1 = supabase.from('gst_clients').select('*');
            let q2 = supabase.from('itr_clients').select('*');
            
            if (searchTerm) {
                const searchStr = \`client_name.ilike.%\${searchTerm}%,pan_card.ilike.%\${searchTerm}%,user_id.ilike.%\${searchTerm}%\`;
                q1 = q1.or(searchStr);
                q2 = q2.or(searchStr);
            }
            
            const [res1, res2] = await Promise.all([q1, q2]);
            if (res1.error || res2.error) {
                console.error("Error fetching dashboard data");
                tbody.innerHTML = \`<tr><td colspan="6" class="text-center py-xl text-error font-body-md">Failed to load data.</td></tr>\`;
                return;
            }
            const gsts = res1.data.map(c => ({...c, _type: 'GST', _table: 'gst_clients'}));
            const itrs = res2.data.map(c => ({...c, _type: 'ITR', _table: 'itr_clients'}));
            finalData = [...gsts, ...itrs].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (tableName) {
            let query = supabase.from(tableName).select('*').order('created_at', { ascending: false });
            if (searchTerm) {
                query = query.or(\`client_name.ilike.%\${searchTerm}%,pan_card.ilike.%\${searchTerm}%,user_id.ilike.%\${searchTerm}%\`);
            }
            const { data, error } = await query;
            if (error) {
                console.error('Error fetching clients:', error);
                tbody.innerHTML = \`<tr><td colspan="10" class="text-center py-xl text-error font-body-md">Failed to load data.</td></tr>\`;
                return;
            }
            finalData = data;
        }

        allClients = finalData;
        if (isDashboardPage) {
            renderDashboardTable(allClients);
        } else {
            renderTable(allClients);
        }
    };
`;

appJs = appJs.replace(/\/\/ ----- 3\. Fetch Data from Supabase -----[\s\S]*?\/\/ ----- 4\. Render Table -----/, newFetchClients + '\n    // ----- 4. Render Table -----');

// 5. Add renderDashboardTable function before renderTable
const dashboardRender = `
    const renderDashboardTable = (clients) => {
        if (!tbody) return;
        tbody.innerHTML = '';
        
        if (clients.length === 0) {
            tbody.innerHTML = \`<tr><td colspan="6" class="text-center py-xl text-on-surface-variant font-body-md">No recent activity found.</td></tr>\`;
            return;
        }

        // Show max 10 recent
        clients.slice(0, 10).forEach(client => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-surface-variant/50 transition-colors';
            
            const initial = client.client_name ? client.client_name.charAt(0).toUpperCase() : '?';
            const typeBadgeColor = client._type === 'GST' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface';

            tr.innerHTML = \`
                <td class="px-lg py-md">
                    <div class="flex items-center gap-sm">
                        <div class="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-xs text-on-surface-variant">\${initial}</div>
                        <p class="font-body-md font-bold text-on-surface">\${client.client_name}</p>
                    </div>
                </td>
                <td class="px-lg py-md font-body-md font-mono text-on-surface-variant">\${client.user_id}</td>
                <td class="px-lg py-md">
                    <span class="inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider \${typeBadgeColor}">\${client._type}</span>
                </td>
                <td class="px-lg py-md font-body-sm text-on-surface-variant">Profile Created</td>
                <td class="px-lg py-md">
                    <div class="flex items-center gap-1 text-primary">
                        <span class="material-symbols-outlined text-[14px]">check_circle</span>
                        <span class="font-body-sm">Active</span>
                    </div>
                </td>
                <td class="px-lg py-md text-right">
                    <button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_vert</button>
                </td>
            \`;
            tbody.appendChild(tr);
        });
    };
`;
appJs = appJs.replace('// ----- 4. Render Table -----', dashboardRender + '\n    // ----- 4. Render Table -----');

// 6. Update Form Submission to handle dashboard client type select
appJs = appJs.replace(
    'const { data, error } = await supabase.from(tableName).insert([payload]);',
    'const targetTable = isDashboardPage ? document.getElementById("clientTypeSelect").value : tableName;\n        const { data, error } = await supabase.from(targetTable).insert([payload]);'
);

// 7. Add notification bell click handler and search handling
const globalClicks = `
        // Notification bell
        const notifBtn = e.target.closest('button[data-icon="notifications"]');
        if (notifBtn) {
            notifDropdown.classList.toggle('hidden');
            return;
        }
        // Hide notif if clicking outside
        if (!e.target.closest('#notifDropdown') && !e.target.closest('button[data-icon="notifications"]')) {
            notifDropdown.classList.add('hidden');
        }
`;
appJs = appJs.replace(
    '// Toggle Password Visibility',
    globalClicks + '\n        // Toggle Password Visibility'
);

fs.writeFileSync('e:/TaxFlow-Antigravity/app.js', appJs);
console.log("Updated app.js successfully!");
