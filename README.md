# TermCode IDE - Multi-Language Compiler & Runtime Library 🚀
### *Official Standalone Toolchain & Runtime Distribution Platform for CodeEditor IDE on Android (`aarch64` / ARM64)*

[![Release](https://img.shields.io/badge/Release-v1.3.1_Official_CDN-success?style=for-the-badge&logo=github&logoColor=white)](https://github.com/raj40870-pixel/library/releases/tag/v1.3.1)
[![CodeEditor IDE](https://img.shields.io/badge/CodeEditor_IDE-v1.3.2_Compatible-blue?style=for-the-badge&logo=android&logoColor=white)](https://github.com/raj40870-pixel/code-eidter-app)
[![Official Website](https://img.shields.io/badge/Official_Website-Live_on_Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://code-eidter-apk-website.vercel.app/)
[![Architecture](https://img.shields.io/badge/Architecture-ARM64_%2F_aarch64-informational?style=for-the-badge&logo=arm&logoColor=white)](https://github.com/raj40870-pixel/library)
[![License](https://img.shields.io/badge/License-Apache_2.0-orange?style=for-the-badge)](licenses/Apache-2.0.txt)

---

## 🌐 Ecosystem Quick Links

- 📱 **Official Android App (v1.3.2)**: [raj40870-pixel/code-eidter-app](https://github.com/raj40870-pixel/code-eidter-app)
- 🌐 **Official Web Portal & APK Download**: [https://code-eidter-apk-website.vercel.app/](https://code-eidter-apk-website.vercel.app/)
- 📦 **Latest Toolchain Release (CDN)**: [GitHub Releases v1.3.1](https://github.com/raj40870-pixel/library/releases/tag/v1.3.1)

---

## 🌟 Overview

This repository powers the official compiler and runtime distribution system for **CodeEditor IDE (TermCode)** on Android (`aarch64`).

All compiler toolchains and runtime environments are pre-built, optimized, and hosted directly on **GitHub Releases CDN ([v1.3.1](https://github.com/raj40870-pixel/library/releases/tag/v1.3.1))**. When a user runs code on their phone, the app automatically streams the verified package straight from GitHub Releases CDN into the sandboxed Linux userland (`/data/data/com.termux/files/usr/`) for high-speed, 100% native on-device compilation and execution.

---

## 🏛️ How It Works

```mermaid
flowchart TD
    User([User Taps 'Run' in CodeEditor IDE]) --> CheckBin{Is Compiler Installed in /usr/bin?}
    CheckBin -- Yes --> RunCode[Execute Native Code in Sandboxed Linux Terminal]
    CheckBin -- No --> CDNFetch[Download Standalone Package Directly from GitHub Releases CDN v1.3.1]
    CDNFetch --> Progress[In-App Real-Time 0-100% Download Progress Dialog with HTTP Resume]
    Progress --> Extract[Extract Directly into /data/data/com.termux/files/usr/]
    Extract --> Perms[Set Executable Permissions & Restore Linker Symlinks]
    Perms --> RunCode
```

---

## 🚀 Supported Languages & Standalone CDN Downloads (v1.3.1)

All packages below are built for **Android `aarch64` (ARM64)** and hosted globally on **GitHub Releases CDN**:

| Language / Stack | Included Tools & Runtimes | Version | Package (.zip) | Direct CDN Download (v1.3.1) | Download Size | Extracted Size | Verification Command |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Python 3** | Python 3, Pip, SQLite, OpenSSL | `3.14.6-1` | `python.zip` | [Download](https://github.com/raj40870-pixel/library/releases/download/v1.3.1/python.zip) | 22.0 MB | 57.8 MB | `python3 --version` |
| **C & C++** | Clang 21, Clang++, GCC, G++, Make, STL | `21.1.8-3` | `c_cpp.zip` | [Download](https://github.com/raj40870-pixel/library/releases/download/v1.3.1/c_cpp.zip) | 207.0 MB | 526.9 MB | `clang --version && clang++ --version` |
| **Java** | OpenJDK 21 HotSpot JVM, javac, java, jar | `21.0.12` | `java.zip` | [Download](https://github.com/raj40870-pixel/library/releases/download/v1.3.1/java.zip) | 143.2 MB | 192.0 MB | `javac -version && java -version` |
| **Node.js & TS** | Node.js V8 Runtime, NPM, TypeScript (`ts-node`) | `26.4.0-1` | `nodejs.zip` | [Download](https://github.com/raj40870-pixel/library/releases/download/v1.3.1/nodejs.zip) | 73.1 MB | 197.8 MB | `node -v && npm -v` |
| **Go (Golang)** | Go Compiler, Toolchain & Full Standard Library | `3:1.27.1` | `go.zip` | [Download](https://github.com/raj40870-pixel/library/releases/download/v1.3.1/go.zip) | 269.7 MB | 741.1 MB | `go version` |
| **Rust** | Rustc Compiler (LLVM backend), Cargo | `1.98.1-1` | `rust.zip` | [Download](https://github.com/raj40870-pixel/library/releases/download/v1.3.1/rust.zip) | 283.0 MB | 1,226.1 MB | `rustc --version && cargo --version` |
| **Kotlin** | Kotlinc JVM Compiler & Kotlin Runtime | `2.4.20` | `kotlin.zip` | [Download](https://github.com/raj40870-pixel/library/releases/download/v1.3.1/kotlin.zip) | 228.1 MB | 283.2 MB | `kotlinc -version` |
| **C# (.NET)** | Mono 6.14 Runtime, MCS C# Compiler | `6.14.1-2` | `csharp.zip` | [Download](https://github.com/raj40870-pixel/library/releases/download/v1.3.1/csharp.zip) | 109.8 MB | 294.5 MB | `mcs --version && mono --version` |
| **PHP** | PHP 8.5 CLI Interpreter & Modules | `8.5.1` | `php.zip` | [Download](https://github.com/raj40870-pixel/library/releases/download/v1.3.1/php.zip) | 82.6 MB | 254.7 MB | `php -v` |
| **Ruby** | Ruby 4.0 Interpreter, RubyGems, Bundler | `4.0.7` | `ruby.zip` | [Download](https://github.com/raj40870-pixel/library/releases/download/v1.3.1/ruby.zip) | 28.0 MB | 71.1 MB | `ruby -v` |
| **Lua** | Lua 5.4 Standalone Interpreter | `5.4.8-10` | `lua.zip` | [Download](https://github.com/raj40870-pixel/library/releases/download/v1.3.1/lua.zip) | 1.0 MB | 2.2 MB | `lua -v` |

---

## ⚡ How Installation Works

### 1. Automatic Zero-Config In-App Installation (Recommended)
You do not need to install anything manually:
1. Open any source code file (e.g. `main.py`, `main.cpp`, `Main.java`) in **CodeEditor IDE**.
2. Tap the **RUN (▶️)** button.
3. If the required compiler is missing, the IDE automatically pops up a **0%–100% download progress dialog**, downloads the package directly from GitHub Releases CDN (`v1.3.1`), extracts it, and executes your code immediately.

---

### 2. Terminal Package Manager (`pkg install`)
You can also install any package directly inside the app's integrated Linux terminal:

```bash
# Install all 11 toolchains at once:
pkg install all

# Or install individual toolchains:
pkg install python     # Python 3.14 + Pip + SQLite
pkg install clang      # C & C++ Clang 21, GCC, G++, Make
pkg install java       # OpenJDK 21, javac, java, jar
pkg install nodejs     # Node.js 26, NPM, TypeScript
pkg install go         # Golang 1.27 compiler & stdlib
pkg install rust       # Rustc 1.98 compiler, Cargo
pkg install kotlin     # Kotlin 2.4 JVM compiler & kotlinc
pkg install csharp     # Mono 6.14 C# runtime & MCS compiler
pkg install php        # PHP 8.5 CLI interpreter
pkg install ruby       # Ruby 4.0 interpreter & RubyGems
pkg install lua        # Lua 5.4 standalone interpreter
```

---

## 🏃 Code Execution Quick Reference

| Language | Starter File | Compile Command | Run Command |
| :--- | :--- | :--- | :--- |
| **Python** | `main.py` | *(Interpreted)* | `python3 -u main.py` |
| **C** | `main.c` | `clang -Wall -O2 main.c -o main` | `./main` |
| **C++** | `main.cpp` | `clang++ -std=c++17 -Wall -O2 main.cpp -o main` | `./main` |
| **Java** | `Main.java` | `javac Main.java` | `java Main` |
| **JavaScript** | `main.js` | *(Interpreted)* | `node main.js` |
| **TypeScript** | `main.ts` | `npx tsc main.ts` | `npx ts-node main.ts` |
| **Go** | `main.go` | `go build -o app main.go` | `go run main.go` |
| **Rust** | `main.rs` | `rustc main.rs -o main` | `./main` |
| **Kotlin** | `Main.kt` | `kotlinc Main.kt -include-runtime -d Main.jar` | `java -jar Main.jar` |
| **C#** | `Program.cs` | `mcs Program.cs -out:Program.exe` | `mono Program.exe` |
| **PHP** | `index.php` | *(Interpreted)* | `php index.php` |
| **Ruby** | `main.rb` | *(Interpreted)* | `ruby main.rb` |
| **Lua** | `main.lua` | *(Interpreted)* | `lua main.lua` |
| **HTML / Web**| `index.html`| *(Background HTTP Server)* | `python3 -m http.server 8080` *(In-App Web Preview)* |

---

## ⚖️ License & Attribution

- Manifest specifications and configurations are licensed under the [Apache-2.0 License](licenses/Apache-2.0.txt).
- All distributed binaries and toolchains are copyright of their respective upstream authors (LLVM, GNU, OpenJDK, Python Software Foundation, OpenJS, Google, Rust Project, JetBrains, Mono Project, PHP Group, Lua.org, Termux). See [licenses/THIRD-PARTY-NOTICES.md](licenses/THIRD-PARTY-NOTICES.md) for full notices.
