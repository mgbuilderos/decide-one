import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredLegalFacts = [
  'VITE_LEGAL_ENTITY',
  'VITE_REGISTERED_ADDRESS',
  'VITE_SUPPORT_EMAIL',
  'VITE_LEGAL_JURISDICTION',
  'VITE_LEGAL_EFFECTIVE_DATE'
];

function readEnvFile(file) {
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/).flatMap(line => {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) return [];
    const value = match[2].replace(/^(['"])(.*)\1$/, '$2').trim();
    return [[match[1], value]];
  }));
}

const productionEnv = {
  ...readEnvFile(path.join(root, '.env')),
  ...readEnvFile(path.join(root, '.env.production')),
  ...process.env
};
const missing = requiredLegalFacts.filter(key => !productionEnv[key]?.trim());

const requiredFiles = [
  'public/_headers',
  'public/robots.txt',
  'public/sitemap.xml',
  'public/manifest.json',
  'public/sw.js'
];
const absentFiles = requiredFiles.filter(file => !fs.existsSync(path.join(root, file)));

if (absentFiles.length || missing.length) {
  console.error('Launch check failed.');
  if (absentFiles.length) console.error(`Missing public files: ${absentFiles.join(', ')}`);
  if (missing.length) console.error(`Missing legal facts: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Launch check passed: public shell and legal facts are present.');
