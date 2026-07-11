import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const failures = [];

function readJson(relativePath) {
  try {
    return JSON.parse(readFileSync(join(root, relativePath), 'utf8'));
  } catch (error) {
    failures.push(`${relativePath}: invalid JSON (${error.message})`);
    return null;
  }
}

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    if (name === '.git' || name === 'node_modules') return [];
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const packageJson = readJson('package.json');
const schema = readJson('schemas/acc.v1.schema.json');
const spec = readFileSync(join(root, 'SPEC.md'), 'utf8');
const changelog = readFileSync(join(root, 'CHANGELOG.md'), 'utf8');

const release = String(packageJson?.version || '');
const major = Number(release.split('.')[0]);
const specRelease = spec.match(/^Specification release: ([0-9]+\.[0-9]+\.[0-9]+)$/m)?.[1];

if (!/^\d+\.\d+\.\d+$/.test(release)) {
  failures.push(`package.json: invalid semantic specification release ${release || '(missing)'}`);
}

if (!Number.isInteger(major) || !spec.includes(`Short name: ACC v${major}`) || specRelease !== release) {
  failures.push(`SPEC.md: ACC major and specification release must match package.json ${release}`);
}

if (schema?.properties?.version?.const !== major) {
  failures.push(`schemas/acc.v${major}.schema.json: declaration version must match specification major ${major}`);
}

if (!existsSync(join(root, `RELEASE_NOTES_v${release}.md`))) {
  failures.push(`RELEASE_NOTES_v${release}.md: current release notes are missing`);
}

if (!changelog.includes(`## ${release} -`)) {
  failures.push(`CHANGELOG.md: current release ${release} is missing`);
}

const markdownFiles = walk(root).filter((path) => extname(path) === '.md');
const markdownLink = /\[[^\]]*\]\(([^)]+)\)/g;

for (const path of markdownFiles) {
  const source = readFileSync(path, 'utf8');
  for (const match of source.matchAll(markdownLink)) {
    const target = match[1].trim().split(/\s+["']/)[0];
    if (!target || target.startsWith('#') || /^(https?:|mailto:)/.test(target)) continue;
    const filePart = decodeURIComponent(target.split('#')[0]);
    const resolved = normalize(resolve(dirname(path), filePart));
    if (!resolved.startsWith(root) || !existsSync(resolved)) {
      failures.push(`${path.slice(root.length + 1)}: broken local link ${target}`);
    }
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`ACC v${release} checks passed (${markdownFiles.length} Markdown files)`);
