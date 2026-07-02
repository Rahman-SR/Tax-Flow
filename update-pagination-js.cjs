const fs = require('fs');

let appJs = fs.readFileSync('e:/TaxFlow-Antigravity/app.js', 'utf8');

// 1. Add currentFilteredClients to global variables
appJs = appJs.replace(
    'let currentPage = 1;',
    'let currentFilteredClients = [];\nlet currentPage = 1;'
);

// 2. Add the pagination logic inside renderTable
const oldRenderTableStart = `function renderTable(clients) {
    const tableBody = document.querySelector('tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    clients.forEach(client => {`;

const newRenderTableStart = `
window.changePage = function(newPage) {
    currentPage = newPage;
    renderTable(currentFilteredClients);
};

function renderPagination(totalClients) {
    const totalItems = totalClients.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    const infoEl = document.getElementById('paginationInfo');
    if (infoEl) {
        infoEl.textContent = \`Showing \${startItem} to \${endItem} of \${totalItems} clients\`;
    }
    
    const controlsEl = document.getElementById('paginationControls');
    if (controlsEl) {
        let html = '';
        
        // Prev button
        html += \`
        <button class="p-2 border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-all rounded \${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" onclick="\${currentPage === 1 ? '' : \`changePage(\${currentPage - 1})\`} ">
            <span class="material-symbols-outlined text-[18px]" data-icon="chevron_left">chevron_left</span>
        </button>\`;
        
        // Page numbers
        for(let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                if (i === currentPage) {
                    html += \`<button class="px-md py-1 border border-primary bg-primary/10 text-primary font-label-md rounded">\${i}</button>\`;
                } else {
                    html += \`<button class="px-md py-1 border border-outline-variant text-on-surface-variant hover:bg-surface-variant font-label-md rounded" onclick="changePage(\${i})">\${i}</button>\`;
                }
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += \`<span class="px-2 text-on-surface-variant">...</span>\`;
            }
        }
        
        // Next button
        html += \`
        <button class="p-2 border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-all rounded \${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" onclick="\${currentPage === totalPages ? '' : \`changePage(\${currentPage + 1})\`}">
            <span class="material-symbols-outlined text-[18px]" data-icon="chevron_right">chevron_right</span>
        </button>\`;
        
        controlsEl.innerHTML = html;
    }
}

function renderTable(clients) {
    currentFilteredClients = clients;
    const tableBody = document.querySelector('tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    
    renderPagination(clients);
    const slicedClients = clients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    slicedClients.forEach(client => {`;

appJs = appJs.replace(oldRenderTableStart, newRenderTableStart);

// 3. Ensure currentPage resets when searching
appJs = appJs.replace(
    'renderTable(filtered);',
    'currentPage = 1;\n            renderTable(filtered);'
);

// 4. Ensure currentPage resets when applying advanced filters
const advFilterSearch = `if (isDashboardPage) {
                renderDashboardTable(filteredClients);
            } else {
                renderTable(filteredClients);
            }`;
const advFilterReplace = `if (isDashboardPage) {
                currentPage = 1;
                renderDashboardTable(filteredClients);
            } else {
                currentPage = 1;
                renderTable(filteredClients);
            }`;
appJs = appJs.replace(advFilterSearch, advFilterReplace);

fs.writeFileSync('e:/TaxFlow-Antigravity/app.js', appJs);
console.log('Added pagination logic to app.js');
