const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const MANIFESTS_DIR = path.join(ROOT_DIR, 'manifests');

const REQUIRED_TARGETS = [
  'c', 'cpp', 'java', 'python', 'nodejs', 'typescript',
  'go', 'rust', 'kotlin', 'csharp', 'php', 'ruby', 'lua', 'web'
];

const REQUIRED_MANIFEST_FIELDS = [
  'target', 'displayName', 'runtimeFolder', 'version', 'arch',
  'category', 'minAndroidApi', 'fileCount', 'extractedSizeBytes',
  'extractedSizeMB', 'primaryExecutable', 'testCommand', 'runCommand',
  'environment', 'dependencies', 'downloadUrl', 'gitInstallCommand',
  'description', 'status', 'verified'
];

function validate() {
  console.log('===============================================================');
  console.log('  TermCode Library Validation & Integrity Check');
  console.log('===============================================================');
  console.log(`Scan Time: ${new Date().toISOString()}`);
  console.log(`Checking Root: ${ROOT_DIR}\n`);

  let errorCount = 0;
  let warnCount = 0;

  // 1. Verify manifests directory
  if (!fs.existsSync(MANIFESTS_DIR)) {
    console.error('❌ [FATAL] Manifests directory missing: manifests/');
    process.exit(1);
  }

  // 2. Verify manifests/index.json
  const indexPath = path.join(MANIFESTS_DIR, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ [ERROR] Missing manifests/index.json');
    errorCount++;
  } else {
    try {
      const indexJson = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      console.log(`✅ [OK] manifests/index.json valid (${Object.keys(indexJson.runtimes || {}).length} runtimes registered)`);
    } catch (e) {
      console.error(`❌ [ERROR] manifests/index.json contains invalid JSON: ${e.message}`);
      errorCount++;
    }
  }

  // 3. Verify each required language manifest
  for (const target of REQUIRED_TARGETS) {
    const manifestPath = path.join(MANIFESTS_DIR, `${target}.json`);
    if (!fs.existsSync(manifestPath)) {
      console.error(`❌ [ERROR] Missing manifest: manifests/${target}.json`);
      errorCount++;
      continue;
    }

    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const missingFields = REQUIRED_MANIFEST_FIELDS.filter(f => manifest[f] === undefined);

      if (missingFields.length > 0) {
        console.error(`❌ [ERROR] manifests/${target}.json missing fields: ${missingFields.join(', ')}`);
        errorCount++;
      } else {
        // Verify underlying runtime folder and binary
        const runtimeFolder = path.join(ROOT_DIR, manifest.runtimeFolder);
        if (!fs.existsSync(runtimeFolder)) {
          console.error(`❌ [ERROR] manifests/${target}.json points to non-existent folder: ${manifest.runtimeFolder}`);
          errorCount++;
        } else {
          const binPath = path.join(runtimeFolder, manifest.primaryExecutable);
          if (!fs.existsSync(binPath)) {
            console.warn(`⚠️  [WARN] Target '${target}' primary executable missing on disk: ${manifest.primaryExecutable}`);
            warnCount++;
          } else {
            console.log(`✅ [OK] Target '${target.padEnd(10)}' -> ${manifest.displayName} (${manifest.version}) verified.`);
          }
        }
      }
    } catch (e) {
      console.error(`❌ [ERROR] Invalid JSON in manifests/${target}.json: ${e.message}`);
      errorCount++;
    }
  }

  // 4. Verify install.sh script exists
  const installShPath = path.join(ROOT_DIR, 'install.sh');
  if (!fs.existsSync(installShPath)) {
    console.error('❌ [ERROR] Missing install.sh script');
    errorCount++;
  } else {
    console.log('✅ [OK] install.sh verified.');
  }

  // 5. Verify README.md exists
  const readmePath = path.join(ROOT_DIR, 'README.md');
  if (!fs.existsSync(readmePath)) {
    console.error('❌ [ERROR] Missing README.md');
    errorCount++;
  } else {
    console.log('✅ [OK] README.md verified.');
  }

  console.log('\n---------------------------------------------------------------');
  console.log(`Validation Summary: ${errorCount} Errors, ${warnCount} Warnings`);
  console.log('===============================================================\n');

  if (errorCount > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  validate();
}

module.exports = { validate };
