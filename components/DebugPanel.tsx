import React, { useState, useEffect } from 'react';

const DebugPanel: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

    useEffect(() => {
        addLog('Debug Panel Mounted');
        checkConnection();
    }, []);

    const getAuthHeaders = (): Record<string, string> => {
        // The secure proxy (Nginx/Vite) handles the Authorization header automatically.
        return {
            'Content-Type': 'application/json'
        };
    };

    const checkConnection = async () => {
        addLog('--- Checking Environment Variables ---');
        addLog(`WP_URL: ${import.meta.env.VITE_WORDPRESS_URL || '❌ MISSING (Using Fallback)'}`);
        addLog(`WC_KEY: ${import.meta.env.VITE_WC_CONSUMER_KEY ? `${import.meta.env.VITE_WC_CONSUMER_KEY.substring(0, 10)}...` : '❌ MISSING'}`);
        addLog(`RPAY_KEY: ${import.meta.env.VITE_RAZORPAY_KEY_ID ? `${import.meta.env.VITE_RAZORPAY_KEY_ID.substring(0, 10)}...` : '❌ MISSING'}`);

        addLog('--- Checking Product Fetch (GET) ---');
        try {
            const res = await fetch('/wp-json/wc/v3/products', {
                headers: getAuthHeaders()
            });
            addLog(`Fetch Status: ${res.status} ${res.statusText}`);

            if (res.ok) {
                const data = await res.json();
                addLog(`Success! Received ${data.length} items`);
                if (data.length > 0) {
                    addLog(`First item: ${JSON.stringify(data[0].name)}`);
                }
            } else {
                const text = await res.text();
                addLog(`Error Body: ${text.substring(0, 150)}...`);
            }
        } catch (e: any) {
            addLog(`Fetch Exception: ${e.message}`);
        }
    };

    const testOrder = async () => {
        addLog('--- Testing Order Creation (POST) ---');
        try {
            const dummyOrder = {
                payment_method: 'cod',
                payment_method_title: 'Debug Test',
                billing: { first_name: 'Debug', last_name: 'Tester', email: 'debug@example.com', phone: '9999999999' },
                line_items: []
            };

            const res = await fetch('/wp-json/wc/v3/orders', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(dummyOrder)
            });

            const text = await res.text();
            addLog(`Status: ${res.status}`);
            addLog(`Response: ${text.substring(0, 150)}...`);

        } catch (e: any) {
            addLog(`Order Test Failed: ${e.message}`);
        }
    };

    return (
        <div className="p-10 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Connection Debugger</h1>
            <div className="flex gap-4 mb-4">
                <button onClick={checkConnection} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Retry Product Fetch (GET)
                </button>
                <button onClick={testOrder} className="bg-purple-600 text-white px-4 py-2 rounded">
                    Test Order (POST)
                </button>
            </div>
            <div className="bg-black text-green-400 font-mono p-4 rounded h-96 overflow-auto">
                {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                ))}
            </div>
        </div>
    );
};

export default DebugPanel;
