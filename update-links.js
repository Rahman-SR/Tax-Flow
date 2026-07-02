import fs from 'fs';
import path from 'path';

const files = ['index.html', 'gst.html', 'itr.html', 'reports.html'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');

  // Replace link for Total Clients (Dashboard)
  content = content.replace(
    /(<a[^>]*href=")([^"]*)("[^>]*>\s*<span[^>]*>group<\/span>\s*<span[^>]*>Total Clients<\/span>\s*<\/a>)/g,
    '$1index.html$3'
  );

  // Replace link for GST Clients
  content = content.replace(
    /(<a[^>]*href=")([^"]*)("[^>]*>\s*<span[^>]*>receipt_long<\/span>\s*<span[^>]*>GST Clients<\/span>\s*<\/a>)/g,
    '$1gst.html$3'
  );

  // Replace link for ITR Clients
  content = content.replace(
    /(<a[^>]*href=")([^"]*)("[^>]*>\s*<span[^>]*>account_balance_wallet<\/span>\s*<span[^>]*>ITR Clients<\/span>\s*<\/a>)/g,
    '$1itr.html$3'
  );

  // Replace link for Reports
  content = content.replace(
    /(<a[^>]*href=")([^"]*)("[^>]*>\s*<span[^>]*>analytics<\/span>\s*<span[^>]*>Reports<\/span>\s*<\/a>)/g,
    '$1reports.html$3'
  );
  
  // Replace active states where appropriate based on the file name.
  // Actually, Stitch already generated them with the active state in each respective file,
  // we just needed to fix the href="#" to point to the actual files.
  
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
}
