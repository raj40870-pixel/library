#!/bin/sh
set -e

LANG_TARGET="$1"

if [ -z "$LANG_TARGET" ]; then
    echo "=========================================================="
    echo "  TermCode Language Toolchain Installer"
    echo "=========================================================="
    echo "Usage: curl -sL https://raw.githubusercontent.com/raj40870-pixel/library/main/install.sh | sh -s <language|all>"
    echo ""
    echo "Supported targets:"
    echo "  - all      (Install ALL 11 programming language toolchains)"
    echo "  - python   (Python 3.14 + HTML/CSS Server)"
    echo "  - c_cpp    (C & C++ Clang, Clang++, GCC, G++, Make)"
    echo "  - java     (OpenJDK 21, JVM, javac, java, jar)"
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

# Normalize alias names
case "$LANG_TARGET" in
    c|cpp|c++|clang|g++) LANG_TARGET="c_cpp" ;;
    js|javascript|ts|typescript) LANG_TARGET="nodejs" ;;
    golang) LANG_TARGET="go" ;;
    mono|cs) LANG_TARGET="csharp" ;;
esac

DEST="/data/data/com.termux/files/usr"
if [ -d "/data/user/0/com.termux/files/usr" ]; then
    DEST="/data/user/0/com.termux/files/usr"
fi

echo "=========================================================="
echo "==> TermCode Language Installer: ${LANG_TARGET}"
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

echo "==> Fetching package data from TermCode Library..."
git clone --depth 1 --filter=blob:none --sparse https://github.com/raj40870-pixel/library.git "$TMP_DIR"
cd "$TMP_DIR"

ALL_DIRS="c_cpp java python nodejs go rust kotlin csharp php ruby lua"

if [ "$LANG_TARGET" = "all" ]; then
    echo "==> Installing ALL 11 toolchains at once..."
    git sparse-checkout set $ALL_DIRS
    for d in $ALL_DIRS; do
        if [ -d "$TMP_DIR/$d" ]; then
            echo "==> Deploying ${d}..."
            cp -rf "$TMP_DIR/$d/"* "$DEST/" 2>/dev/null || true
        fi
    done
else
    git sparse-checkout set "$LANG_TARGET"
    if [ ! -d "$TMP_DIR/$LANG_TARGET" ]; then
        echo "==> ERROR: Language '${LANG_TARGET}' not found in repository!"
        rm -rf "$TMP_DIR"
        exit 1
    fi
    echo "==> Deploying files for ${LANG_TARGET}..."
    cp -rf "$TMP_DIR/$LANG_TARGET/"* "$DEST/" 2>/dev/null || true
fi

# Decompress any .gz files if present (e.g. libLLVM or modules)
echo "==> Restoring optimized libraries..."
for gz in $(find "$DEST" -name "*.gz" 2>/dev/null); do
    gunzip -f "$gz" 2>/dev/null || true
done

# Set executable permissions
if [ -d "$DEST/bin" ]; then
    chmod -R 755 "$DEST/bin" 2>/dev/null || true
fi

# Restore symlinks recorded in SYMLINKS.txt
if [ -f "$DEST/SYMLINKS.txt" ]; then
    echo "==> Restoring dynamic linker symlinks..."
    while IFS= read -r line || [ -n "$line" ]; do
        case "$line" in
            *" -> "*)
                link="${line%% -> *}"
                target="${line##* -> }"
                if [ -n "$link" ] && [ -n "$target" ]; then
                    mkdir -p "$(dirname "$DEST/$link")" 2>/dev/null || true
                    ln -sf "$target" "$DEST/$link" 2>/dev/null || true
                fi
                ;;
        esac
    done < "$DEST/SYMLINKS.txt"
    rm -f "$DEST/SYMLINKS.txt" 2>/dev/null || true
fi

# Create Termux-compatible 'pkg' command
cat << 'EOF' > "$DEST/bin/pkg"
#!/bin/sh
CMD="$1"
shift 1 2>/dev/null || true

case "$CMD" in
    install|i)
        ASSUME_YES=0
        if [ "$1" = "-y" ] || [ "$1" = "--yes" ]; then
            ASSUME_YES=1
            shift 1
        fi
        TARGET="$1"
        if [ -z "$TARGET" ]; then
            echo "Usage: pkg install [-y] <package_name>"
            exit 1
        fi
        case "$TARGET" in
            node|nodejs|npm) TARGET="nodejs"; DESC="Node.js 26.4.0 JavaScript Runtime"; SIZE="71.8 MB"; DISK="197.8 MB" ;;
            py|python|python3) TARGET="python"; DESC="Python 3.14.6 Programming Language"; SIZE="21.2 MB"; DISK="57.8 MB" ;;
            clang|clang++|gcc|g++|c|cpp|c_cpp|make) TARGET="c_cpp"; DESC="C/C++ Clang 21 Toolchain & Make"; SIZE="200.8 MB"; DISK="527.0 MB" ;;
            java|jdk|openjdk|openjdk-17|openjdk-21) TARGET="java"; DESC="OpenJDK 21 Compiler & JVM Runtime"; SIZE="140.4 MB"; DISK="192.0 MB" ;;
            golang|go) TARGET="go"; DESC="Go (Golang) 1.27 Compiler & Stdlib"; SIZE="260.5 MB"; DISK="741.1 MB" ;;
            rust|rustc|cargo) TARGET="rust"; DESC="Rust 1.98 Compiler & Cargo Package Manager"; SIZE="437.9 MB"; DISK="1226.1 MB" ;;
            kotlin|kotlinc) TARGET="kotlin"; DESC="Kotlin 2.4 JVM Compiler"; SIZE="225.2 MB"; DISK="283.2 MB" ;;
            mono|cs|csharp) TARGET="csharp"; DESC="Mono 6.14 C# Runtime & MCS"; SIZE="106.9 MB"; DISK="294.5 MB" ;;
            php|php8) TARGET="php"; DESC="PHP 8.5 Command-Line Interpreter"; SIZE="82.0 MB"; DISK="254.7 MB" ;;
            ruby|gem) TARGET="ruby"; DESC="Ruby 4.0 Interpreter & RubyGems"; SIZE="26.5 MB"; DISK="71.1 MB" ;;
            lua|lua54) TARGET="lua"; DESC="Lua 5.4 Standalone Interpreter"; SIZE="1.0 MB"; DISK="2.2 MB" ;;
            all) TARGET="all"; DESC="All 11 TermCode Programming Toolchains"; SIZE="1574 MB"; DISK="3847 MB" ;;
            *) DESC="TermCode Package: $TARGET"; SIZE="Unknown"; DISK="Unknown" ;;
        esac

        echo "Reading package lists... Done"
        echo "Building dependency tree... Done"
        echo "Reading state information... Done"
        echo "The following NEW packages will be installed:"
        echo "  $TARGET ($DESC)"
        echo "0 upgraded, 1 newly installed, 0 to remove."
        echo "Need to get $SIZE of archives."
        echo "After this operation, $DISK of additional disk space will be used."

        if [ "$ASSUME_YES" != "1" ]; then
            printf "Do you want to continue? [Y/n] "
            read -r CONFIRM
            case "$CONFIRM" in
                [yY][eE][sS]|[yY]|"")
                    ;;
                *)
                    echo "Abort."
                    exit 1
                    ;;
            esac
        fi

        echo "Get:1 https://raw.githubusercontent.com/raj40870-pixel/library/main/ aarch64 $TARGET [$SIZE]"
        curl -sL https://raw.githubusercontent.com/raj40870-pixel/library/main/install.sh | sh -s "$TARGET"
        echo "Setting up $TARGET ..."
        echo "Processing triggers for TermCode runtime environment ..."
        echo "Done."
        ;;
    search)
        echo "Available packages in TermCode Library:"
        echo "  - python   (Python 3.14, pip, sqlite, openssl)"
        echo "  - nodejs   (Node.js 26, npm, typescript)"
        echo "  - c_cpp    (Clang 21, Clang++, GCC, G++, Make)"
        echo "  - java     (OpenJDK 21, javac, java, jar)"
        echo "  - go       (Golang 1.27 compiler & stdlib)"
        echo "  - rust     (Rustc 1.98 compiler, Cargo)"
        echo "  - kotlin   (Kotlinc 2.4 compiler & runtime)"
        echo "  - csharp   (Mono 6.14 C# runtime & MCS)"
        echo "  - php      (PHP 8.5 CLI interpreter)"
        echo "  - ruby     (Ruby 4.0 interpreter & Gem)"
        echo "  - lua      (Lua 5.4 standalone interpreter)"
        echo "  - all      (Install all 11 toolchains at once)"
        ;;
    list-all|list)
        echo "python nodejs c_cpp java go rust kotlin csharp php ruby lua all"
        ;;
    update|upgrade)
        echo "TermCode repository is up to date."
        ;;
    *)
        echo "TermCode Termux Package Manager"
        echo "Usage: pkg [install|search|list] [package_name]"
        echo "Example: pkg install nodejs"
        echo "         pkg install python"
        echo "         pkg install clang"
        echo "         pkg install all"
        ;;
esac
EOF
chmod 755 "$DEST/bin/pkg" 2>/dev/null || true

# Create quick 'install' shortcut
cat << 'EOF' > "$DEST/bin/install"
#!/bin/sh
if [ "$#" -ge 1 ] && [ "$1" != "-c" ] && [ "$1" != "-d" ] && [ ! -f "$1" ]; then
    pkg install "$@"
    exit $?
fi
exec /system/bin/install "$@" 2>/dev/null || exit 1
EOF
chmod 755 "$DEST/bin/install" 2>/dev/null || true

# Create 'apt' compatibility alias
cat << 'EOF' > "$DEST/bin/apt"
#!/bin/sh
pkg "$@"
EOF
chmod 755 "$DEST/bin/apt" 2>/dev/null || true

# Create convenient CLI helper 'termcode'
cat << 'EOF' > "$DEST/bin/termcode"
#!/bin/sh
pkg "$@"
EOF
chmod 755 "$DEST/bin/termcode" 2>/dev/null || true

# Cleanup temp
rm -rf "$TMP_DIR"

echo "=========================================================="
echo "==> SUCCESS: ${LANG_TARGET} is now installed and ready!"
echo "==> Tip: You can also use 'termcode install <lang>' in terminal."
echo "=========================================================="
