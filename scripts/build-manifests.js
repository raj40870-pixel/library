const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const MANIFESTS_DIR = path.join(ROOT_DIR, 'manifests');

const TARGET_DEFINITIONS = {
  c: {
    folder: 'c_cpp',
    displayName: 'C (Clang / LLVM)',
    version: '21.1.8-3',
    arch: 'aarch64',
    category: 'compiled',
    primaryExecutable: 'bin/clang',
    testCommand: 'clang --version',
    compileCommand: 'clang -Wall -O2 "$FILE" -o "$OUTPUT"',
    runCommand: './"$OUTPUT"',
    dependencies: ['libllvm', 'lld', 'binutils', 'libc++', 'ndk-sysroot', 'make'],
    description: 'Modern Clang/LLVM C compiler with Android NDK sysroot, libc++, GNU binutils, and Make.'
  },
  cpp: {
    folder: 'c_cpp',
    displayName: 'C++ (Clang++ / LLVM)',
    version: '21.1.8-3',
    arch: 'aarch64',
    category: 'compiled',
    primaryExecutable: 'bin/clang++',
    testCommand: 'clang++ --version',
    compileCommand: 'clang++ -std=c++17 -Wall -O2 "$FILE" -o "$OUTPUT"',
    runCommand: './"$OUTPUT"',
    dependencies: ['libllvm', 'lld', 'binutils', 'libc++', 'ndk-sysroot', 'make'],
    description: 'Modern Clang/LLVM C++ compiler supporting C++17/C++20/C++23 standards with libc++ STL.'
  },
  java: {
    folder: 'java',
    displayName: 'Java (OpenJDK 21)',
    version: '21.0.12',
    arch: 'aarch64',
    category: 'compiled_bytecode',
    primaryExecutable: 'bin/javac',
    testCommand: 'java -version',
    compileCommand: 'javac "$FILE"',
    runCommand: 'java "${FILE%.*}"',
    dependencies: ['alsa-lib', 'dbus', 'libandroid-shmem', 'libiconv', 'libx11', 'zlib'],
    description: 'OpenJDK 21 compiler (javac), runtime (java), and tools targeting JVM on ARM64 Android.'
  },
  python: {
    folder: 'python',
    displayName: 'Python 3 (CPython 3.14)',
    version: '3.14.6-1',
    arch: 'aarch64',
    category: 'interpreted',
    primaryExecutable: 'bin/python3',
    testCommand: 'python3 --version',
    compileCommand: null,
    runCommand: 'python3 -u "$FILE"',
    dependencies: ['libandroid-support', 'libbz2', 'libexpat', 'libffi', 'liblzma', 'libsqlite', 'ncurses', 'openssl', 'readline', 'zlib'],
    description: 'CPython 3.14 interpreter with full standard library, SSL, SQLite3, and package manager support.'
  },
  nodejs: {
    folder: 'nodejs',
    displayName: 'Node.js (JavaScript)',
    version: '26.4.0-1',
    arch: 'aarch64',
    category: 'interpreted',
    primaryExecutable: 'bin/node',
    testCommand: 'node -v',
    compileCommand: null,
    runCommand: 'node "$FILE"',
    dependencies: ['c-ares', 'libandroid-execinfo', 'libicu', 'libnghttp2', 'openssl', 'zlib'],
    description: 'Node.js v26 JavaScript runtime built on Chrome V8 engine with full async I/O.'
  },
  typescript: {
    folder: 'nodejs',
    displayName: 'TypeScript',
    version: '26.4.0-1',
    arch: 'aarch64',
    category: 'transpiled',
    primaryExecutable: 'bin/node',
    testCommand: 'node -v',
    compileCommand: 'npx tsc "$FILE"',
    runCommand: 'npx ts-node "$FILE"',
    dependencies: ['c-ares', 'libandroid-execinfo', 'libicu', 'libnghttp2', 'openssl', 'zlib'],
    description: 'TypeScript execution environment via Node.js V8 engine and npm toolchain.'
  },
  go: {
    folder: 'go',
    displayName: 'Go (Golang)',
    version: '3:1.27.1',
    arch: 'aarch64',
    category: 'compiled',
    primaryExecutable: 'bin/go',
    testCommand: 'go version',
    compileCommand: 'go build -o "$OUTPUT" "$FILE"',
    runCommand: 'go run "$FILE"',
    dependencies: ['binutils', 'clang', 'libc++'],
    description: 'Go language compiler, standard library, and tooling with CGO support.'
  },
  rust: {
    folder: 'rust',
    displayName: 'Rust (Rustc & Cargo)',
    version: '1.98.1-1',
    arch: 'aarch64',
    category: 'compiled',
    primaryExecutable: 'bin/rustc',
    testCommand: 'rustc --version',
    compileCommand: 'rustc "$FILE" -o "$OUTPUT"',
    runCommand: './"$OUTPUT"',
    dependencies: ['binutils', 'clang', 'libc++', 'libllvm', 'openssl', 'zlib'],
    description: 'Rust compiler (rustc), Cargo package manager, and standard library for aarch64.'
  },
  kotlin: {
    folder: 'kotlin',
    displayName: 'Kotlin (Kotlinc)',
    version: '2.4.20',
    arch: 'aarch64',
    category: 'compiled_bytecode',
    primaryExecutable: 'bin/kotlinc',
    testCommand: 'kotlinc -version',
    compileCommand: 'kotlinc "$FILE" -include-runtime -d "${FILE%.*}.jar"',
    runCommand: 'java -jar "${FILE%.*}.jar"',
    dependencies: ['java'],
    description: 'Kotlin compiler and standard runtime targeting JVM on ARM64 Android.'
  },
  csharp: {
    folder: 'csharp',
    displayName: 'C# (Mono CLI & MCS)',
    version: '6.14.1-2',
    arch: 'aarch64',
    category: 'compiled_bytecode',
    primaryExecutable: 'bin/mcs',
    testCommand: 'mcs --version',
    compileCommand: 'mcs "$FILE" -out:"${FILE%.*}.exe"',
    runCommand: 'mono "${FILE%.*}.exe"',
    dependencies: ['krb5', 'zlib'],
    description: 'Mono open-source ECMA CLI, C# compiler (mcs), runtime engine, and BCL libraries.'
  },
  php: {
    folder: 'php',
    displayName: 'PHP (PHP-CLI)',
    version: '8.5.1',
    arch: 'aarch64',
    category: 'interpreted',
    primaryExecutable: 'bin/php',
    testCommand: 'php -v',
    compileCommand: null,
    runCommand: 'php "$FILE"',
    dependencies: ['libandroid-support', 'libcurl', 'libiconv', 'libxml2', 'libxslt', 'libzip', 'oniguruma', 'openssl', 'pcre2', 'zlib'],
    description: 'PHP command-line interpreter with cURL, OpenSSL, and XML modules for Android.'
  },
  ruby: {
    folder: 'ruby',
    displayName: 'Ruby (Ruby & Gem)',
    version: '4.0.7',
    arch: 'aarch64',
    category: 'interpreted',
    primaryExecutable: 'bin/ruby',
    testCommand: 'ruby -v',
    compileCommand: null,
    runCommand: 'ruby "$FILE"',
    dependencies: ['libcrypt', 'libffi', 'libgmp', 'libyaml', 'ncurses', 'openssl', 'readline', 'zlib'],
    description: 'Ruby dynamic object-oriented programming language interpreter and RubyGems.'
  },
  lua: {
    folder: 'lua',
    displayName: 'Lua 5.4',
    version: '5.4.8-10',
    arch: 'aarch64',
    category: 'interpreted',
    primaryExecutable: 'bin/lua',
    testCommand: 'lua -v',
    compileCommand: null,
    runCommand: 'lua "$FILE"',
    dependencies: ['readline'],
    description: 'Lua 5.4 lightweight, embeddable scripting language interpreter.'
  },
  web: {
    folder: 'python',
    displayName: 'Web (HTML / CSS / JS Server)',
    version: '3.14.6-1',
    arch: 'aarch64',
    category: 'web_server',
    primaryExecutable: 'bin/python3',
    testCommand: 'python3 -c "import http.server; print(\'HTTP Server Ready\')"',
    compileCommand: null,
    runCommand: 'python3 -m http.server 8080 --directory .',
    dependencies: ['python'],
    description: 'Static web application server for live previewing HTML, CSS, and client-side JavaScript.'
  }
};

function getFolderStats(folderPath) {
  let fileCount = 0;
  let dirCount = 0;
  let totalBytes = 0;

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
          totalBytes += fs.statSync(full).size;
        } catch (e) {}
      }
    }
  }

  walk(folderPath);
  return { fileCount, dirCount, totalBytes };
}

function buildManifests() {
  if (!fs.existsSync(MANIFESTS_DIR)) {
    fs.mkdirSync(MANIFESTS_DIR, { recursive: true });
  }

  const indexData = {
    schemaVersion: '1.0.0',
    server: 'TermCode Runtime Distribution Server',
    arch: 'aarch64',
    minAndroidApi: 24,
    updatedAt: new Date().toISOString(),
    totalTargets: Object.keys(TARGET_DEFINITIONS).length,
    runtimes: {}
  };

  const folderStatsCache = {};

  for (const [targetKey, def] of Object.entries(TARGET_DEFINITIONS)) {
    const folderPath = path.join(ROOT_DIR, def.folder);
    if (!folderStatsCache[def.folder]) {
      folderStatsCache[def.folder] = getFolderStats(folderPath);
    }

    const stats = folderStatsCache[def.folder];

    // Read symlinks count
    let symlinkCount = 0;
    const symlinksFile = path.join(folderPath, 'SYMLINKS.txt');
    if (fs.existsSync(symlinksFile)) {
      symlinkCount = fs.readFileSync(symlinksFile, 'utf8').split('\n').filter(l => l.trim().length > 0).length;
    }

    const manifest = {
      target: targetKey,
      displayName: def.displayName,
      runtimeFolder: def.folder,
      version: def.version,
      arch: def.arch,
      category: def.category,
      minAndroidApi: 24,
      fileCount: stats.fileCount,
      extractedSizeBytes: stats.totalBytes,
      extractedSizeMB: (stats.totalBytes / (1024 * 1024)).toFixed(2),
      symlinksCount: symlinkCount,
      primaryExecutable: def.primaryExecutable,
      testCommand: def.testCommand,
      compileCommand: def.compileCommand,
      runCommand: def.runCommand,
      environment: {
        PATH: '/data/data/com.termux/files/usr/bin:$PATH',
        LD_LIBRARY_PATH: '/data/data/com.termux/files/usr/lib',
        HOME: '/data/data/com.termux/files/home',
        TMPDIR: '/data/data/com.termux/files/usr/tmp'
      },
      dependencies: def.dependencies,
      downloadUrl: `/downloads/aarch64/${def.folder}-${def.version}-aarch64.tar.gz`,
      gitInstallCommand: `curl -sL https://raw.githubusercontent.com/raj40870-pixel/library/main/install.sh | sh -s ${def.folder}`,
      description: def.description,
      status: 'stable',
      verified: true
    };

    const outPath = path.join(MANIFESTS_DIR, `${targetKey}.json`);
    fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2), 'utf8');

    indexData.runtimes[targetKey] = {
      target: targetKey,
      displayName: def.displayName,
      version: def.version,
      category: def.category,
      runtimeFolder: def.folder,
      sizeMB: manifest.extractedSizeMB,
      executable: def.primaryExecutable,
      manifestUrl: `/api/runtime/${targetKey}?arch=${def.arch}`
    };

    console.log(`[MANIFEST] Generated manifests/${targetKey}.json (${manifest.extractedSizeMB} MB)`);
  }

  const indexPath = path.join(MANIFESTS_DIR, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), 'utf8');
  console.log(`[MANIFEST] Generated manifests/index.json with ${Object.keys(TARGET_DEFINITIONS).length} targets.`);
}

if (require.main === module) {
  buildManifests();
}

module.exports = { buildManifests, TARGET_DEFINITIONS };
