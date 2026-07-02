import { supabase } from './supabaseClient.js';
import html2pdf from 'html2pdf.js';

document.addEventListener('DOMContentLoaded', () => {
    // ----- 0. Authentication Logic -----
    const authModalHTML = `
    <div id="authModal" class="fixed inset-0 bg-black/60 hidden z-[60] flex items-center justify-center backdrop-blur-sm">
        <div class="bg-surface-container border border-outline-variant rounded-xl w-full max-w-sm p-xl shadow-2xl">
            <h2 class="font-display text-headline-md text-on-surface mb-md">Authentication</h2>
            <form id="authForm" class="flex flex-col gap-md">
                <div>
                    <label class="block font-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">Email</label>
                    <input type="email" id="authEmail" required class="w-full bg-surface-dim border border-outline-variant rounded-lg px-md py-2 text-on-surface focus:border-primary outline-none">
                </div>
                <div>
                    <label class="block font-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">Password</label>
                    <input type="password" id="authPassword" required class="w-full bg-surface-dim border border-outline-variant rounded-lg px-md py-2 text-on-surface focus:border-primary outline-none">
                </div>
                <div class="flex justify-end gap-sm mt-lg">
                    <button type="button" id="signUpBtn" class="px-md py-2 font-label-md text-primary hover:text-primary-container transition-colors">Sign Up</button>
                    <button type="submit" id="signInBtn" class="bg-primary-container text-on-primary-container px-lg py-2 font-label-md font-bold rounded hover:opacity-90 transition-opacity">Login</button>
                </div>
            </form>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', authModalHTML);
    const authModal = document.getElementById('authModal');

    
    // ----- 0.5 Notification Logic -----
    const notifHTML = `
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
    `;
    document.body.insertAdjacentHTML('beforeend', notifHTML);
    const notifDropdown = document.getElementById('notifDropdown');

    let currentSession = null;
    const updateAuthUI = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        currentSession = session;
        const authBtns = document.querySelectorAll('button');
        authBtns.forEach(btn => {
            const txt = btn.textContent.trim().toUpperCase();
            if (txt.includes('LOGIN') || txt.includes('LOGOUT')) {
                if (session) {
                    btn.innerHTML = `Logout <span class="material-symbols-outlined text-sm" data-icon="logout">logout</span>`;
                    btn.dataset.authAction = "logout";
                } else {
                    btn.innerHTML = `Login <span class="material-symbols-outlined text-sm" data-icon="login">login</span>`;
                    btn.dataset.authAction = "login";
                }
            }
        });

        // Enforce login wall
        if (!session) {
            authModal.classList.remove('hidden');
        } else {
            authModal.classList.add('hidden');
            // Fetch clients if on a data page and not already fetched
            if ((tableName || isDashboardPage) && allClients.length === 0) fetchClients();
            
            // Update User Profile UI
            if (session.user && session.user.email) {
                const emailPrefix = session.user.email.split('@')[0];
                const displayName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
                const initials = emailPrefix.substring(0, 2).toUpperCase();
                
                document.querySelectorAll('.logged-in-user-name').forEach(el => el.textContent = displayName);
                document.querySelectorAll('.logged-in-user-initials').forEach(el => el.textContent = initials);
            }
        }
    };
    updateAuthUI();
    supabase.auth.onAuthStateChange(() => {
        updateAuthUI();
    });

    document.getElementById('authForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        else {
            authModal.classList.add('hidden');
            document.getElementById('authForm').reset();
        }
    });

    document.getElementById('signUpBtn').addEventListener('click', async () => {
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        if (!email || !password) return alert('Enter email and password');
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) alert(error.message);
        else alert('Sign up successful! Please log in.');
    });

    
    // ----- 0.6 Filter Logic -----
    const filterHTML = `
    <div id="filterDropdown" class="absolute w-48 bg-surface-container-highest border border-outline-variant rounded-xl shadow-2xl hidden z-40">
        <div class="p-sm flex flex-col gap-1">
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md" data-filter="ALL">All Activity</button>
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md" data-filter="GST">GST Only</button>
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md" data-filter="ITR">ITR Only</button>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', filterHTML);
    const filterDropdown = document.getElementById('filterDropdown');

    
    // ----- 0.7 Action Dropdown -----
    const actionHTML = `
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
    `;
    document.body.insertAdjacentHTML('beforeend', actionHTML);
    const actionDropdown = document.getElementById('actionDropdown');
    let currentActionTarget = null;

    
    // ----- 0.8 Advanced Filters Dropdown -----
    const advFilterDropdownHTML = `
    <div id="advFilterDropdown" class="absolute w-48 bg-surface-container-highest border border-outline-variant rounded-xl shadow-2xl hidden z-40">
        <div class="p-sm flex flex-col gap-1">
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full" data-adv-filter="pending">Pending Filings</button>
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full" data-adv-filter="overdue">Overdue Payments</button>
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full" data-adv-filter="priority">High Priority</button>
            <button class="text-left px-sm py-2 hover:bg-surface-variant rounded text-on-surface font-label-md w-full text-primary" data-adv-filter="clear">Clear Filters</button>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', advFilterDropdownHTML);
    const advFilterDropdown = document.getElementById('advFilterDropdown');

    const isDashboardPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.includes('#');
    const isGstPage = window.location.pathname.includes('gst.html');
    const isItrPage = window.location.pathname.includes('itr.html');
    const tableName = isGstPage ? 'gst_clients' : (isItrPage ? 'itr_clients' : null);

    let allClients = [];
    let currentFilteredClients = [];
let currentPage = 1;
    const itemsPerPage = 10;

    // ----- 1. Setup UI Elements -----
    const tbody = document.querySelector('tbody');
    const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="Search"]');
    
    // Inject Loading state if tbody exists
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center py-xl text-on-surface-variant font-body-md">Loading clients...</td></tr>`;
    }

    // ----- 2. Add Client Modal Logic -----
    // (Ensure it handles both pages correctly and writes to Supabase)
    const modalHTML = `
    <div id="addClientModal" class="fixed inset-0 bg-black/60 hidden z-50 flex items-center justify-center backdrop-blur-sm">
        <div class="bg-surface-container border border-outline-variant rounded-xl w-full max-w-2xl p-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 class="font-display text-headline-md text-on-surface mb-md">Add New Client</h2>
            <form id="addClientForm" class="grid grid-cols-2 gap-md">
                ${isDashboardPage ? `
                <div class="col-span-2">
                    <label class="block font-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">Client Type</label>
                    <select id="clientTypeSelect" class="w-full bg-surface-dim border border-outline-variant rounded-lg px-md py-2 text-on-surface focus:border-primary outline-none">
                        <option value="gst_clients">GST Client</option>
                        <option value="itr_clients">ITR Client</option>
                    </select>
                </div>
                ` : ''}
                <div class="col-span-2 sm:col-span-1">
                    <label class="block font-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">Client Name</label>
                    <input type="text" id="clientName" required class="w-full bg-surface-dim border border-outline-variant rounded-lg px-md py-2 text-on-surface focus:border-primary outline-none">
                </div>
                <div class="col-span-2 sm:col-span-1">
                    <label class="block font-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">User ID</label>
                    <input type="text" id="userId" required class="w-full bg-surface-dim border border-outline-variant rounded-lg px-md py-2 text-on-surface focus:border-primary outline-none">
                </div>
                <div class="col-span-2 sm:col-span-1">
                    <label class="block font-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">Password</label>
                    <input type="password" id="clientPassword" required class="w-full bg-surface-dim border border-outline-variant rounded-lg px-md py-2 text-on-surface focus:border-primary outline-none">
                </div>
                <div class="col-span-2 sm:col-span-1">
                    <label class="block font-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">PAN Card</label>
                    <input type="text" id="panCard" required class="w-full bg-surface-dim border border-outline-variant rounded-lg px-md py-2 text-on-surface focus:border-primary outline-none">
                </div>
                <div class="col-span-2 sm:col-span-1">
                    <label class="block font-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">Mobile Number</label>
                    <input type="text" id="mobileNum" required class="w-full bg-surface-dim border border-outline-variant rounded-lg px-md py-2 text-on-surface focus:border-primary outline-none">
                </div>
                <div class="col-span-2 sm:col-span-1">
                    <label class="block font-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">Aadhar Number</label>
                    <input type="text" id="aadharNum" class="w-full bg-surface-dim border border-outline-variant rounded-lg px-md py-2 text-on-surface focus:border-primary outline-none">
                </div>
                <div class="col-span-2">
                    <label class="block font-label-sm text-on-surface-variant mb-xs uppercase tracking-wider">Address</label>
                    <input type="text" id="clientAddress" required class="w-full bg-surface-dim border border-outline-variant rounded-lg px-md py-2 text-on-surface focus:border-primary outline-none">
                </div>
                <div class="col-span-2 flex justify-end gap-sm mt-lg">
                    <button type="button" id="closeModalBtn" class="px-md py-2 font-label-md text-on-surface-variant hover:text-on-surface transition-colors">Cancel</button>
                    <button type="submit" id="saveClientBtn" class="bg-primary-container text-on-primary-container px-lg py-2 font-label-md font-bold rounded hover:opacity-90 transition-opacity flex items-center gap-2">Save Client</button>
                </div>
            </form>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // ----- 2.5 Settings Modal Logic -----
    const settingsModalHTML = `
    <div id="settingsModal" class="fixed inset-0 bg-black/60 hidden z-50 flex items-center justify-center backdrop-blur-sm">
        <div class="bg-surface-container border border-outline-variant rounded-xl w-full max-w-md p-xl shadow-2xl">
            <div class="flex justify-between items-center mb-md">
                <h2 class="font-display text-headline-md text-on-surface">Settings</h2>
                <button id="closeSettingsBtn" class="text-on-surface-variant hover:text-on-surface transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <div class="flex flex-col gap-md mt-lg">
                <!-- Theme Toggle -->
                <div class="flex items-center justify-between p-md border border-outline-variant rounded-lg bg-surface-dim">
                    <div>
                        <p class="font-label-md font-bold text-on-surface">Dark Mode</p>
                        <p class="text-xs text-on-surface-variant">Switch to a darker theme</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="darkModeToggle" class="sr-only peer">
                        <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>

                <!-- Notifications Toggle -->
                <div class="flex items-center justify-between p-md border border-outline-variant rounded-lg bg-surface-dim">
                    <div>
                        <p class="font-label-md font-bold text-on-surface">Email Alerts</p>
                        <p class="text-xs text-on-surface-variant">Get notified of pending filings</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="darkModeToggle" class="sr-only peer">
                        <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                
                <hr class="border-outline-variant my-sm">
                
                <button class="w-full py-2 bg-error/10 text-error font-label-md font-bold rounded-lg border border-error hover:bg-error/20 transition-colors" data-auth-action="logout">
                    Logout of TaxFlow
                </button>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', settingsModalHTML);
    const settingsModal = document.getElementById('settingsModal');
    
    document.getElementById('closeSettingsBtn').addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });


    const modal = document.getElementById('addClientModal');
    const form = document.getElementById('addClientForm');
    
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    
    // ----- 3. Fetch Data from Supabase -----
    const fetchClients = async (searchTerm = '') => {
        if (!tbody || !currentSession) return;
        
        let finalData = [];
        
        if (isDashboardPage) {
            let q1 = supabase.from('gst_clients').select('*');
            let q2 = supabase.from('itr_clients').select('*');
            
            if (searchTerm) {
                const searchStr = `client_name.ilike.%${searchTerm}%,pan_card.ilike.%${searchTerm}%,user_id.ilike.%${searchTerm}%`;
                q1 = q1.or(searchStr);
                q2 = q2.or(searchStr);
            }
            
            const [res1, res2] = await Promise.all([q1, q2]);
            if (res1.error || res2.error) {
                console.error("Error fetching dashboard data");
                tbody.innerHTML = `<tr><td colspan="6" class="text-center py-xl text-error font-body-md">Failed to load data.</td></tr>`;
                return;
            }
            const gsts = res1.data.map(c => ({...c, _type: 'GST', _table: 'gst_clients'}));
            const itrs = res2.data.map(c => ({...c, _type: 'ITR', _table: 'itr_clients'}));
            finalData = [...gsts, ...itrs].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (tableName) {
            let query = supabase.from(tableName).select('*').order('created_at', { ascending: false });
            if (searchTerm) {
                query = query.or(`client_name.ilike.%${searchTerm}%,pan_card.ilike.%${searchTerm}%,user_id.ilike.%${searchTerm}%`);
            }
            const { data, error } = await query;
            if (error) {
                console.error('Error fetching clients:', error);
                tbody.innerHTML = `<tr><td colspan="10" class="text-center py-xl text-error font-body-md">Failed to load data.</td></tr>`;
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

    
    const renderDashboardTable = (clients) => {
        if (!tbody) return;
        tbody.innerHTML = '';
        
        if (clients.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-xl text-on-surface-variant font-body-md">No recent activity found.</td></tr>`;
            return;
        }

        // Show max 10 recent
        clients.slice(0, 10).forEach(client => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-surface-variant/50 transition-colors';
            tr.dataset.id = client.id;
            tr.dataset.table = client._table;
            tr.dataset.type = client._type;
            
            const initial = client.client_name ? client.client_name.charAt(0).toUpperCase() : '?';
            const typeBadgeColor = client._type === 'GST' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface';

            tr.innerHTML = `
                <td class="px-lg py-md">
                    <div class="flex items-center gap-sm">
                        <div class="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-xs text-on-surface-variant">${initial}</div>
                        <p class="font-body-md font-bold text-on-surface">${client.client_name}</p>
                    </div>
                </td>
                <td class="px-lg py-md font-body-md font-mono text-on-surface-variant">${client.user_id}</td>
                <td class="px-lg py-md">
                    <span class="inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${typeBadgeColor}">${client._type}</span>
                </td>
                <td class="px-lg py-md font-body-sm text-on-surface-variant">Profile Created</td>
                <td class="px-lg py-md">
                    <div class="flex items-center gap-1 text-primary">
                        <span class="material-symbols-outlined text-[14px]">check_circle</span>
                        <span class="font-body-sm">Active</span>
                    </div>
                </td>
                <td class="px-lg py-md text-right">
                    <button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors dash-action-btn">more_vert</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    // ----- 4. Render Table -----
    const renderTable = (clients) => {
        if (!tbody) return;
        tbody.innerHTML = '';
        
        if (clients.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10" class="text-center py-xl text-on-surface-variant font-body-md">No clients found.</td></tr>`;
            return;
        }

        clients.forEach(client => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-surface-variant/50 transition-colors group';
            tr.dataset.id = client.id;
            
            const formattedAadhar = client.aadhar_number ? client.aadhar_number.match(/.{1,4}/g)?.join('<br>') || client.aadhar_number : 'N/A';
            const initial = client.client_name ? client.client_name.charAt(0).toUpperCase() : '?';

            // Base rendering, different for edit mode vs view mode
            tr.innerHTML = `
                <td class="px-lg py-md">
                    <div class="flex items-center gap-sm">
                        <div class="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-xs text-on-surface-variant">${initial}</div>
                        <div>
                            <p class="font-body-md font-bold text-on-surface client-val" data-field="client_name">${client.client_name}</p>
                            <p class="text-xs text-on-surface-variant">Active</p>
                        </div>
                    </div>
                </td>
                <td class="px-lg py-md font-body-md font-mono text-on-surface client-val" data-field="user_id">${client.user_id}</td>
                <td class="px-lg py-md font-body-md font-mono text-on-surface-variant client-val group/pwd" data-field="password">
                    <span class="pwd-mask">********</span>
                    <span class="pwd-real hidden">${client.password}</span>
                    <span class="material-symbols-outlined text-[14px] cursor-pointer hover:text-primary transition-colors toggle-pwd" data-icon="visibility">visibility</span>
                </td>
                <td class="px-lg py-md font-body-md font-mono text-on-surface client-val" data-field="pan_card">${client.pan_card}</td>
                <td class="px-lg py-md font-body-md text-on-surface client-val" data-field="address">${client.address}</td>
                <td class="px-lg py-md text-on-surface font-mono client-val" data-field="mobile_number">${client.mobile_number}</td>
                <td class="px-lg py-md font-mono text-on-surface-variant client-val" data-field="aadhar_number">${formattedAadhar}</td>
                <td class="px-lg py-md">
                    <span class="inline-block px-2 py-1 rounded bg-surface-variant text-on-surface text-[10px] font-bold uppercase tracking-wider">OK</span>
                </td>
                <td class="px-lg py-md text-right">
                    <div class="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors edit-btn" data-icon="edit">edit</button>
                        <button class="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors del-btn" data-icon="delete">delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    if (tableName) {
        // Fetch is handled by updateAuthUI once session is verified
    }

    // ----- 5. Search Logic -----
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            fetchClients(e.target.value);
        });
    });

    // ----- 6. Form Submission (Create) -----
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('saveClientBtn');
        btn.textContent = 'Saving...';
        btn.disabled = true;

        const payload = {
            client_name: document.getElementById('clientName').value,
            user_id: document.getElementById('userId').value,
            password: document.getElementById('clientPassword').value,
            pan_card: document.getElementById('panCard').value,
            mobile_number: document.getElementById('mobileNum').value,
            address: document.getElementById('clientAddress').value,
            aadhar_number: document.getElementById('aadharNum').value || 'N/A'
        };

        const targetTable = isDashboardPage ? document.getElementById("clientTypeSelect").value : tableName;
        const { data, error } = await supabase.from(targetTable).insert([payload]);
        
        btn.textContent = 'Save Client';
        btn.disabled = false;

        if (error) {
            alert('Failed to add client: ' + error.message);
        } else {
            modal.classList.add('hidden');
            form.reset();
            fetchClients(); // Refresh list
        }
    });

    // ----- 7. Global Click Handler (Edit/Delete/Print/PDF/Add/Auth) -----
    document.body.addEventListener('click', async (e) => {

        // Settings Modal Open
        const settingsBtn = e.target.closest('a');
        if (settingsBtn && settingsBtn.textContent.includes('Settings')) {
            e.preventDefault();
            const sm = document.getElementById('settingsModal');
            if (sm) sm.classList.remove('hidden');
            return;
        }

        // Pagination logic
        const pageBtn = e.target.closest('[data-page]');
        if (pageBtn) {
            const newPage = parseInt(pageBtn.dataset.page);
            const totalPages = Math.ceil(currentFilteredClients.length / itemsPerPage);
            if (newPage >= 1 && newPage <= totalPages) {
                currentPage = newPage;
                renderTable(currentFilteredClients);
            }
            return;
        }

        // Auth Logic
        const authActionBtn = e.target.closest('button[data-auth-action]');
        if (authActionBtn) {
            if (authActionBtn.dataset.authAction === 'login') {
                document.getElementById('authModal').classList.remove('hidden');
            } else if (authActionBtn.dataset.authAction === 'logout') {
                await supabase.auth.signOut();
            }
            return;
        }

        
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

        
        // Advanced Filters Button
        const advBtn = e.target.closest('button');
        if (advBtn && advBtn.textContent.trim().includes('Advanced Filters')) {
            const rect = advBtn.getBoundingClientRect();
            advFilterDropdown.style.top = (rect.bottom + window.scrollY + 8) + 'px';
            advFilterDropdown.style.left = (rect.right + window.scrollX - 192) + 'px'; // 48 rem = 192px width approx
            advFilterDropdown.classList.toggle('hidden');
            return;
        }

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
                currentPage = 1;
                renderDashboardTable(filteredClients);
            } else {
                currentPage = 1;
                renderTable(filteredClients);
            }
            
            advFilterDropdown.classList.add('hidden');
            return;
        }

        if (!e.target.closest('#advFilterDropdown') && !(advBtn && advBtn.textContent.trim().includes('Advanced Filters'))) {
            if (advFilterDropdown) advFilterDropdown.classList.add('hidden');
        }

        // Toggle Password Visibility
        if (e.target.classList.contains('toggle-pwd')) {
            const td = e.target.closest('td');
            const mask = td.querySelector('.pwd-mask');
            const real = td.querySelector('.pwd-real');
            if (mask.classList.contains('hidden')) {
                mask.classList.remove('hidden');
                real.classList.add('hidden');
                e.target.textContent = 'visibility';
            } else {
                mask.classList.add('hidden');
                real.classList.remove('hidden');
                e.target.textContent = 'visibility_off';
            }
            return;
        }

        // Delete Logic
        const deleteBtn = e.target.closest('.del-btn');
        if (deleteBtn) {
            const row = deleteBtn.closest('tr');
            const id = row.dataset.id;
            if (confirm('Are you sure you want to delete this client?')) {
                deleteBtn.textContent = 'hourglass_empty';
                const { error } = await supabase.from(tableName).delete().eq('id', id);
                if (error) alert('Error deleting: ' + error.message);
                else row.remove();
            }
            return;
        }

        // Edit Logic
        const editBtn = e.target.closest('.edit-btn');
        if (editBtn) {
            const row = editBtn.closest('tr');
            const isEditing = row.classList.contains('bg-primary-container');
            
            if (isEditing) {
                // Save changes
                editBtn.textContent = 'hourglass_empty';
                const payload = {};
                row.querySelectorAll('.client-val').forEach(cell => {
                    const field = cell.dataset.field;
                    // Handle password specifically
                    if (field === 'password') {
                        payload[field] = cell.querySelector('.pwd-real')?.textContent.trim() || cell.textContent.trim();
                    } else if (field === 'aadhar_number') {
                         payload[field] = cell.innerHTML.replace(/<br>/g, '').trim();
                    } else {
                        payload[field] = cell.textContent.trim();
                    }
                    cell.contentEditable = "false";
                    cell.style.outline = "none";
                });
                
                const { error } = await supabase.from(tableName).update(payload).eq('id', row.dataset.id);
                
                if (error) {
                    alert('Error updating: ' + error.message);
                    editBtn.textContent = 'edit';
                } else {
                    row.classList.remove('bg-primary-container');
                    row.classList.remove('text-on-primary-container');
                    editBtn.textContent = 'edit';
                    editBtn.classList.remove('text-primary');
                    fetchClients(); // Refresh to normalize rendering
                }
            } else {
                // Enter edit mode
                row.classList.add('bg-primary-container');
                row.classList.add('text-on-primary-container');
                row.querySelectorAll('.client-val').forEach(cell => {
                    cell.contentEditable = "true";
                    cell.style.outline = "1px solid #005a92";
                    // For password, show real password for editing
                    if (cell.dataset.field === 'password') {
                        const real = cell.querySelector('.pwd-real');
                        if(real) cell.textContent = real.textContent;
                    }
                });
                editBtn.textContent = 'check'; // Checkmark
                editBtn.classList.add('text-primary');
            }
            return;
        }

        // Print & Export
        const printBtn = e.target.closest('a');
        if (printBtn) {
            if (printBtn.textContent.includes('Print Report')) {
                e.preventDefault();
                window.print();
            } else if (printBtn.textContent.includes('Export PDF')) {
                e.preventDefault();
                const tableToExport = document.querySelector('table') || document.querySelector('main');
                if (tableToExport) {
                    const opt = {
                      margin:       1,
                      filename:     'TaxFlow_Report.pdf',
                      image:        { type: 'jpeg', quality: 0.98 },
                      html2canvas:  { scale: 2 },
                      jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
                    };
                    html2pdf().set(opt).from(tableToExport).save();
                }
            }
        }

        // Add New Client
        const addBtn = e.target.closest('button');
        if (addBtn && (addBtn.textContent.toUpperCase().includes('ADD NEW') || addBtn.querySelector('span')?.textContent === 'person_add')) {
            modal.classList.remove('hidden');
        }
    });

    // ----- 8. Filters (Quarterly, Monthly, etc.) -----
    const filterBtns = document.querySelectorAll('button:not([id])');
    filterBtns.forEach(btn => {
        // Find buttons that look like table filters (All Clients, Individual, HUF...)
        if (['All Clients', 'Individual', 'HUF', 'Company', 'Quarterly', 'Monthly'].includes(btn.textContent.trim())) {
            btn.addEventListener('click', () => {
                // Very basic client-side filtering mock:
                // In a real app we'd add 'type' to Supabase, but for now we just show/hide rows randomly or highlight button
                filterBtns.forEach(b => {
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
                }
                
                // If it's not "All Clients", we just fake a filter by fetching but it won't actually filter without a column.
                // We'll just fetch all for now since we didn't add a 'client_type' column.
                fetchClients();
            });
        }
    });
});


    // ----- 2.6 Theme Toggle Logic -----
    const themeToggle = document.getElementById('darkModeToggle');
    const rootEl = document.documentElement;
    
    // Load preference from local storage
    const savedTheme = localStorage.getItem('taxflow_theme') || 'dark';
    if (savedTheme === 'dark') {
        rootEl.classList.add('dark');
        if (themeToggle) themeToggle.checked = true;
    } else {
        rootEl.classList.remove('dark');
        if (themeToggle) themeToggle.checked = false;
    }
    
    // Listen for toggle changes
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                rootEl.classList.add('dark');
                localStorage.setItem('taxflow_theme', 'dark');
            } else {
                rootEl.classList.remove('dark');
                localStorage.setItem('taxflow_theme', 'light');
            }
        });
    }
