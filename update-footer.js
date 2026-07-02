import fs from 'fs';

const files = ['gst.html', 'itr.html', 'reports.html'];

let indexContent = fs.readFileSync('e:\\TaxFlow-Antigravity\\index.html', 'utf8');
let dashboardFooterMatch = indexContent.match(/<footer[\s\S]*?<\/footer>/);

if (dashboardFooterMatch) {
    let dashboardFooter = dashboardFooterMatch[0];
    console.log("Found dashboard footer.");

    files.forEach(file => {
        let content = fs.readFileSync(`e:\\TaxFlow-Antigravity\\${file}`, 'utf8');
        content = content.replace(/<footer[\s\S]*?<\/footer>/, dashboardFooter);
        fs.writeFileSync(`e:\\TaxFlow-Antigravity\\${file}`, content, 'utf8');
        console.log(`Updated footer in ${file}`);
    });
} else {
    console.log("Could not find footer in dashboard.");
}
