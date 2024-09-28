import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

export const useWalletConn = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const setup = async () => {
      const provider = await detectEthereumProvider();
      if (provider && provider === window.ethereum) {
        const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
        setChainId(currentChainId);

        window.ethereum.on("chainChanged", handleChainChanged);
        window.ethereum.on("accountsChanged", handleAccountsChanged);
      } else {
        setErrorMessage("MetaMask not installed. Please install it to interact with the dapp.");
      }
    };
    setup();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  const handleChainChanged = (newChainId) => {
    setChainId(newChainId);
    setErrorMessage("Chain has changed. Please refresh the page.");
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
    } else {
      setAccount(null);
      setIsConnected(false);
    }
  };

  const getAccount = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      if (error.code === 4001) {
        setErrorMessage("Please connect to MetaMask.");
      } else {
        setErrorMessage("An error occurred while connecting to MetaMask.");
      }
    }
  };

  const disconnectAccount = () => {
    setAccount(null);
    setIsConnected(false);
    setErrorMessage("");
  };

  return { account, chainId, isConnected, errorMessage, getAccount, disconnectAccount };
};