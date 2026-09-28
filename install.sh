#!/bin/sh
set -e

LANG_TARGET="$1"

if [ -z "$LANG_TARGET" ]; then
    echo "=========================================================="
    echo "  TermCode Language Toolchain Installer"
    echo "=========================================================="
    echo "Usage: curl -sL https://raw.githubusercontent.com/raj40870-pixel/library/main/install.sh | sh -s <language>"
    echo ""
    echo "Supported languages:"
    echo "  - python   (Python 3.14 + HTML/CSS Server)"
    echo "  - c_cpp    (C & C++ Clang/LLVM)"
    echo "  - java     (OpenJDK 21, JVM, javac, java)"
    echo "  - nodejs   (Node.js, NPM, TypeScript)"
    echo "  - go       (Golang compiler & stdlib)"
    echo "  - rust     (Rustc compiler, Cargo)"
    echo "  - kotlin   (Kotlin compiler - kotlinc)"
    echo "  - csharp   (Mono C# runtime, MCS)"
    echo "  - php      (PHP CLI Interpreter)"
    echo "  - ruby     (Ruby Interpreter, Gem)"
    echo "  - lua      (Lua 5.4 Interpreter)"
    echo "=========================================================="
    exit 1
fi

DEST="/data/data/com.termux/files/usr"
if [ -d "/data/user/0/com.termux/files/usr" ]; then
    DEST="/data/user/0/com.termux/files/usr"
fi

echo "=========================================================="
echo "==> Installing ${LANG_TARGET} from TermCode Library..."
echo "==> Destination: ${DEST}"
echo "=========================================================="

mkdir -p "$DEST/bin" "$DEST/lib" "$DEST/include"

# Ensure git is installed for sparse checkout
if ! command -v git >/dev/null 2>&1; then
    echo "==> Installing git dependency..."
    pkg install -y git 2>/dev/null || apt install -y git 2>/dev/null || true
fi

TMP_DIR="/data/local/tmp/termcode_dl_$$"
[ -d "/data/data/com.termux/files/home" ] && TMP_DIR="/data/data/com.termux/files/home/.cache/termcode_dl_$$"
mkdir -p "$TMP_DIR"

echo "==> Fetching ${LANG_TARGET} package from GitHub..."
git clone --depth 1 --filter=blob:none --sparse https://github.com/raj40870-pixel/library.git "$TMP_DIR"
cd "$TMP_DIR"
git sparse-checkout set "$LANG_TARGET"

if [ ! -d "$TMP_DIR/$LANG_TARGET" ]; then
    echo "==> ERROR: Language '${LANG_TARGET}' not found in repository!"
    rm -rf "$TMP_DIR"
    exit 1
fi

echo "==> Deploying files to environment..."
cp -rf "$TMP_DIR/$LANG_TARGET/"* "$DEST/" 2>/dev/null || true

# Decompress any .gz files if present (e.g. libLLVM or modules)
echo "==> Restoring optimized libraries..."
for gz in $(find "$DEST" -name "*.gz" 2>/dev/null); do
    gunzip -f "$gz" 2>/dev/null || true
done

# Set executable permissions
if [ -d "$DEST/bin" ]; then
    chmod -R 755 "$DEST/bin" 2>/dev/null || true
fi

# Cleanup temp
rm -rf "$TMP_DIR"

echo "=========================================================="
echo "==> SUCCESS: ${LANG_TARGET} is now installed and ready to run!"
echo "=========================================================="
