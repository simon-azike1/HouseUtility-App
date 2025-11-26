import fs from 'fs';
const s = fs.readFileSync('.env', 'utf8');
console.log('raw .env as string JSON:', JSON.stringify(s));
console.log('first 400 char codes:', s.split('').slice(0,400).map(c=>c.charCodeAt(0)));
