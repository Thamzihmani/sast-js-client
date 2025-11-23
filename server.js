/**
 * @fileoverview Vulnerable Express Server for React App
 * @description Server-side vulnerabilities for SAST testing
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Hardcoded secrets
const SECRET_KEY = 'hardcoded-secret-12345';
const ADMIN_TOKEN = 'admin-secret-token-xyz';

// ============================================================================
// VULNERABILITY: Path Traversal in File Serving
// ============================================================================

app.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  // VULNERABLE: No path validation
  const filePath = path.join(__dirname, 'files', filename);
  const content = fs.readFileSync(filePath, 'utf8');
  res.send(content);
});

// ============================================================================
// VULNERABILITY: XSS in API Response
// ============================================================================

app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  // VULNERABLE: User input in JSON response (reflected XSS)
  res.json({
    id: userId,
    name: req.query.name || 'User',
    message: `Welcome ${req.query.name || 'User'}`
  });
});

// ============================================================================
// VULNERABILITY: Weak JWT
// ============================================================================

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // VULNERABLE: Hardcoded secret
  const token = jwt.sign({ username }, SECRET_KEY);
  res.json({ token });
});

app.get('/api/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  // VULNERABLE: Algorithm none
  const decoded = jwt.verify(token, null, { algorithms: ['none'] });
  res.json({ user: decoded });
});

// ============================================================================
// VULNERABILITY: Command Injection
// ============================================================================

const { exec } = require('child_process');

app.post('/api/build', (req, res) => {
  const project = req.body.project;
  // VULNERABLE: Command injection
  exec(`npm run build --project=${project}`, (error, stdout) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ output: stdout });
  });
});

// ============================================================================
// VULNERABILITY: Insecure Deserialization
// ============================================================================

app.post('/api/config', (req, res) => {
  const config = req.body.config;
  // VULNERABLE: eval-like deserialization
  const parsed = eval(`(${config})`);
  res.json({ config: parsed });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Vulnerable server running on http://localhost:${PORT}`);
});

