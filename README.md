# TermCode Runtime & Toolchain Distribution Server

Official Toolchain & Runtime Distribution Platform for **TermCode IDE** on Android (`aarch64` / Termux environment).

---

## 🏛️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                 TermCode Android IDE Client                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                          HTTP │ GET /api/runtime/:language?arch=aarch64
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             TermCode Runtime Distribution Server            │
│  - REST API Engine (Node.js Zero-Dependency Native Server)  │
│  - Manifest Registry (Version, Arch, SHA-256, Environment)  │
│  - Range-Enabled Streaming Archive Engine                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                  Package Data │ .tar.gz / Git Sparse Checkout
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Android Target Execution Space                │
│             /data/data/com.termux/files/usr/                │
│  ├── bin/          (Chmod 0755 Executables)                 │
│  ├── lib/          (Dynamic Linker Shared Objects)          │
│  ├── include/      (Standard Headers & C++ STL)             │
│  └── SYMLINKS.txt  (Automatic Link Restoration)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 14 Supported Language Targets

| Target | Display Name | Version | Compiler / Runtime | Test Command | Extracted Size |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `c` | C (Clang / LLVM) | `21.1.8-3` | Clang Compiler | `clang --version` | 526.95 MB |
| `cpp` | C++ (Clang++ / LLVM) | `21.1.8-3` | Clang++ Compiler | `clang++ --version` | 526.95 MB |
| `java` | Java (OpenJDK 21) | `21.0.12` | OpenJDK HotSpot JVM | `java -version` | 192.02 MB |
| `python` | Python 3 (CPython) | `3.14.6-1` | Python 3 Interpreter | `python3 --version` | 57.79 MB |
| `nodejs` | Node.js (JavaScript) | `26.4.0-1` | Node.js V8 Runtime | `node -v` | 197.75 MB |
| `typescript` | TypeScript | `26.4.0-1` | Node.js + ts-node | `node -v` | 197.75 MB |
| `go` | Go (Golang) | `3:1.27.1` | Go Compiler & Stdlib | `go version` | 741.07 MB |
| `rust` | Rust (Rustc & Cargo) | `1.98.1-1` | Rustc & Cargo | `rustc --version` | 1,226.07 MB |
| `kotlin` | Kotlin (Kotlinc) | `2.4.20` | Kotlin JVM Compiler | `kotlinc -version` | 283.18 MB |
| `csharp` | C# (Mono CLI & MCS) | `6.14.1-2` | Mono Runtime & MCS | `mcs --version` | 294.52 MB |
| `php` | PHP (PHP-CLI) | `8.5.1` | PHP CLI Interpreter | `php -v` | 254.73 MB |
| `ruby` | Ruby (Ruby & Gem) | `4.0.7` | Ruby Interpreter | `ruby -v` | 71.12 MB |
| `lua` | Lua 5.4 | `5.4.8-10` | Lua Interpreter | `lua -v` | 2.20 MB |
| `web` | Web Application Server | `3.14.6-1` | Python HTTP Server | `python3 -m http.server 8080` | 57.79 MB |

---

## 💻 1-Line Installation via Terminal

Run this command inside the TermCode / Termux terminal for your target language:

```bash
# Example: Install Python 3
curl -sL https://raw.githubusercontent.com/raj40870-pixel/library/main/install.sh | sh -s python

# Example: Install C & C++ Clang Toolchain
curl -sL https://raw.githubusercontent.com/raj40870-pixel/library/main/install.sh | sh -s c_cpp

# Example: Install OpenJDK 21
curl -sL https://raw.githubusercontent.com/raj40870-pixel/library/main/install.sh | sh -s java

# Example: Install Node.js & TypeScript
curl -sL https://raw.githubusercontent.com/raj40870-pixel/library/main/install.sh | sh -s nodejs
```

---

## ⚡ Running the Distribution Server

The server uses Node.js native standard library with **zero external dependencies** (0 KB download required):

```bash
# Start server (default port 3000)
node server.js

# Or custom port
PORT=8080 node server.js
```

### Server REST API Endpoints

- `GET /` - Root discovery & service catalog
- `GET /health` - System health, memory, and uptime telemetry
- `GET /api/runtimes` - Index of all registered language targets
- `GET /api/runtime/:language?arch=aarch64` - Manifest for a specific language
- `GET /downloads/:arch/:package` - Stream package tarball archive
- `GET /checksums/:arch.sha256` - Raw SHA-256 integrity hash file
- `GET /install.sh` - Universal terminal installation script

---

## 📱 Android Client Integration (Kotlin / Java)

When a user in **Code Editor** attempts to execute code for a language:

1. **Check Local Binary**:
   Check if `/data/data/com.termux/files/usr/bin/<executable>` exists and has executable permissions.
2. **Fetch Manifest**:
   If missing, send HTTP GET to `https://<server>/api/runtime/<target>?arch=aarch64`.
3. **Download Package**:
   Stream package from `downloadUrl` with progress notification.
4. **Extract & Restore Symlinks**:
   Extract archive to `/data/data/com.termux/files/usr/`, chmod `0755` on `bin/`, and execute `SYMLINKS.txt` commands.
5. **Verify Version**:
   Execute `testCommand` inside the terminal environment.
6. **Run Code**:
   Execute user code via `runCommand` or `compileCommand`.

---

## 📂 Repository Directory Layout

```text
library/
├── .github/workflows/
│   └── ci.yml                 # Automated validation workflow
├── checksums/
│   └── aarch64.sha256         # Master SHA-256 package checksums
├── manifests/
│   ├── index.json             # Global runtime catalog
│   ├── c.json                 # C Clang manifest
│   ├── cpp.json               # C++ Clang++ manifest
│   ├── java.json              # OpenJDK 21 manifest
│   ├── python.json            # Python 3 manifest
│   ├── nodejs.json            # Node.js manifest
│   ├── typescript.json        # TypeScript manifest
│   ├── go.json                # Golang manifest
│   ├── rust.json              # Rustc & Cargo manifest
│   ├── kotlin.json            # Kotlin manifest
│   ├── csharp.json            # Mono C# manifest
│   ├── php.json               # PHP CLI manifest
│   ├── ruby.json              # Ruby manifest
│   ├── lua.json               # Lua manifest
│   └── web.json               # Web static server manifest
├── licenses/
│   ├── THIRD-PARTY-NOTICES.md # Open source notices
│   ├── Apache-2.0.txt
│   └── MIT.txt
├── scripts/
│   ├── audit-library.js       # Deep directory audit & inventory
│   ├── build-manifests.js     # Generates manifest JSON schemas
│   ├── package-runtimes.js    # Packages runtimes into tarballs
│   ├── validate-library.js    # Validates schemas & executables
│   └── test-server.js         # Automated HTTP test suite
├── c_cpp/                     # Extracted Clang/LLVM toolchain
├── java/                      # Extracted OpenJDK 21
├── python/                    # Extracted Python 3.14
├── nodejs/                    # Extracted Node.js 26
├── go/                        # Extracted Go 1.27
├── rust/                      # Extracted Rust 1.98
├── kotlin/                    # Extracted Kotlin 2.4
├── csharp/                    # Extracted Mono 6.14
├── php/                       # Extracted PHP 8.5
├── ruby/                      # Extracted Ruby 4.0
├── lua/                       # Extracted Lua 5.4
├── server.js                  # Zero-dependency Node.js HTTP server
├── package.json               # Project manifest
├── Dockerfile                 # Container image specification
├── .dockerignore              # Container exclusions
├── .gitignore                 # Git ignore specification
├── install.sh                 # Universal Termux client installer
├── API.md                     # Full REST API specification
├── LIBRARY_AUDIT.md           # Complete system audit report
└── README.md                  # Main documentation
```

---

## ⚖️ License & Attribution

- Server code and manifest specifications are licensed under the [Apache-2.0 License](licenses/Apache-2.0.txt).
- All distributed binaries and toolchains are copyright of their respective upstream authors (LLVM, GNU, OpenJDK, Python Software Foundation, OpenJS, Google, Rust Project, JetBrains, Mono Project, PHP Group, Lua.org, Termux). See [licenses/THIRD-PARTY-NOTICES.md](licenses/THIRD-PARTY-NOTICES.md) for full notices.
