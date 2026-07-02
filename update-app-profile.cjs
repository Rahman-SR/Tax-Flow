const fs = require('fs');

let appJs = fs.readFileSync('e:/TaxFlow-Antigravity/app.js', 'utf8');

const searchAuthUI = `        if (!session) {
            authModal.classList.remove('hidden');
        } else {
            authModal.classList.add('hidden');
            // Fetch clients if on a data page and not already fetched
            if ((tableName || isDashboardPage) && allClients.length === 0) fetchClients();
        }`;

const replaceAuthUI = `        if (!session) {
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
        }`;

appJs = appJs.replace(searchAuthUI, replaceAuthUI);

fs.writeFileSync('e:/TaxFlow-Antigravity/app.js', appJs);
console.log('app.js updated for dynamic user profile');
