import fs from 'fs';
import path from 'path';

const file = 'e:\\TaxFlow-Antigravity\\gst.html';
let content = fs.readFileSync(file, 'utf-8');

// 1. Add the missing style tag before </head> if it's missing
if (!content.includes('<style>')) {
  const styleBlock = `
<style>
        body {
            background-color: #121212;
            color: #e5e2e1;
            font-family: 'Inter', sans-serif;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        /* Custom scrollbar for data heavy tables */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #121212; }
        ::-webkit-scrollbar-thumb { background: #2c2c2c; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #d32f2f; }
        
        .zebra-table tr:nth-child(even) { background-color: #1e1e1e; }
        .zebra-table tr:nth-child(odd) { background-color: #222222; }
</style>
`;
  content = content.replace('</head>', styleBlock + '</head>');
}

// 2. Make the footer slim (replace py-md with py-xs or py-2) and adjust text sizes
content = content.replace(/<footer class="([^"]*)py-md([^"]*)">/, '<footer class="$1py-2$2">');

// 3. Make the main section fit by adjusting its height to account for footer (footer is around 40px now)
// Original: h-[calc(100vh-64px)]
// Change to: h-[calc(100vh-64px-40px)] or add padding bottom
content = content.replace(/h-\[calc\(100vh-64px\)\]/g, 'h-[calc(100vh-104px)]');

fs.writeFileSync(file, content);
console.log('Fixed gst.html');
