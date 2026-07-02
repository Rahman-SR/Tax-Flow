const fs = require('fs');

let appJs = fs.readFileSync('e:/TaxFlow-Antigravity/app.js', 'utf8');

// 1. Rewrite renderPagination to use strict square sizing and data-attributes instead of onclick
const oldPaginationLogic = `        // Prev button
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
}`;

const newPaginationLogic = `        // Prev button
        html += \`
        <button class="w-8 h-8 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-all rounded \${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" data-page="\${currentPage - 1}">
            <span class="material-symbols-outlined text-[18px]" data-icon="chevron_left">chevron_left</span>
        </button>\`;
        
        // Page numbers
        for(let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                if (i === currentPage) {
                    html += \`<button class="w-8 h-8 flex items-center justify-center border border-primary bg-primary text-on-primary font-bold font-label-md rounded">\${i}</button>\`;
                } else {
                    html += \`<button class="w-8 h-8 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-variant font-label-md transition-all rounded" data-page="\${i}">\${i}</button>\`;
                }
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += \`<span class="w-8 h-8 flex items-center justify-center text-on-surface-variant">...</span>\`;
            }
        }
        
        // Next button
        html += \`
        <button class="w-8 h-8 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-all rounded \${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" data-page="\${currentPage + 1}">
            <span class="material-symbols-outlined text-[18px]" data-icon="chevron_right">chevron_right</span>
        </button>\`;
        
        controlsEl.innerHTML = html;
    }
}`;
appJs = appJs.replace(oldPaginationLogic, newPaginationLogic);


// 2. Add Event Delegation for Pagination clicks
const globalClickHandlerStart = `document.body.addEventListener('click', async (e) => {`;
const paginationClickHandler = `
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
`;

appJs = appJs.replace(globalClickHandlerStart, globalClickHandlerStart + paginationClickHandler);

fs.writeFileSync('e:/TaxFlow-Antigravity/app.js', appJs);
console.log('Fixed pagination sizes and click events');
