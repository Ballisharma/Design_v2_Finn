import React, { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext';

const DiagnosticPanel: React.FC = () => {
    const { dataSource, products } = useProducts();
    const [apiTest, setApiTest] = useState<string>('Testing...');

    const testAPI = async (k?: string, s?: string) => {
        setApiTest('Testing...');
        try {
            const authKey = k || import.meta.env.VITE_WC_CONSUMER_KEY || import.meta.env.VITE_CONSUMER_KEY;
            const authSecret = s || import.meta.env.VITE_WC_CONSUMER_SECRET || import.meta.env.VITE_CONSUMER_SECRET;

            const response = await fetch('/wp-json/wc/v3/products?per_page=1', {
                headers: {
                    'Authorization': `Basic ${btoa(`${authKey}:${authSecret}`)}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setApiTest(`✅ SUCCESS - Fetched ${data.length} product(s)`);
            } else {
                const text = await response.text();
                setApiTest(`❌ FAILED - Status ${response.status}: ${text.substring(0, 100)}`);
            }
        } catch (error: any) {
            setApiTest(`❌ ERROR - ${error.message}`);
        }
    };

    useEffect(() => {
        testAPI();
    }, []);

    const key = import.meta.env.VITE_WC_CONSUMER_KEY || import.meta.env.VITE_CONSUMER_KEY;

    return (
        <div className="fixed bottom-4 right-4 bg-white border-2 border-red-500 rounded-lg p-6 shadow-2xl max-w-md z-[9999] text-gray-800">
            <h3 className="font-bold text-xl mb-3 text-red-600">🔍 Production Diagnosis</h3>
            <div className="space-y-3 text-xs font-mono bg-gray-50 p-3 rounded border">
                <div><strong>Mode:</strong> {import.meta.env.MODE}</div>
                <div><strong>DataSource:</strong> {dataSource}</div>
                <div><strong>Key Present:</strong> {key ? `YES (${key.substring(0, 8)}...)` : '❌ NO'}</div>
                <div><strong>Secret Present:</strong> {(import.meta.env.VITE_WC_CONSUMER_SECRET || import.meta.env.VITE_CONSUMER_SECRET) ? 'YES' : '❌ NO'}</div>
                <div className="pt-2 border-t border-gray-300">
                    <strong>API Status:</strong>
                    <div className="mt-1 p-2 bg-black text-green-400 rounded text-[10px] break-all">
                        {apiTest}
                    </div>
                </div>
            </div>

            {!key && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-[11px]">
                    <p className="font-bold text-yellow-800">⚠️ VITE KEYS MISSING</p>
                    <p className="text-yellow-700 mt-1">
                        Environment variables are not reaching the production build.
                        Set them in your deployment dashboard (Dockploy).
                    </p>
                </div>
            )}

            <button
                onClick={() => testAPI()}
                className="w-full mt-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-colors"
            >
                RE-TEST CONNECTION
            </button>
        </div>
    );
};

export default DiagnosticPanel;
