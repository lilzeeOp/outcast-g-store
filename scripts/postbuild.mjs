// Copy the app shell to 404.html so Vercel serves unknown URLs with a real
// 404 status while React still renders the branded "not found" page.
import { copyFileSync } from 'node:fs';
copyFileSync('dist/index.html', 'dist/404.html');
console.log('postbuild: wrote dist/404.html');
