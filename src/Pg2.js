import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
    createNetworkConfig,
    SuiClientProvider,
    WalletProvider,
    ConnectButton,
    useConnectWallet,
    useWallets,
    useCurrentAccount,
    useSignAndExecuteTransaction
} from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Transaction } from '@mysten/sui/transactions';

// Configure network settings
const { networkConfig } = createNetworkConfig({
    localnet: { url: getFullnodeUrl('localnet') },
    devnet: { url: getFullnodeUrl('devnet') },
    testnet: { url: getFullnodeUrl('testnet') },
    mainnet: { url: getFullnodeUrl('mainnet') },
});

// Initialize React Query Client
const queryClient = new QueryClient();

function WalletConnector() {
    const wallets = useWallets();
    const { mutate: connect } = useConnectWallet();
    const account = useCurrentAccount();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

    const [amount, setAmount] = useState('');
    const [digest, setDigest] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Define a reasonable gas budget (you can adjust this value as needed)
    const GAS_BUDGET = 1000000000;

    const handleMint = async () => {
        // Validate wallet connection
        if (!account) {
            setError('Please connect your wallet first.');
            return;
        }

        // Validate amount input
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError('Please enter a valid amount to mint.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const tx = new Transaction();

            // Construct the Move call with gas budget
            tx.moveCall({
                target: '0x08a82b6dcca5602da0f8f96cdafaebf1bc77df8d1b633a5444ceef21e0a75894::pepe::mint',
                arguments: [
                    tx.object('0x0e7a47d33567a996bd0ff5db23873a6b5cc3045d09c29416d0c2ff0c6d4672fa'),
                    tx.pure('u64', Number(amount)), // Specify the type and convert amount to number
                    tx.pure('address', account.address) // Specify the type for the address
                ],
                gasBudget: GAS_BUDGET, // Set the gas budget
            });

            // Execute the transaction with the specified gas budget
            signAndExecuteTransaction(
                {
                    transaction: tx,
                    chain: 'sui:devnet',
                },
                {
                    onSuccess: (result) => {
                        console.log('Minting successful:', result);
                        setDigest(result.digest);
                        setLoading(false);
                        setAmount(''); // Reset the amount input
                        setError(null); // Clear any existing errors
                    },
                    onError: (signError) => {
                        console.error('Minting failed:', signError);
                        if (signError.message.includes('User rejected the request')) {
                            setError('Transaction was rejected by the user.');
                        } else if (signError.message.includes('insufficient funds')) {
                            setError('Insufficient funds to cover gas fees.');
                        } else {
                            setError('Minting failed. Please try again.');
                        }
                        setLoading(false);
                    },
                },
            );
        } catch (error) {
            console.error('Error constructing or sending transaction:', error);
            setError('An unexpected error occurred.');
            setLoading(false);
        }
    };

    return (
        <div className="p-5">
            <ConnectButton />

            {account && (
                <div className="mt-4 space-y-4">
                    <div className="flex flex-col space-y-2">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount to mint"
                            className="p-2 border rounded"
                            min="1"
                        />
                        <button
                            onClick={handleMint}
                            className={`bg-green-500 text-white p-3 rounded hover:bg-green-600 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={loading}
                        >
                            {loading ? 'Minting...' : 'Mint PEPE'}
                        </button>
                    </div>

                    {digest && (
                        <div className="mt-2 text-sm break-all">
                            <strong>Transaction Digest:</strong> {digest}
                        </div>
                    )}

                    {error && (
                        <div className="mt-2 text-sm text-red-500">
                            {error}
                        </div>
                    )}
                </div>
            )}

            <ul className="mt-4 space-y-4">
                {wallets.map((wallet) => (
                    <li key={wallet.name}>
                        <button
                            onClick={() => {
                                connect(
                                    { wallet },
                                    {
                                        onSuccess: () => {
                                            console.log('Connected to', wallet.name);
                                            console.log('Current account:', account?.address);
                                        },
                                        onError: (connectError) => {
                                            console.error('Connection failed:', connectError);
                                            setError('Failed to connect wallet. Please try again.');
                                        },
                                    }
                                );
                            }}
                            className="w-full bg-green-500 text-white p-4 rounded text-base hover:bg-green-600"
                        >
                            Connect to {wallet.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Pg2() {
    const navigate = useNavigate();

    return (
        <div className="p-5">
            <button
                onClick={() => navigate(-1)}
                className="w-full mb-5 flex items-center gap-3 bg-green-500 text-white p-3 rounded hover:bg-green-600"
            >
                <FaArrowLeft /> Back
            </button>

            <QueryClientProvider client={queryClient}>
                <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
                    <WalletProvider networks={networkConfig} defaultNetwork="devnet">
                        <WalletConnector />
                    </WalletProvider>
                </SuiClientProvider>
            </QueryClientProvider>
        </div>
    );
}

export default Pg2;
