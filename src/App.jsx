/**
 * @fileoverview Vulnerable React Application
 * @description Frontend vulnerabilities for SAST testing
 */

import React, { useState } from 'react';
import axios from 'axios';

// API key from environment
// Note: In production, use environment variables with your build tool's prefix
// (e.g., REACT_APP_ for Create React App, VITE_ for Vite)
const API_KEY = process.env.REACT_APP_STRIPE_API_KEY ;

function App() {
  const [userInput, setUserInput] = useState('');
  const [htmlContent, setHtmlContent] = useState('');

  // ============================================================================
  // VULNERABILITY: XSS via dangerouslySetInnerHTML
  // ============================================================================
  
  const handleRender = () => {
    // VULNERABLE: Direct HTML injection
    setHtmlContent(userInput);
  };

  // ============================================================================
  // VULNERABILITY: XSS via eval
  // ============================================================================
  
  const handleEval = () => {
    // VULNERABLE: eval with user input
    try {
      eval(userInput);
    } catch (error) {
      console.error('Eval error:', error);
    }
  };

  // ============================================================================
  // VULNERABILITY: SSRF via unvalidated fetch
  // ============================================================================
  
  const handleFetch = async () => {
    const url = userInput;
    // VULNERABLE: No URL validation
    try {
      const response = await axios.get(url);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  // ============================================================================
  // VULNERABILITY: Hardcoded secrets in frontend
  // ============================================================================
  
  const makeAPICall = async () => {
    // VULNERABLE: API key in frontend code
    const response = await axios.get('https://api.example.com/data', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    return response.data;
  };

  // ============================================================================
  // VULNERABILITY: XSS via document.write
  // ============================================================================
  
  const renderUserContent = () => {
    // VULNERABLE: document.write pattern
    if (typeof document !== 'undefined') {
      document.write(`<div>${userInput}</div>`);
    }
  };

  return (
    <div className="App">
      <h1>Vulnerable React App</h1>
      
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter user input"
      />
      
      <div>
        <button onClick={handleRender}>Render HTML</button>
        <button onClick={handleEval}>Execute Code</button>
        <button onClick={handleFetch}>Fetch URL</button>
        <button onClick={renderUserContent}>Write to Document</button>
      </div>

      {/* VULNERABLE: dangerouslySetInnerHTML */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      
      {/* VULNERABLE: Direct interpolation */}
      <div>{userInput}</div>
    </div>
  );
}

export default App;

