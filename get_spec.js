const fs = require('fs');
const https = require('https');

// Manually parse .env.local
const envContent = fs.readFileSync('./.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[key] = value.trim();
  }
});

const url = new URL(env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/');
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!key) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is not defined in env", env);
  process.exit(1);
}

const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname,
  method: 'GET',
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  }
};

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const spec = JSON.parse(data);
      console.log("Exposed Tables/Views:");
      if (spec.definitions) {
        console.log(Object.keys(spec.definitions));
      } else {
        console.log("No definitions found in spec.");
      }

      console.log("\nExposed Paths (including RPCs):");
      if (spec.paths) {
        console.log(Object.keys(spec.paths));
      } else {
        console.log("No paths found in spec.");
      }
    } catch (e) {
      console.error("Failed to parse JSON response. Body preview:", data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.end();
