// src/components/Wallet.jsx
import React, { useState } from "react";
import { useWalletConn } from "../hooks/useWalletConnect";
import { useBalance } from "../hooks/useAccountBalance";

const Wallet = () => {
  const [inputAddress, setInputAddress] = useState(""); 
  const [balanceForInput, setBalanceForInput] = useState(null); 

  const { account, chainId, isConnected, errorMessage, getAccount, disconnectAccount } = useWalletConn();
  const { balance: connectedAccountBalance, fetchBalance } = useBalance(window.ethereum, account, chainId);

  const handleGetBalanceForInput = async () => {
    if (inputAddress) {
      const provider = window.ethereum;
      try {
        const balanceHex = await provider.request({
          method: "eth_getBalance",
          params: [inputAddress, "latest"],
        });
        const balanceInEther = Number(balanceHex) / 1e18; 
        setBalanceForInput(balanceInEther);
      } catch (error) {
        console.error("Error fetching balance for input address:", error);
        setBalanceForInput(null);
      }
    } else {
      console.error("No address entered.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Ethereum Wallet
        </h1>

        <div className="mb-6">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Ethereum address"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />
          <button
            onClick={handleGetBalanceForInput}
            className="mt-3 w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-300 ease-in-out"
          >
            Get Balance for Address
          </button>

          <h3 className="mt-4 text-gray-700 text-lg text-center font-medium">
            Balance for {inputAddress ? inputAddress : "address"}:{" "}
            <span className="font-bold text-indigo-600">
              {balanceForInput !== null ? `${balanceForInput} ETH` : "Enter a valid address"}
            </span>
          </h3>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
          {!isConnected ? (
            <button
              onClick={getAccount}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 ease-in-out"
            >
              Enable Ethereum
            </button>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800 text-center">
                Connected Account:
              </h2>
              <p className="text-gray-600 text-center mb-3">{account || errorMessage}</p>
              {chainId && (
                <p className="text-gray-600 text-center">
                  <span className="font-semibold">Connected to Chain ID:</span> {chainId}
                </p>
              )}
              <button
                onClick={disconnectAccount}
                className="mt-4 w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 ease-in-out"
              >
                Disconnect
              </button>

              <h3 className="mt-4 text-lg font-semibold text-gray-800 text-center">
                Balance for Connected Account:{" "}
                <span className="font-bold text-indigo-600">
                  {connectedAccountBalance !== null
                    ? `${connectedAccountBalance} ETH`
                    : "Fetching balance..."}
                </span>
              </h3>
            </>
          )}
          {errorMessage && <p className="mt-2 text-red-500 text-center">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
