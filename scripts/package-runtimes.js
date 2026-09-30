const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOWNLOADS_DIR = path.join(ROOT_DIR, 'downloads', 'aarch64');
const CHECKSUMS_DIR = path.join(ROOT_DIR, 'checksums');

const RUNTIMES = [
  { folder: 'lua', version: '5.4.8-10' },
  { folder: 'python', version: '3.14.6-1' },
  { folder: 'ruby', version: '4.0.7' },
  { folder: 'nodejs', version: '26.4.0-1' },
  { folder: 'php', version: '8.5.1' },
  { folder: 'csharp', version: '6.14.1-2' },
  { folder: 'java', version: '21.0.12' },
  { folder: 'kotlin', version: '2.4.20' },
  { folder: 'c_cpp', version: '21.1.8-3' },
  { folder: 'go', version: '3:1.27.1' },
  { folder: 'rust', version: '1.98.1-1' }
];

function sanitizeVersion(ver) {
  return ver.replace(/:/g, '_');
}

function calculateSha256(filePath) {
  const hash = crypto.createHash('sha256');
  const buffer = fs.readFileSync(filePath);
  hash.update(buffer);
  return hash.digest('hex');
}

function packageRuntimes(targets = null) {
  console.log('===============================================================');
  console.log('  TermCode Runtime Packaging Pipeline (aarch64)');
  console.log('===============================================================');
  console.log(`Target Directory: ${DOWNLOADS_DIR}`);

  if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(CHECKSUMS_DIR)) {
    fs.mkdirSync(CHECKSUMS_DIR, { recursive: true });
  }

  const runtimesToProcess = targets 
    ? RUNTIMES.filter(r => targets.includes(r.folder))
    : RUNTIMES;

  const checksumRecords = [];

  for (const item of runtimesToProcess) {
    const srcDir = path.join(ROOT_DIR, item.folder);
    if (!fs.existsSync(srcDir)) {
      console.warn(`[SKIP] Missing source directory: ${item.folder}`);
      continue;
    }

    const safeVer = sanitizeVersion(item.version);
    const archiveName = `${item.folder}-${safeVer}-aarch64.tar.gz`;
    const archivePath = path.join(DOWNLOADS_DIR, archiveName);

    console.log(`\n==> Packaging ${item.folder} (v${item.version})...`);
    const startTime = Date.now();

    try {
      if (fs.existsSync(archivePath)) {
        fs.unlinkSync(archivePath);
      }

      // Use native tar to preserve POSIX paths and symlink structures
      execSync(`tar -czf "${archivePath}" -C "${srcDir}" .`, { stdio: 'inherit' });

      const stats = fs.statSync(archivePath);
      const sha256 = calculateSha256(archivePath);
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

      console.log(`[PACKAGED] ${archiveName}`);
      console.log(`  Size:   ${sizeMB} MB (${stats.size} bytes)`);
      console.log(`  SHA256: ${sha256}`);
      console.log(`  Time:   ${duration}s`);

      checksumRecords.push(`${sha256}  ${archiveName}`);

      // Also generate individual .sha256
      const indShaPath = path.join(DOWNLOADS_DIR, `${archiveName}.sha256`);
      fs.writeFileSync(indShaPath, `${sha256}  ${archiveName}\n`, 'utf8');

    } catch (e) {
      console.error(`[ERROR] Failed to package ${item.folder}:`, e.message);
    }
  }

  // Write master checksums file
  if (checksumRecords.length > 0) {
    const masterShaPath = path.join(CHECKSUMS_DIR, 'aarch64.sha256');
    fs.writeFileSync(masterShaPath, checksumRecords.join('\n') + '\n', 'utf8');
    console.log(`\n[CHECKSUMS] Master checksums written to ${masterShaPath}`);
  }

  console.log('===============================================================\n');
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args : null;
  packageRuntimes(targets);
}

module.exports = { packageRuntimes };
