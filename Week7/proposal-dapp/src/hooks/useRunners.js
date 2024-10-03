import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { jsonRpcProvider } from "../constants/provider";

const useRunners = () => {
    const [signer, setSigner] = useState();
    const { walletProvider } = useAppKitProvider("eip155"); // window.ethereum equivalent

    const provider = useMemo(
        () => (walletProvider ? new BrowserProvider(walletProvider) : null),
        [walletProvider]
    ); // read on BrowserProvider
    // wrapper around provider gotten from the wallet

    useEffect(() => {
        if (!provider) return setSigner(null);
        provider.getSigner().then((newSigner) => {
            if(!signer) return setSigner(newSigner);
            if (newSigner.address === signer.address) return;
            setSigner(newSigner);
        });
    }, [provider, signer]);

    return { provider, signer, readOnlyProvider: jsonRpcProvider }; // jsonRpcProvider is a wrapper around the node. Much faster than a router from the wallet

    //VRF?
};

export default useRunners;
