import fs from 'node:fs';

const configPath = '/Users/Maulik/Library/Preferences/.wrangler/config/default.toml';
const raw = fs.readFileSync(configPath, 'utf8');
const tokenMatch = raw.match(/(?:oauth_token|api_token)\s*=\s*["']([^"']+)["']/);
if (!tokenMatch) throw new Error('No Wrangler OAuth or API token found.');

const accountId = '00f21e5724f9ebf7b1ab0cb42ae76b1e';
const headers = { Authorization: `Bearer ${tokenMatch[1]}` };
const api = async (path) => {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, { headers });
  const body = await response.json();
  if (!response.ok || body.success === false) {
    throw new Error(`${path}: ${JSON.stringify(body.errors || body)}`);
  }
  return body.result;
};

const zones = await api(`/zones?account.id=${accountId}&name=decideone.app`);
console.log(JSON.stringify({ zones: zones.map(({ id, name, status }) => ({ id, name, status })) }, null, 2));
if (zones[0]) {
  try {
    const records = await api(`/zones/${zones[0].id}/dns_records?per_page=100`);
    console.log(JSON.stringify({ records: records.map(({ type, name, content, proxied }) => ({ type, name, content, proxied })) }, null, 2));
  } catch (error) {
    console.log(JSON.stringify({ records: 'unavailable with current OAuth scope' }, null, 2));
  }
}

const services = await api(`/accounts/${accountId}/workers/services`);
console.log(JSON.stringify({ workers: services.map(({ id, default_environment }) => ({ id, default_environment })) }, null, 2));
