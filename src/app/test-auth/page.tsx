'use client';

import { useState, useEffect } from 'react';

export default function TestAuthPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testLocalStorage = () => {
    addLog('Testing localStorage...');
    
    // Test writing
    try {
      const testData = { id: 'test-id', name: 'Test User', email: 'test@example.com' };
      localStorage.setItem('test-user', JSON.stringify(testData));
      addLog('✅ Successfully wrote to localStorage');
    } catch (error) {
      addLog('❌ Failed to write to localStorage: ' + error);
    }

    // Test reading
    try {
      const stored = localStorage.getItem('test-user');
      if (stored) {
        const parsed = JSON.parse(stored);
        addLog('✅ Successfully read from localStorage: ' + JSON.stringify(parsed));
      } else {
        addLog('❌ No data found in localStorage');
      }
    } catch (error) {
      addLog('❌ Failed to read from localStorage: ' + error);
    }

    // Check current auth data
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    addLog('Current token: ' + (token ? 'exists' : 'missing'));
    addLog('Current user: ' + (user ? 'exists' : 'missing'));
    if (user) {
      addLog('User data: ' + user);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('test-user');
    addLog('🧹 Cleared localStorage');
  };

  const simulateLogin = () => {
    addLog('Simulating login...');
    const mockData = {
      token: 'mock-token-' + Date.now(),
      user: {
        id: 'mock-user-' + Date.now(),
        name: 'Mock User',
        email: 'mock@example.com',
        role: 'user'
      }
    };

    try {
      localStorage.setItem('token', mockData.token);
      localStorage.setItem('user', JSON.stringify(mockData.user));
      addLog('✅ Simulated login successful');
    } catch (error) {
      addLog('❌ Simulated login failed: ' + error);
    }
  };

  useEffect(() => {
    addLog('Page loaded, checking localStorage...');
    testLocalStorage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            <button 
              onClick={testLocalStorage}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test LocalStorage
            </button>
            <button 
              onClick={simulateLogin}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-4"
            >
              Simulate Login
            </button>
            <button 
              onClick={clearLocalStorage}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-4"
            >
              Clear LocalStorage
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Console Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-400">No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6">
          <a href="/profile" className="text-blue-600 hover:text-blue-700 underline">
            Go to Profile Page
          </a>
          {' | '}
          <a href="/login" className="text-blue-600 hover:text-blue-700 underline">
            Go to Login Page
          </a>
          {' | '}
          <a href="/signup" className="text-blue-600 hover:text-blue-700 underline">
            Go to Signup Page
          </a>
        </div>
      </div>
    </div>
  );
}
