import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import {
    syncProducts,
    forceFullSync,
    getSyncStatus,
    type SyncResult
} from '../services/syncManager';
import { RefreshCw, Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const WordPressSyncPanel: React.FC = () => {
    const { dataSource, setDataSource, products, isLoading } = useProducts();
    const [syncStatus, setSyncStatus] = useState<any>(null);
    const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    // Load sync status on mount
    useEffect(() => {
        const status = getSyncStatus();
        setSyncStatus(status);
    }, []);

    const handleManualSync = async (direction: 'wordpress-to-local' | 'local-to-wordpress' | 'bidirectional') => {
        setIsSyncing(true);
        try {
            const result = await syncProducts(direction);
            setLastSyncResult(result);

            // Update sync status
            const status = getSyncStatus();
            setSyncStatus(status);

            // Show notification
            if (result.success) {
                alert(`✅ Sync completed! ${result.synced} products synced.`);
            } else {
                alert(`⚠️ Sync completed with errors. ${result.synced} synced, ${result.failed} failed.`);
            }
        } catch (error) {
            alert(`❌ Sync failed: ${error}`);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleForceSync = async () => {
        setIsSyncing(true);
        try {
            const result = await forceFullSync();
            setLastSyncResult(result);
            alert(`✅ Force sync completed! ${result.synced} products synced.`);
        } catch (error) {
            alert(`❌ Force sync failed: ${error}`);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <div className="mb-8">
                <h2 className="text-3xl font-heading font-bold text-funky-dark mb-2">
                    WordPress Sync Control Panel
                </h2>
                <p className="text-gray-600">
                    Manage bi-directional synchronization between React and WordPress/WooCommerce
                </p>
            </div>

            {/* Data Source Toggle */}
            <div className="mb-8 p-6 bg-gradient-to-r from-funky-blue/10 to-funky-purple/10 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Database size={24} />
                    Data Source
                </h3>
                <div className="flex gap-4">
                    <button
                        onClick={() => setDataSource('local')}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${dataSource === 'local'
                                ? 'bg-funky-dark text-white'
                                : 'bg-white text-funky-dark border-2 border-gray-300 hover:border-funky-dark'
                            }`}
                    >
                        Local Products
                    </button>
                    <button
                        onClick={() => setDataSource('wordpress')}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${dataSource === 'wordpress'
                                ? 'bg-funky-blue text-white'
                                : 'bg-white text-funky-dark border-2 border-gray-300 hover:border-funky-blue'
                            }`}
                    >
                        WordPress Products
                    </button>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                    Current source: <strong className="text-funky-dark">{dataSource === 'local' ? 'Local Data' : 'WordPress/WooCommerce'}</strong>
                </p>
            </div>

            {/* Sync Status */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Sync Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Sync Status</p>
                        <p className="text-2xl font-bold flex items-center gap-2">
                            {syncStatus?.synced ? (
                                <>
                                    <CheckCircle className="text-green-500" size={24} />
                                    <span className="text-green-500">Synced</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="text-red-500" size={24} />
                                    <span className="text-red-500">Not Synced</span>
                                </>
                            )}
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Products Count</p>
                        <p className="text-2xl font-bold text-funky-dark">
                            {products.length}
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Last Sync</p>
                        <p className="text-sm font-bold text-funky-dark">
                            {syncStatus?.lastSync
                                ? new Date(syncStatus.lastSync).toLocaleString()
                                : 'Never'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Sync Actions */}
            <div className="mb-8 p-6 bg-white border-2 border-gray-200 rounded-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <RefreshCw size={24} />
                    Sync Actions
                </h3>

                <div className="space-y-4">
                    {/* Pull from WordPress */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                            <h4 className="font-bold text-funky-dark">Pull from WordPress</h4>
                            <p className="text-sm text-gray-600">Fetch latest products from WooCommerce</p>
                        </div>
                        <button
                            onClick={() => handleManualSync('wordpress-to-local')}
                            disabled={isSyncing || isLoading}
                            className="px-6 py-2 bg-funky-blue text-white rounded-lg font-bold hover:bg-funky-blue/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSyncing ? 'Syncing...' : 'Pull'}
                            <RefreshCw size={16} />
                        </button>
                    </div>

                    {/* Push to WordPress */}
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                            <h4 className="font-bold text-funky-dark">Push to WordPress</h4>
                            <p className="text-sm text-gray-600">Upload local products to WooCommerce</p>
                        </div>
                        <button
                            onClick={() => handleManualSync('local-to-wordpress')}
                            disabled={isSyncing || isLoading}
                            className="px-6 py-2 bg-funky-green text-white rounded-lg font-bold hover:bg-funky-green/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSyncing ? 'Syncing...' : 'Push'}
                            <RefreshCw size={16} />
                        </button>
                    </div>

                    {/* Bi-directional Sync */}
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div>
                            <h4 className="font-bold text-funky-dark">Bi-directional Sync</h4>
                            <p className="text-sm text-gray-600">Sync both ways (merge local and WordPress)</p>
                        </div>
                        <button
                            onClick={() => handleManualSync('bidirectional')}
                            disabled={isSyncing || isLoading}
                            className="px-6 py-2 bg-funky-purple text-white rounded-lg font-bold hover:bg-funky-purple/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSyncing ? 'Syncing...' : 'Sync Both'}
                            <RefreshCw size={16} />
                        </button>
                    </div>

                    {/* Force Full Sync */}
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
                        <div>
                            <h4 className="font-bold text-funky-dark flex items-center gap-2">
                                <AlertCircle size={20} className="text-yellow-600" />
                                Force Full Sync
                            </h4>
                            <p className="text-sm text-gray-600">Clear cache and perform complete sync</p>
                        </div>
                        <button
                            onClick={handleForceSync}
                            disabled={isSyncing || isLoading}
                            className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSyncing ? 'Syncing...' : 'Force Sync'}
                            <RefreshCw size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Last Sync Result */}
            {lastSyncResult && (
                <div className={`p-6 rounded-lg ${lastSyncResult.success ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'
                    }`}>
                    <h3 className="text-xl font-bold mb-4">Last Sync Result</h3>
                    <div className="space-y-2">
                        <p className="flex items-center gap-2">
                            {lastSyncResult.success ? (
                                <CheckCircle className="text-green-500" size={20} />
                            ) : (
                                <XCircle className="text-red-500" size={20} />
                            )}
                            <span className="font-bold">
                                Status: {lastSyncResult.success ? 'Success' : 'Failed'}
                            </span>
                        </p>
                        <p><strong>Synced:</strong> {lastSyncResult.synced} products</p>
                        <p><strong>Failed:</strong> {lastSyncResult.failed} products</p>
                        {lastSyncResult.errors.length > 0 && (
                            <div>
                                <p className="font-bold text-red-600">Errors:</p>
                                <ul className="list-disc list-inside text-sm text-red-600">
                                    {lastSyncResult.errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h4 className="font-bold text-funky-dark mb-2 flex items-center gap-2">
                    <AlertCircle size={20} className="text-blue-600" />
                    Important Notes
                </h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Automatic sync runs every 5 minutes when WordPress mode is active</li>
                    <li>Make sure your <code className="bg-gray-200 px-1 rounded">.env</code> file is configured with WordPress credentials</li>
                    <li>Force sync clears all cached data and fetches fresh from WordPress</li>
                    <li>Stock updates happen automatically after purchases when in WordPress mode</li>
                </ul>
            </div>
        </div>
    );
};

export default WordPressSyncPanel;
