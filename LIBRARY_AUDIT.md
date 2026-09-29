# TermCode Language Library - Full Inventory & Audit Report

**Audit Date:** 2026-09-29T16:00:43.275Z
**Target Architecture:** `aarch64` (ARM64 Android)
**Host Compatibility:** Termux Android Environment (`/data/data/com.termux/files/usr`)
**Total Inventory:** 11 Toolchains | 49,204 Files | 3.76 GB Extracted

## 1. Runtime Inventory Summary Table

| Target(s) | Language / Runtime | Version | Arch | Extracted Size | Files | Symlinks | Key Executables | Status |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- | :---: |
| `c`, `cpp` | **C / C++ (Clang & LLVM Toolchain)** | `21.1.8-3` | `aarch64` | 526.95 MB | 8342 | 118 | `clang, clang++, make, ld.lld` | ✅ Ready |
| `java` | **Java (OpenJDK 21)** | `21.0.12` | `aarch64` | 192.02 MB | 2277 | 246 | `java, javac, jar` | ✅ Ready |
| `python`, `web` | **Python 3 (CPython 3.14)** | `3.14.6-1` | `aarch64` | 57.79 MB | 1413 | 94 | `python3, python, pip` | ⚠️ Warning |
| `nodejs`, `typescript` | **Node.js & TypeScript** | `26.4.0-1` | `aarch64` | 197.75 MB | 2490 | 23 | `node, npm, npx` | ✅ Ready |
| `go` | **Go (Golang)** | `3:1.27.1` | `aarch64` | 741.07 MB | 15765 | 112 | `go, gofmt` | ✅ Ready |
| `rust` | **Rust (Rustc & Cargo)** | `1.98.1-1` | `aarch64` | 1226.07 MB | 8290 | 133 | `rustc, cargo` | ✅ Ready |
| `kotlin` | **Kotlin (Kotlinc)** | `2.4.20` | `aarch64` | 283.18 MB | 2373 | 253 | `kotlinc, kotlin` | ✅ Ready |
| `csharp` | **C# (Mono CLI & MCS)** | `6.14.1-2` | `aarch64` | 294.52 MB | 3787 | 257 | `mono, mcs, csharp` | ✅ Ready |
| `php` | **PHP (PHP-CLI)** | `8.5.1` | `aarch64` | 254.73 MB | 1216 | 83 | `php` | ✅ Ready |
| `ruby` | **Ruby (Ruby & Gem)** | `4.0.7` | `aarch64` | 71.12 MB | 3229 | 59 | `ruby, gem, bundle` | ✅ Ready |
| `lua` | **Lua 5.4** | `5.4.8-10` | `aarch64` | 2.20 MB | 22 | 8 | `lua, luac` | ✅ Ready |

## 2. Detailed Toolchain Breakdown

### C / C++ (Clang & LLVM Toolchain) (`c_cpp`)

- **Version:** `21.1.8-3`
- **Supported Targets:** `c`, `cpp`
- **Architecture:** `aarch64`
- **Extracted Disk Size:** 526.95 MB (552,544,009 bytes)
- **Total Files:** 8342 across 467 subdirectories
- **Preserved Symlinks:** 118 links cataloged in `SYMLINKS.txt`
- **Upstream Source:** Termux Official Packages (clang 21.1.8-3, binutils 2.47, make 4.4.1-1, ndk-sysroot 30, libc++ 30)
- **Dependencies:** `libllvm`, `lld`, `binutils`, `libc++`, `ndk-sysroot`, `make`
- **Description:** LLVM/Clang C & C++ compiler suite with libc++, NDK sysroot, GNU binutils, and Make for Android aarch64.
- **Executable Verification:**
  - `bin/clang`: ✅ Verified Present
  - `bin/clang++`: ✅ Verified Present
  - `bin/make`: ✅ Verified Present
  - `bin/ld.lld`: ✅ Verified Present

### Java (OpenJDK 21) (`java`)

- **Version:** `21.0.12`
- **Supported Targets:** `java`
- **Architecture:** `aarch64`
- **Extracted Disk Size:** 192.02 MB (201,344,569 bytes)
- **Total Files:** 2277 across 315 subdirectories
- **Preserved Symlinks:** 246 links cataloged in `SYMLINKS.txt`
- **Upstream Source:** Termux Official Packages (openjdk-21 21.0.12)
- **Dependencies:** `alsa-lib`, `dbus`, `libandroid-shmem`, `libiconv`, `libx11`, `zlib`
- **Description:** OpenJDK 21 runtime and compiler environment with HotSpot 64-Bit Server VM for Android aarch64.
- **Executable Verification:**
  - `bin/java`: ✅ Verified Present
  - `bin/javac`: ✅ Verified Present
  - `bin/jar`: ✅ Verified Present

### Python 3 (CPython 3.14) (`python`)

- **Version:** `3.14.6-1`
- **Supported Targets:** `python`, `web`
- **Architecture:** `aarch64`
- **Extracted Disk Size:** 57.79 MB (60,598,370 bytes)
- **Total Files:** 1413 across 113 subdirectories
- **Preserved Symlinks:** 94 links cataloged in `SYMLINKS.txt`
- **Upstream Source:** Termux Official Packages (python 3.14.6-1, openssl, libsqlite, readline)
- **Dependencies:** `libandroid-support`, `libbz2`, `libexpat`, `libffi`, `liblzma`, `libsqlite`, `ncurses`, `openssl`, `readline`, `zlib`
- **Description:** CPython 3.14 interpreter with standard library, OpenSSL, SQLite, Readline, and HTTP server for Android aarch64.
- **Executable Verification:**
  - `bin/python3`: ✅ Verified Present
  - `bin/python`: ✅ Verified Present
  - `bin/pip`: ❌ MISSING

### Node.js & TypeScript (`nodejs`)

- **Version:** `26.4.0-1`
- **Supported Targets:** `nodejs`, `typescript`
- **Architecture:** `aarch64`
- **Extracted Disk Size:** 197.75 MB (207,353,411 bytes)
- **Total Files:** 2490 across 490 subdirectories
- **Preserved Symlinks:** 23 links cataloged in `SYMLINKS.txt`
- **Upstream Source:** Termux Official Packages (nodejs 26.4.0-1, npm 11.20.0)
- **Dependencies:** `c-ares`, `libandroid-execinfo`, `libicu`, `libnghttp2`, `openssl`, `zlib`
- **Description:** Node.js v26 JavaScript runtime with V8 engine, npm package manager, and full TypeScript execution support.
- **Executable Verification:**
  - `bin/node`: ✅ Verified Present
  - `bin/npm`: ✅ Verified Present
  - `bin/npx`: ✅ Verified Present

### Go (Golang) (`go`)

- **Version:** `3:1.27.1`
- **Supported Targets:** `go`
- **Architecture:** `aarch64`
- **Extracted Disk Size:** 741.07 MB (777,070,544 bytes)
- **Total Files:** 15765 across 1410 subdirectories
- **Preserved Symlinks:** 112 links cataloged in `SYMLINKS.txt`
- **Upstream Source:** Termux Official Packages (golang 3:1.27.1)
- **Dependencies:** `binutils`, `clang`, `libc++`
- **Description:** Go programming language compiler, standard library, and tooling with CGO support for Android aarch64.
- **Executable Verification:**
  - `bin/go`: ✅ Verified Present
  - `bin/gofmt`: ✅ Verified Present

### Rust (Rustc & Cargo) (`rust`)

- **Version:** `1.98.1-1`
- **Supported Targets:** `rust`
- **Architecture:** `aarch64`
- **Extracted Disk Size:** 1226.07 MB (1,285,631,721 bytes)
- **Total Files:** 8290 across 489 subdirectories
- **Preserved Symlinks:** 133 links cataloged in `SYMLINKS.txt`
- **Upstream Source:** Termux Official Packages (rust 1.98.1-1, rust-std-aarch64-linux-android 1.98.1-1)
- **Dependencies:** `binutils`, `clang`, `libc++`, `libllvm`, `openssl`, `zlib`
- **Description:** Rust compiler, Cargo package manager, and standard library targeting aarch64-linux-android.
- **Executable Verification:**
  - `bin/rustc`: ✅ Verified Present
  - `bin/cargo`: ✅ Verified Present

### Kotlin (Kotlinc) (`kotlin`)

- **Version:** `2.4.20`
- **Supported Targets:** `kotlin`
- **Architecture:** `aarch64`
- **Extracted Disk Size:** 283.18 MB (296,934,584 bytes)
- **Total Files:** 2373 across 322 subdirectories
- **Preserved Symlinks:** 253 links cataloged in `SYMLINKS.txt`
- **Upstream Source:** Termux Official Packages (kotlin 2.4.20_all, openjdk-21)
- **Dependencies:** `java`
- **Description:** Kotlin compiler and standard runtime libraries for targeting the Java Virtual Machine on Android.
- **Executable Verification:**
  - `bin/kotlinc`: ✅ Verified Present
  - `bin/kotlin`: ✅ Verified Present

### C# (Mono CLI & MCS) (`csharp`)

- **Version:** `6.14.1-2`
- **Supported Targets:** `csharp`
- **Architecture:** `aarch64`
- **Extracted Disk Size:** 294.52 MB (308,826,009 bytes)
- **Total Files:** 3787 across 493 subdirectories
- **Preserved Symlinks:** 257 links cataloged in `SYMLINKS.txt`
- **Upstream Source:** Termux Official Packages (mono 6.14.1-2, mono-libs 6.14.1-2)
- **Dependencies:** `krb5`, `zlib`
- **Description:** Mono open source ECMA CLI, C# compiler (mcs), runtime engine, and BCL libraries for Android aarch64.
- **Executable Verification:**
  - `bin/mono`: ✅ Verified Present
  - `bin/mcs`: ✅ Verified Present
  - `bin/csharp`: ✅ Verified Present

### PHP (PHP-CLI) (`php`)

- **Version:** `8.5.1`
- **Supported Targets:** `php`
- **Architecture:** `aarch64`
- **Extracted Disk Size:** 254.73 MB (267,101,101 bytes)
- **Total Files:** 1216 across 117 subdirectories
- **Preserved Symlinks:** 83 links cataloged in `SYMLINKS.txt`
- **Upstream Source:** Termux Official Packages (php 8.5.1, libxml2, libxslt, openssl)
- **Dependencies:** `libandroid-support`, `libcurl`, `libiconv`, `libxml2`, `libxslt`, `libzip`, `oniguruma`, `openssl`, `pcre2`, `zlib`
- **Description:** PHP command-line interpreter with core extensions, OpenSSL, libxml2, and cURL for Android aarch64.
- **Executable Verification:**
  - `bin/php`: ✅ Verified Present

### Ruby (Ruby & Gem) (`ruby`)

- **Version:** `4.0.7`
- **Supported Targets:** `ruby`
- **Architecture:** `aarch64`
- **Extracted Disk Size:** 71.12 MB (74,577,664 bytes)
- **Total Files:** 3229 across 672 subdirectories
- **Preserved Symlinks:** 59 links cataloged in `SYMLINKS.txt`
- **Upstream Source:** Termux Official Packages (ruby 4.0.7, openssl, libyaml)
- **Dependencies:** `libcrypt`, `libffi`, `libgmp`, `libyaml`, `ncurses`, `openssl`, `readline`, `zlib`
- **Description:** Ruby object-oriented dynamic language interpreter, standard library, and RubyGems package manager.
- **Executable Verification:**
  - `bin/ruby`: ✅ Verified Present
  - `bin/gem`: ✅ Verified Present
  - `bin/bundle`: ✅ Verified Present

### Lua 5.4 (`lua`)

- **Version:** `5.4.8-10`
- **Supported Targets:** `lua`
- **Architecture:** `aarch64`
- **Extracted Disk Size:** 2.20 MB (2,304,296 bytes)
- **Total Files:** 22 across 8 subdirectories
- **Preserved Symlinks:** 8 links cataloged in `SYMLINKS.txt`
- **Upstream Source:** Termux Official Packages (lua54 5.4.8-10, readline)
- **Dependencies:** `readline`
- **Description:** Lua 5.4 lightweight, embeddable scripting language interpreter and bytecode compiler for Android aarch64.
- **Executable Verification:**
  - `bin/lua`: ✅ Verified Present
  - `bin/luac`: ✅ Verified Present

## 3. Security, Permissions & Symlinks Protocol

- **POSIX Permissions:** All binaries under `bin/` must be granted `chmod 0755` upon deployment.
- **Symlink Restoration:** Extracted archives on Android must read `SYMLINKS.txt` and run `ln -sf <target> <link>` to guarantee dynamic linkers and shared objects resolve correctly without duplicate disk footprint.
- **Library Path Configuration:** Ensure `LD_LIBRARY_PATH=/data/data/com.termux/files/usr/lib` is configured in the execution environment.
