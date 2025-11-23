#!/usr/bin/env node
/**
 * @fileoverview Intentionally Vulnerable CLI Application
 * @description Contains different types of vulnerabilities for SAST testing
 * @author Security Testing Team
 * @created 2025-01-21
 * 
 * WARNING: This code contains intentional security vulnerabilities.
 * DO NOT use in production!
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const yaml = require('yaml');
const jwt = require('jsonwebtoken');

// ============================================================================
// VULNERABILITY 1: Code Injection via eval (CWE-95) - CRITICAL
// ============================================================================

function executeUserScript(script) {
  // VULNERABLE: eval with user input
  try {
    return eval(script);
  } catch (error) {
    console.error('Execution error:', error.message);
    return null;
  }
}

// Code injection via Function constructor
function createDynamicFunction(code) {
  // VULNERABLE: Function constructor
  return new Function('data', code);
}

// ============================================================================
// VULNERABILITY 2: Command Injection (CWE-78) - CRITICAL
// ============================================================================

function runCommand(command) {
  // VULNERABLE: exec with user input
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log(stdout);
  });
}

function processFile(filename) {
  // VULNERABLE: Command injection via spawn
  const process = spawn('cat', [filename]);
  process.stdout.on('data', (data) => {
    console.log(data.toString());
  });
}

// ============================================================================
// VULNERABILITY 3: Path Traversal (CWE-22) - HIGH
// ============================================================================

function readConfigFile(filepath) {
  // VULNERABLE: No path validation
  const fullPath = path.join(__dirname, 'config', filepath);
  return fs.readFileSync(fullPath, 'utf8');
}

function writeUserData(userId, data) {
  // VULNERABLE: User-controlled filename
  const filename = `user_${userId}.json`;
  fs.writeFileSync(path.join(__dirname, 'data', filename), JSON.stringify(data));
}

function deleteFile(filename) {
  // VULNERABLE: Direct file deletion
  fs.unlinkSync(path.join(__dirname, 'uploads', filename));
}

// ============================================================================
// VULNERABILITY 4: Insecure Deserialization (CWE-502) - CRITICAL
// ============================================================================

function loadYamlConfig(yamlString) {
  // VULNERABLE: yaml.load() can execute arbitrary code
  return yaml.load(yamlString);
}

function parseUserData(jsonString) {
  // VULNERABLE: JSON.parse with prototype pollution risk
  return JSON.parse(jsonString);
}

// ============================================================================
// VULNERABILITY 5: Hardcoded Secrets (CWE-798) - CRITICAL
// ============================================================================

// JWT secret from environment
const JWT_SECRET = 'your-secret-key' ;

// Encryption key from environment
const ENCRYPTION_KEY = 'your-encryption-key' ;

// GitHub token from environment
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Slack webhook from environment
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL ;

// ============================================================================
// VULNERABILITY 6: Weak JWT (CWE-287) - CRITICAL
// ============================================================================

function createToken(payload) {
  // VULNERABLE: Hardcoded secret
  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
}

function verifyTokenWeak(token) {
  // VULNERABLE: Algorithm none
  return jwt.verify(token, null, { algorithms: ['none'] });
}

function createAdminToken() {
  // VULNERABLE: Weak secret, admin privilege
  return jwt.sign({ role: 'admin', username: 'admin' }, 'weak-secret');
}

// ============================================================================
// VULNERABILITY 7: XSS in React-like patterns (CWE-79) - HIGH
// ============================================================================

function renderUserContent(content) {
  // VULNERABLE: dangerouslySetInnerHTML pattern
  return {
    __html: content  // Direct HTML injection
  };
}

function createHTMLPage(userInput) {
  // VULNERABLE: Template literal in HTML
  return `
    <html>
      <head><title>User Page</title></head>
      <body>
        <div>${userInput}</div>
        <script>
          document.write('${userInput}');
        </script>
      </body>
    </html>
  `;
}

// ============================================================================
// VULNERABILITY 8: SSRF (CWE-918) - HIGH
// ============================================================================

const https = require('https');
const http = require('http');

function fetchURL(url) {
  // VULNERABLE: No URL validation
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// ============================================================================
// VULNERABILITY 9: Weak Crypto (CWE-327) - HIGH
// ============================================================================

const crypto = require('crypto');

function hashPassword(password) {
  // VULNERABLE: SHA-1 is weak
  return crypto.createHash('sha1').update(password).digest('hex');
}

function encryptData(data) {
  // VULNERABLE: DES is weak
  const cipher = crypto.createCipher('des', ENCRYPTION_KEY);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// ============================================================================
// VULNERABILITY 10: Insecure Random (CWE-330) - MEDIUM
// ============================================================================

function generateSessionId() {
  // VULNERABLE: Math.random() is predictable
  return Math.random().toString(36).substring(2, 15);
}

function generateAPIKey() {
  // VULNERABLE: Weak random generation
  return 'api_' + Math.random().toString(36).substring(2, 15);
}

// ============================================================================
// CLI Interface
// ============================================================================

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'execute':
    const script = args[1];
    executeUserScript(script);
    break;
    
  case 'run':
    const cmd = args.slice(1).join(' ');
    runCommand(cmd);
    break;
    
  case 'read':
    const file = args[1];
    console.log(readConfigFile(file));
    break;
    
  case 'yaml':
    const yamlContent = fs.readFileSync(args[1], 'utf8');
    const config = loadYamlConfig(yamlContent);
    console.log(JSON.stringify(config, null, 2));
    break;
    
  case 'token':
    const payload = JSON.parse(args[1]);
    console.log(createToken(payload));
    break;
    
  case 'fetch':
    fetchURL(args[1]).then(data => console.log(data));
    break;
    
  default:
    console.log('Usage: node cli.js <command> [args...]');
    console.log('Commands: execute, run, read, yaml, token, fetch');
}

