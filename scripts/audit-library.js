const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');

const RUNTIME_METADATA = {
  c_cpp: {
    displayName: 'C / C++ (Clang & LLVM Toolchain)',
    targets: ['c', 'cpp'],
    version: '21.1.8-3',
    arch: 'aarch64',
    primaryBinaries: ['bin/clang', 'bin/clang++', 'bin/make', 'bin/ld.lld'],
    description: 'LLVM/Clang C & C++ compiler suite with libc++, NDK sysroot, GNU binutils, and Make for Android aarch64.',
    upstream: 'Termux Official Packages (clang 21.1.8-3, binutils 2.47, make 4.4.1-1, ndk-sysroot 30, libc++ 30)',
    dependencies: ['libllvm', 'lld', 'binutils', 'libc++', 'ndk-sysroot', 'make']
  },
  java: {
    displayName: 'Java (OpenJDK 21)',
    targets: ['java'],
    version: '21.0.12',
    arch: 'aarch64',
    primaryBinaries: ['bin/java', 'bin/javac', 'bin/jar'],
    description: 'OpenJDK 21 runtime and compiler environment with HotSpot 64-Bit Server VM for Android aarch64.',
    upstream: 'Termux Official Packages (openjdk-21 21.0.12)',
    dependencies: ['alsa-lib', 'dbus', 'libandroid-shmem', 'libiconv', 'libx11', 'zlib']
  },
  python: {
    displayName: 'Python 3 (CPython 3.14)',
    targets: ['python', 'web'],
    version: '3.14.6-1',
    arch: 'aarch64',
    primaryBinaries: ['bin/python3', 'bin/python', 'bin/pip'],
    description: 'CPython 3.14 interpreter with standard library, OpenSSL, SQLite, Readline, and HTTP server for Android aarch64.',
    upstream: 'Termux Official Packages (python 3.14.6-1, openssl, libsqlite, readline)',
    dependencies: ['libandroid-support', 'libbz2', 'libexpat', 'libffi', 'liblzma', 'libsqlite', 'ncurses', 'openssl', 'readline', 'zlib']
  },
  nodejs: {
    displayName: 'Node.js & TypeScript',
    targets: ['nodejs', 'typescript'],
    version: '26.4.0-1',
    arch: 'aarch64',
    primaryBinaries: ['bin/node', 'bin/npm', 'bin/npx'],
    description: 'Node.js v26 JavaScript runtime with V8 engine, npm package manager, and full TypeScript execution support.',
    upstream: 'Termux Official Packages (nodejs 26.4.0-1, npm 11.20.0)',
    dependencies: ['c-ares', 'libandroid-execinfo', 'libicu', 'libnghttp2', 'openssl', 'zlib']
  },
  go: {
    displayName: 'Go (Golang)',
    targets: ['go'],
    version: '3:1.27.1',
    arch: 'aarch64',
    primaryBinaries: ['bin/go', 'bin/gofmt'],
    description: 'Go programming language compiler, standard library, and tooling with CGO support for Android aarch64.',
    upstream: 'Termux Official Packages (golang 3:1.27.1)',
    dependencies: ['binutils', 'clang', 'libc++']
  },
  rust: {
    displayName: 'Rust (Rustc & Cargo)',
    targets: ['rust'],
    version: '1.98.1-1',
    arch: 'aarch64',
    primaryBinaries: ['bin/rustc', 'bin/cargo'],
    description: 'Rust compiler, Cargo package manager, and standard library targeting aarch64-linux-android.',
    upstream: 'Termux Official Packages (rust 1.98.1-1, rust-std-aarch64-linux-android 1.98.1-1)',
    dependencies: ['binutils', 'clang', 'libc++', 'libllvm', 'openssl', 'zlib']
  },
  kotlin: {
    displayName: 'Kotlin (Kotlinc)',
    targets: ['kotlin'],
    version: '2.4.20',
    arch: 'aarch64',
    primaryBinaries: ['bin/kotlinc', 'bin/kotlin'],
    description: 'Kotlin compiler and standard runtime libraries for targeting the Java Virtual Machine on Android.',
    upstream: 'Termux Official Packages (kotlin 2.4.20_all, openjdk-21)',
    dependencies: ['java']
  },
  csharp: {
    displayName: 'C# (Mono CLI & MCS)',
    targets: ['csharp'],
    version: '6.14.1-2',
    arch: 'aarch64',
    primaryBinaries: ['bin/mono', 'bin/mcs', 'bin/csharp'],
    description: 'Mono open source ECMA CLI, C# compiler (mcs), runtime engine, and BCL libraries for Android aarch64.',
    upstream: 'Termux Official Packages (mono 6.14.1-2, mono-libs 6.14.1-2)',
    dependencies: ['krb5', 'zlib']
  },
  php: {
    displayName: 'PHP (PHP-CLI)',
    targets: ['php'],
    version: '8.5.1',
    arch: 'aarch64',
    primaryBinaries: ['bin/php'],
    description: 'PHP command-line interpreter with core extensions, OpenSSL, libxml2, and cURL for Android aarch64.',
    upstream: 'Termux Official Packages (php 8.5.1, libxml2, libxslt, openssl)',
    dependencies: ['libandroid-support', 'libcurl', 'libiconv', 'libxml2', 'libxslt', 'libzip', 'oniguruma', 'openssl', 'pcre2', 'zlib']
  },
  ruby: {
    displayName: 'Ruby (Ruby & Gem)',
    targets: ['ruby'],
    version: '4.0.7',
    arch: 'aarch64',
    primaryBinaries: ['bin/ruby', 'bin/gem', 'bin/bundle'],
    description: 'Ruby object-oriented dynamic language interpreter, standard library, and RubyGems package manager.',
    upstream: 'Termux Official Packages (ruby 4.0.7, openssl, libyaml)',
    dependencies: ['libcrypt', 'libffi', 'libgmp', 'libyaml', 'ncurses', 'openssl', 'readline', 'zlib']
  },
  lua: {
    displayName: 'Lua 5.4',
    targets: ['lua'],
    version: '5.4.8-10',
    arch: 'aarch64',
    primaryBinaries: ['bin/lua', 'bin/luac'],
    description: 'Lua 5.4 lightweight, embeddable scripting language interpreter and bytecode compiler for Android aarch64.',
    upstream: 'Termux Official Packages (lua54 5.4.8-10, readline)',
    dependencies: ['readline']
  }
};

function getDirectoryStats(dirPath) {
  let fileCount = 0;
  let dirCount = 0;
  let totalBytes = 0;
  const binaryList = [];

  function walk(current) {
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (e) {
      return;
    }

    for (const ent of entries) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        dirCount++;
        walk(full);
      } else if (ent.isFile()) {
        fileCount++;
        try {
          const st = fs.statSync(full);
          totalBytes += st.size;
          const rel = path.relative(dirPath, full).replace(/\\/g, '/');
          if (rel.startsWith('bin/')) {
            binaryList.push(rel);
          }
        } catch (e) {}
      }
    }
  }

  walk(dirPath);
  return { fileCount, dirCount, totalBytes, binaryList };
}

function audit() {
  console.log('===============================================================');
  console.log('  TermCode IDE Runtime Library - Deep System Audit');
  console.log('===============================================================');
  console.log(`Scan Time: ${new Date().toISOString()}`);
  console.log(`Root Directory: ${ROOT_DIR}\n`);

  const results = {};
  let totalAllBytes = 0;
  let totalAllFiles = 0;

  for (const [folderName, meta] of Object.entries(RUNTIME_METADATA)) {
    const fullPath = path.join(ROOT_DIR, folderName);
    const exists = fs.existsSync(fullPath);

    if (!exists) {
      console.warn(`[MISSING] Runtime folder: ${folderName}`);
      results[folderName] = { ...meta, exists: false, error: 'Directory not found' };
      continue;
    }

    const stats = getDirectoryStats(fullPath);
    totalAllBytes += stats.totalBytes;
    totalAllFiles += stats.fileCount;

    // Check symlinks
    let symlinkCount = 0;
    const symlinksFile = path.join(fullPath, 'SYMLINKS.txt');
    if (fs.existsSync(symlinksFile)) {
      const content = fs.readFileSync(symlinksFile, 'utf8');
      symlinkCount = content.split('\n').filter(l => l.trim().length > 0).length;
    }

    // Verify primary binaries
    const verifiedBinaries = {};
    for (const bin of meta.primaryBinaries) {
      const p = path.join(fullPath, bin);
      verifiedBinaries[bin] = fs.existsSync(p);
    }

    results[folderName] = {
      ...meta,
      exists: true,
      fileCount: stats.fileCount,
      dirCount: stats.dirCount,
      totalBytes: stats.totalBytes,
      totalMB: (stats.totalBytes / (1024 * 1024)).toFixed(2),
      symlinkCount,
      verifiedBinaries,
      binCount: stats.binaryList.length
    };

    console.log(`[OK] ${meta.displayName.padEnd(35)} | ${meta.version.padEnd(10)} | ${results[folderName].totalMB.padStart(8)} MB | ${stats.fileCount.toString().padStart(5)} files | ${symlinkCount.toString().padStart(3)} symlinks`);
  }

  console.log('---------------------------------------------------------------');
  console.log(`Total Runtimes Audited: ${Object.keys(results).length}`);
  console.log(`Total File Count      : ${totalAllFiles}`);
  console.log(`Total Extracted Size  : ${(totalAllBytes / (1024 * 1024)).toFixed(2)} MB (${(totalAllBytes / (1024 * 1024 * 1024)).toFixed(2)} GB)`);
  console.log('===============================================================\n');

  // Generate LIBRARY_AUDIT.md
  generateAuditMarkdown(results, totalAllFiles, totalAllBytes);

  return results;
}

function generateAuditMarkdown(results, totalFiles, totalBytes) {
  let md = `# TermCode Language Library - Full Inventory & Audit Report\n\n`;
  md += `**Audit Date:** ${new Date().toISOString()}\n`;
  md += `**Target Architecture:** \`aarch64\` (ARM64 Android)\n`;
  md += `**Host Compatibility:** Termux Android Environment (\`/data/data/com.termux/files/usr\`)\n`;
  md += `**Total Inventory:** ${Object.keys(results).length} Toolchains | ${totalFiles.toLocaleString()} Files | ${(totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB Extracted\n\n`;

  md += `## 1. Runtime Inventory Summary Table\n\n`;
  md += `| Target(s) | Language / Runtime | Version | Arch | Extracted Size | Files | Symlinks | Key Executables | Status |\n`;
  md += `| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- | :---: |\n`;

  for (const [folder, data] of Object.entries(results)) {
    const bins = Object.keys(data.verifiedBinaries).map(b => b.replace('bin/', '')).join(', ');
    const targets = data.targets.map(t => `\`${t}\``).join(', ');
    const status = Object.values(data.verifiedBinaries).every(Boolean) ? '✅ Ready' : '⚠️ Warning';
    md += `| ${targets} | **${data.displayName}** | \`${data.version}\` | \`${data.arch}\` | ${data.totalMB} MB | ${data.fileCount} | ${data.symlinkCount} | \`${bins}\` | ${status} |\n`;
  }

  md += `\n## 2. Detailed Toolchain Breakdown\n\n`;

  for (const [folder, data] of Object.entries(results)) {
    md += `### ${data.displayName} (\`${folder}\`)\n\n`;
    md += `- **Version:** \`${data.version}\`\n`;
    md += `- **Supported Targets:** ${data.targets.map(t => `\`${t}\``).join(', ')}\n`;
    md += `- **Architecture:** \`${data.arch}\`\n`;
    md += `- **Extracted Disk Size:** ${data.totalMB} MB (${data.totalBytes.toLocaleString()} bytes)\n`;
    md += `- **Total Files:** ${data.fileCount} across ${data.dirCount} subdirectories\n`;
    md += `- **Preserved Symlinks:** ${data.symlinkCount} links cataloged in \`SYMLINKS.txt\`\n`;
    md += `- **Upstream Source:** ${data.upstream}\n`;
    md += `- **Dependencies:** ${data.dependencies.map(d => `\`${d}\``).join(', ')}\n`;
    md += `- **Description:** ${data.description}\n`;
    md += `- **Executable Verification:**\n`;
    for (const [bin, exists] of Object.entries(data.verifiedBinaries)) {
      md += `  - \`${bin}\`: ${exists ? '✅ Verified Present' : '❌ MISSING'}\n`;
    }
    md += `\n`;
  }

  md += `## 3. Security, Permissions & Symlinks Protocol\n\n`;
  md += `- **POSIX Permissions:** All binaries under \`bin/\` must be granted \`chmod 0755\` upon deployment.\n`;
  md += `- **Symlink Restoration:** Extracted archives on Android must read \`SYMLINKS.txt\` and run \`ln -sf <target> <link>\` to guarantee dynamic linkers and shared objects resolve correctly without duplicate disk footprint.\n`;
  md += `- **Library Path Configuration:** Ensure \`LD_LIBRARY_PATH=/data/data/com.termux/files/usr/lib\` is configured in the execution environment.\n`;

  const outPath = path.join(ROOT_DIR, 'LIBRARY_AUDIT.md');
  fs.writeFileSync(outPath, md, 'utf8');
  console.log(`Audit report generated at: ${outPath}`);
}

if (require.main === module) {
  audit();
}

module.exports = { audit, RUNTIME_METADATA };
