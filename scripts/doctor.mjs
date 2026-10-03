import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
const envExample = await readFile('.env.example', 'utf8');
const failures = [];
const major = Number(process.versions.node.split('.')[0]);
if (major < 22) failures.push('Node.js 22 or newer is required.');
for (const script of ['lint', 'typecheck', 'test', 'check:pii', 'build']) if (!packageJson.scripts[script]) failures.push(`Missing npm script: ${script}`);
if (!envExample.includes('AI_INSIGHTS_ENABLED=false')) failures.push('AI must be disabled by default in .env.example.');
if (!envExample.includes('OPENAI_API_KEY=')) failures.push('OPENAI_API_KEY must be documented in .env.example.');
try { execFileSync('git', ['check-ignore', '.env.local'], { stdio: 'ignore' }); } catch { failures.push('.env.local must be ignored by git.'); }
if (failures.length) { console.error(failures.map((failure) => `DOCTOR FAIL: ${failure}`).join('\n')); process.exit(1); }
console.log('DOCTOR PASS: configuration, scripts, and secret defaults are aligned.');
