/**
 * @fileoverview Cryptographic utilities with vulnerabilities
 * @description Weak crypto implementations for SAST testing
 */

const crypto = require('crypto');

// Hardcoded encryption key
const ENCRYPTION_KEY = 'my-weak-key-12345';

// ============================================================================
// VULNERABILITY: Weak Hash Algorithms (CWE-327)
// ============================================================================

function hashMD5(data) {
  // VULNERABLE: MD5 is cryptographically broken
  return crypto.createHash('md5').update(data).digest('hex');
}

function hashSHA1(data) {
  // VULNERABLE: SHA-1 is deprecated
  return crypto.createHash('sha1').update(data).digest('hex');
}

// ============================================================================
// VULNERABILITY: Weak Encryption (CWE-327)
// ============================================================================

function encryptDES(data) {
  // VULNERABLE: DES is weak (56-bit key)
  const cipher = crypto.createCipher('des', ENCRYPTION_KEY);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function encrypt3DES(data) {
  // VULNERABLE: 3DES is deprecated
  const cipher = crypto.createCipher('des-ede3', ENCRYPTION_KEY);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// ============================================================================
// VULNERABILITY: Weak Random (CWE-330)
// ============================================================================

function generateToken() {
  // VULNERABLE: Math.random() is predictable
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

function generatePassword() {
  // VULNERABLE: Weak random for passwords
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// ============================================================================
// VULNERABILITY: Hardcoded Secrets (CWE-798)
// ============================================================================

const JWT_SECRET = 'jwt-secret-key-hardcoded-12345';
const API_SECRET = 'api-secret-hardcoded-xyz';
const DB_PASSWORD = 'database-password-123';

module.exports = {
  hashMD5,
  hashSHA1,
  encryptDES,
  encrypt3DES,
  generateToken,
  generatePassword,
  JWT_SECRET,
  API_SECRET,
  DB_PASSWORD
};

