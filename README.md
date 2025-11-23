# Vulnerable CLI/React App - Test Project 2

## Overview

This is an intentionally vulnerable Node.js CLI application and React frontend designed to test SAST scanners. It contains different types of security vulnerabilities compared to Project 1, focusing on client-side, CLI, and deserialization vulnerabilities.

**⚠️ WARNING: This code contains intentional security vulnerabilities. DO NOT use in production!**

## Vulnerabilities Included

### 1. Code Injection (CWE-95) - CRITICAL
- `eval()` with user input in CLI
- `Function()` constructor injection
- Code execution in React components

**Location**: 
- `cli.js` lines 15-30
- `src/App.jsx` lines 25-35

### 2. Command Injection (CWE-78) - CRITICAL
- `exec()` with user-controlled commands
- `spawn()` with user input
- Command injection in server endpoints

**Location**: 
- `cli.js` lines 35-50
- `server.js` lines 45-55

### 3. Path Traversal (CWE-22) - HIGH
- File read without validation
- File write with user-controlled paths
- File deletion without checks

**Location**: `cli.js` lines 55-75

### 4. Insecure Deserialization (CWE-502) - CRITICAL
- `yaml.load()` (unsafe YAML parsing)
- `JSON.parse()` with prototype pollution risk
- `eval()` for config parsing

**Location**: 
- `cli.js` lines 80-95
- `server.js` lines 60-65

### 5. Hardcoded Secrets (CWE-798) - CRITICAL
- JWT secrets in multiple files
- API keys in frontend code
- Encryption keys hardcoded
- GitHub tokens exposed
- Slack webhooks in code

**Location**: 
- `cli.js` lines 100-115
- `src/App.jsx` line 6
- `utils/crypto.js` lines 5-7, 50-52

### 6. Weak JWT Implementation (CWE-287) - CRITICAL
- Algorithm "none" vulnerability
- Hardcoded secrets
- Weak secrets

**Location**: 
- `cli.js` lines 120-140
- `server.js` lines 20-35

### 7. XSS in React/Frontend (CWE-79) - HIGH
- `dangerouslySetInnerHTML` usage
- `document.write()` patterns
- Direct HTML interpolation

**Location**: 
- `cli.js` lines 145-165
- `src/App.jsx` lines 10-20, 40-50

### 8. Server-Side Request Forgery (SSRF) (CWE-918) - HIGH
- Unvalidated URL fetching
- HTTP/HTTPS requests without validation

**Location**: 
- `cli.js` lines 170-180
- `src/App.jsx` lines 30-40

### 9. Weak Cryptographic Algorithms (CWE-327) - HIGH
- MD5 hashing
- SHA-1 hashing
- DES encryption
- 3DES encryption

**Location**: `utils/crypto.js` lines 10-35

### 10. Insecure Random Number Generation (CWE-330) - MEDIUM
- `Math.random()` for tokens
- Weak password generation

**Location**: 
- `cli.js` lines 185-195
- `utils/crypto.js` lines 40-50

## Setup

```bash
cd test-projects/vulnerable-cli
npm install
```

### Run CLI
```bash
node cli.js execute "console.log('test')"
node cli.js run "ls -la"
node cli.js read "../../etc/passwd"
```

### Run Server
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Testing with SAST Scanner

Run the SAST scanner against this project:

```bash
cd workers
node -e "const { runSastScans } = require('./src/lib/sast'); runSastScans('../test-projects/vulnerable-cli').then(r => console.log(JSON.stringify(r, null, 2)));"
```

## Expected Findings

The SAST scanner should detect:
- ✅ Code injection (eval, Function constructor)
- ✅ Command injection (exec, spawn)
- ✅ Path traversal vulnerabilities
- ✅ Insecure deserialization (yaml.load, eval)
- ✅ All hardcoded secrets (JWT, API keys, tokens)
- ✅ Weak JWT implementations
- ✅ XSS in React/frontend code
- ✅ SSRF vulnerabilities
- ✅ Weak cryptographic algorithms
- ✅ Insecure random number generation

## Differences from Project 1

This project focuses on:
- **Client-side vulnerabilities** (React/XSS)
- **CLI-specific vulnerabilities** (command injection, path traversal)
- **Deserialization vulnerabilities** (YAML, JSON)
- **Frontend secret exposure** (API keys in client code)

## Notes

- Contains both server-side and client-side vulnerabilities
- Includes React-specific XSS patterns
- Tests deserialization vulnerabilities not present in Project 1
- CLI-specific attack vectors

