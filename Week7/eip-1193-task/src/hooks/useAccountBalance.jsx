// src/hooks/useBalance.js
import { useState, useEffect } from "react";

export const useBalance = (provider, account, chainId) => {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  const fetchBalance = async () => {
    if (provider && account) {
      try {
        console.log(`Fetching balance for account: ${account} on chain: ${chainId}`);
        const balance = await provider.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });
        setBalance(Number(balance) / 1e18);  
        console.log(`Balance fetched: ${balance}`);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError("Failed to fetch balance");
      }
    }
  };

  useEffect(() => {
    if (account && provider) {
      fetchBalance();  
    }
  }, [account, provider, chainId]);

  return { balance, fetchBalance, error };
};