# TermCode Runtime Distribution Server - REST API Specification

This document details the REST API specifications for the TermCode Runtime Distribution Server, which delivers versioned, architecture-aware toolchains to the TermCode Android IDE.

---

## Base URLs

- **Localhost Development:** `http://localhost:3000`
- **TermCode Cloud Server:** `https://library.termcode.dev` (or user's deployment URL)

---

## 1. System Discovery & Info

### `GET /`
Returns discovery metadata, available endpoints, and supported runtimes.

**Response `200 OK`**:
```json
{
  "name": "TermCode Runtime Distribution Server",
  "version": "1.0.0",
  "description": "Official runtime distribution & package manifest server for TermCode Android IDE",
  "architecture": "aarch64",
  "minAndroidApi": 24,
  "status": "online",
  "uptimeSeconds": 1420,
  "endpoints": {
    "health": "/health",
    "runtimes": "/api/runtimes",
    "runtimeDetail": "/api/runtime/:language?arch=aarch64",
    "downloads": "/downloads/:arch/:package",
    "checksums": "/checksums/:arch.sha256",
    "installScript": "/install.sh"
  },
  "supportedLanguages": [
    "c", "cpp", "java", "python", "nodejs", "typescript",
    "go", "rust", "kotlin", "csharp", "php", "ruby", "lua", "web"
  ],
  "totalRuntimes": 14
}
```

---

## 2. Health & Telemetry

### `GET /health`
Returns process uptime, Node version, memory usage, and operational status.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "uptime": 1420,
  "timestamp": "2026-09-29T16:00:00.000Z",
  "nodeVersion": "v20.18.0",
  "platform": "linux",
  "arch": "x64",
  "memory": {
    "rssMB": "32.14",
    "heapTotalMB": "15.22",
    "heapUsedMB": "10.45"
  }
}
```

---

## 3. Runtimes Catalog

### `GET /api/runtimes`
Returns a catalog of all supported language targets with version and size summaries.

**Response `200 OK`**:
```json
{
  "schemaVersion": "1.0.0",
  "server": "TermCode Runtime Distribution Server",
  "arch": "aarch64",
  "minAndroidApi": 24,
  "totalTargets": 14,
  "runtimes": {
    "python": {
      "target": "python",
      "displayName": "Python 3 (CPython 3.14)",
      "version": "3.14.6-1",
      "category": "interpreted",
      "sizeMB": "57.79",
      "executable": "bin/python3",
      "manifestUrl": "/api/runtime/python?arch=aarch64"
    }
  }
}
```

---

## 4. Single Runtime Manifest

### `GET /api/runtime/:language?arch=aarch64`

Returns detailed compilation, execution, environment, and package information for the requested language.

**Parameters**:
- `:language` (path, required) - e.g. `python`, `c`, `cpp`, `java`, `nodejs`, `rust`, etc.
- `arch` (query, optional, default: `aarch64`) - Architecture.

**Response `200 OK`**:
```json
{
  "target": "python",
  "displayName": "Python 3 (CPython 3.14)",
  "runtimeFolder": "python",
  "version": "3.14.6-1",
  "arch": "aarch64",
  "category": "interpreted",
  "minAndroidApi": 24,
  "fileCount": 1413,
  "extractedSizeBytes": 60592812,
  "extractedSizeMB": "57.79",
  "symlinksCount": 94,
  "primaryExecutable": "bin/python3",
  "testCommand": "python3 --version",
  "compileCommand": null,
  "runCommand": "python3 -u \"$FILE\"",
  "environment": {
    "PATH": "/data/data/com.termux/files/usr/bin:$PATH",
    "LD_LIBRARY_PATH": "/data/data/com.termux/files/usr/lib",
    "HOME": "/data/data/com.termux/files/home",
    "TMPDIR": "/data/data/com.termux/files/usr/tmp"
  },
  "dependencies": [
    "libandroid-support", "libbz2", "libexpat", "libffi",
    "liblzma", "libsqlite", "ncurses", "openssl", "readline", "zlib"
  ],
  "downloadUrl": "/downloads/aarch64/python-3.14.6-1-aarch64.tar.gz",
  "gitInstallCommand": "curl -sL https://raw.githubusercontent.com/raj40870-pixel/library/main/install.sh | sh -s python",
  "description": "CPython 3.14 interpreter with full standard library, SSL, SQLite3, and package manager support.",
  "status": "stable",
  "verified": true
}
```

---

## 5. Direct Package Download

### `GET /downloads/:arch/:package`

Streams the `.tar.gz` package archive for direct local extraction in the Android app.

**Headers**:
- `Accept-Ranges: bytes`
- `Content-Disposition: attachment; filename="..."`
- `Content-Type: application/gzip`

Supports HTTP Range requests (`Range: bytes=0-1048576`) for resumable downloads.

---

## 6. Checksums Verification

### `GET /checksums/:arch.sha256`
Returns the raw SHA-256 manifest file for package verification.

---

## 7. Universal Installation Script

### `GET /install.sh`
Returns the raw POSIX shell script used for 1-line installation in terminal:
```bash
curl -sL http://localhost:3000/install.sh | sh -s <language>
```
