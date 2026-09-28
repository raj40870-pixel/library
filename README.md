# TermCode Language Library Backend

Backend server for TermCode IDE to distribute and serve multi-language toolchains (aarch64) dynamically.

## Live Status
- **Root URL (`/`):** Outputs `Backend is running`
- **Port:** `3000` (or `PORT` environment variable on Google Cloud Run)

## Supported Languages & Toolchains
1. **C / C++** (`/c_cpp`) - Clang, Clang++, libc++, Make, NDK Sysroot
2. **Java** (`/java`) - OpenJDK 21 Runtime, Compiler (javac), JVM
3. **Python** (`/python`) - Python 3.14 Runtime, standard libraries, HTML/CSS web server
4. **Node.js** (`/nodejs`) - Node.js V8 Engine, NPM, TypeScript support
5. **Go** (`/go`) - Golang Toolchain, Standard Library
6. **Rust** (`/rust`) - Rustc Compiler, Cargo Package Manager
7. **Kotlin** (`/kotlin`) - Kotlin CLI Compiler (kotlinc), Runtime
8. **C#** (`/csharp`) - Mono CLI Runtime, MCS Compiler
9. **PHP** (`/php`) - PHP CLI Interpreter
10. **Ruby** (`/ruby`) - Ruby Interpreter, Gem Package Manager
11. **Lua** (`/lua`) - Lua 5.4 Standalone Interpreter

## Quick Start
```bash
npm start
```
Server will start and listen on `http://localhost:3000`.

## Installation Command for Mobile Terminals
```bash
curl -sL http://<HOST>:3000/install/<language> | sh
```
Example:
```bash
curl -sL http://<HOST>:3000/install/python | sh
curl -sL http://<HOST>:3000/install/c_cpp | sh
curl -sL http://<HOST>:3000/install/java | sh
```
