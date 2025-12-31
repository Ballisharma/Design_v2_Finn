
import React, { useState, useEffect } from 'react';
import { getMergedProducts, syncProducts } from '../services/syncManager';

const DebugPanel: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

    useEffect(() => {
        addLog('Debug Panel Mounted');
        checkConnection();
    }, []);

    const checkConnection = async () => {
        addLog('--- Checking Configuration ---');
        addLog(`VITE_WORDPRESS_URL: ${import.meta.env.VITE_WORDPRESS_URL ? '✅ Present' : '❌ Missing'}`);
        addLog(`VITE_WC_CONSUMER_KEY: ${import.meta.env.VITE_WC_CONSUMER_KEY ? '✅ Present' : '⚠️ Missing (checking fallback)'}`);
        addLog(`VITE_CONSUMER_KEY: ${import.meta.env.VITE_CONSUMER_KEY ? '✅ Present' : '⚠️ Missing'}`);

        // Check if at least one key is present
        const hasKey = import.meta.env.VITE_WC_CONSUMER_KEY || import.meta.env.VITE_CONSUMER_KEY;
        const hasSecret = import.meta.env.VITE_WC_CONSUMER_SECRET || import.meta.env.VITE_CONSUMER_SECRET;

        addLog(`Effective Key Status: ${hasKey ? '✅ OK' : '❌ No Key Found'}`);
        addLog(`Effective Secret Status: ${hasSecret ? '✅ OK' : '❌ No Secret Found'}`);

        addLog('--- Starting Fetch Request ---');
        try {
            // Direct fetch to test proxy
            const res = await fetch('/wp-json/wc/v3/products');
            addLog(`Fetch Status: ${res.status} ${res.statusText}`);

            if (res.ok) {
                const data = await res.json();
                addLog(`Success! Received ${data.length} items`);
                if (data.length > 0) {
                    addLog(`First item: ${JSON.stringify(data[0].name)}`);
                }
            } else {
                const text = await res.text();
                addLog(`Error Body: ${text.substring(0, 100)}...`);
            }
        } catch (e: any) {
            addLog(`Fetch Exception: ${e.message}`);
        }
    };

    return (
        <div className="p-10 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Connection Debugger</h1>
            <button onClick={checkConnection} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                Retry Connection
            </button>
            <div className="bg-black text-green-400 font-mono p-4 rounded h-96 overflow-auto">
                {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                ))}
            </div>
        </div>
    );
};

export default DebugPanel;
