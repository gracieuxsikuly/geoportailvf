#!/usr/bin/env node
/**
 * Pousse un style SLD vers GeoServer via l'API REST.
 * Usage : node publish-style.js <workspace> <styleName> <fichier.sld>
 */
const fs = require('node:fs');
const path = require('node:path');

async function main() {
  const [workspace, styleName, filePath] = process.argv.slice(2);
  if (!workspace || !styleName || !filePath) {
    console.error('Usage: node publish-style.js <workspace> <styleName> <fichier.sld>');
    process.exit(1);
  }

  const url = process.env.GEOSERVER_URL;
  const user = process.env.GEOSERVER_ADMIN_USER;
  const password = process.env.GEOSERVER_ADMIN_PASSWORD;
  if (!url || !user || !password) {
    console.error('GEOSERVER_URL, GEOSERVER_ADMIN_USER, GEOSERVER_ADMIN_PASSWORD requis');
    process.exit(1);
  }

  const sld = fs.readFileSync(path.resolve(filePath), 'utf-8');
  const auth = 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64');
  const endpoint = `${url}/rest/workspaces/${workspace}/styles/${styleName}`;

  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/vnd.ogc.sld+xml',
      Authorization: auth,
    },
    body: sld,
  });

  if (!res.ok) {
    console.error(`Échec : ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  console.log(`Style ${workspace}:${styleName} mis à jour.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
