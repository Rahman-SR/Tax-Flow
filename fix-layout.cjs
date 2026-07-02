const fs = require('fs');

let appJs = fs.readFileSync('e:/TaxFlow-Antigravity/app.js', 'utf8');

// Fix 1: Table column splitting for renderTable
const oldTableCells = `                <td class="px-lg py-md">
                    <div class="flex items-center justify-between">
                        <span class="inline-block px-2 py-1 rounded bg-surface-variant text-on-surface text-[10px] font-bold uppercase tracking-wider">OK</span>
                        <div class="flex items-center gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            <button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors edit-btn" data-icon="edit">edit</button>
                            <button class="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors del-btn" data-icon="delete">delete</button>
                        </div>
                    </div>
                </td>`;

const newTableCells = `                <td class="px-lg py-md">
                    <span class="inline-block px-2 py-1 rounded bg-surface-variant text-on-surface text-[10px] font-bold uppercase tracking-wider">OK</span>
                </td>
                <td class="px-lg py-md text-right">
                    <div class="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors edit-btn" data-icon="edit">edit</button>
                        <button class="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors del-btn" data-icon="delete">delete</button>
                    </div>
                </td>`;

appJs = appJs.replace(oldTableCells, newTableCells);

// Fix 2: Quick Filter padding removal bug
const oldFilterLogic = `                        b.classList.remove('bg-primary', 'text-on-primary');
                        b.classList.add('text-on-surface-variant');
                        if (b.classList.contains('rounded-full')) {
                            b.classList.remove('rounded-full', 'px-md', 'py-xs');
                        }`;

const newFilterLogic = `                        b.classList.remove('bg-primary', 'text-on-primary', 'rounded-full');
                        b.classList.add('text-on-surface-variant', 'rounded');`;

appJs = appJs.replace(oldFilterLogic, newFilterLogic);

const oldFilterLogic2 = `                btn.classList.add('bg-primary', 'text-on-primary', 'rounded-full', 'px-md', 'py-xs');
                btn.classList.remove('text-on-surface-variant');`;

const newFilterLogic2 = `                btn.classList.remove('rounded');
                btn.classList.add('bg-primary', 'text-on-primary', 'rounded-full');
                btn.classList.remove('text-on-surface-variant');`;

appJs = appJs.replace(oldFilterLogic2, newFilterLogic2);


fs.writeFileSync('e:/TaxFlow-Antigravity/app.js', appJs);
console.log('Fixed layout bugs in app.js');
