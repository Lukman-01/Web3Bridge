import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract, useWriteContract } from "wagmi";
import { ABI } from "../src/abi";
import { useState } from "react";
import { liskSepolia } from "viem/chains";
import { config } from "./main";
import { ethers } from "ethers";
export default function App() {
  const { writeContract } = useWriteContract();
  const [accountDetails, setAccountDetails] = useState({name: "", age: 0});
  const [loading, setIsLoading] = useState(false);
  const [withdrawalAmount, setwithdrawalAmount] = useState("");
  const [transferDetails, settransferDetails] = useState({receiver: "", amount: 0});
  const [userCount, setUserCount] = useState(0);

  const { data } = useReadContract({
    abi: ABI,
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    functionName: "getUserCount",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    
    setAccountDetails((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleTransferChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
  
    settransferDetails((prev) => {
      return{
        ...prev,
        [name]: value,
      }
    })
  }   

  const handleTransfer = async ({receiver, amount}) => {
    setIsLoading(true)
    console.log(amount, receiver);
    try {
      writeContract({
        abi:ABI,
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        functionName: "transfer",
        args: [receiver, ethers.parseUnits(amount)],
        chainId: liskSepolia.id,
      })
      
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

  }

  const handleDeposit = () => {
    try {
      writeContract({
        abi: ABI,
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        functionName: "deposit",
        args: [],

        value: ethers.parseEther("1.1"),
      });
    } catch (error) {}
  };

  const handleCreateAccount = async ({ name, age }) => {
    // event.preventDefault();
    setIsLoading(true);
    try {
      writeContract({
        abi: ABI,
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        functionName: "createAccount",
        args: [name, age],
        chainId: liskSepolia.id,
      });
    } catch (error) {
      console.log("An error occured", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawal =  async(amount) => {
    try{
      writeContract({
        abi: ABI,
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        functionName: "withdrawEther",
        args: [ethers.parseEther(amount)],
        chainId: liskSepolia.id,
      });
    }catch(error){
      console.error(error)
    }
  }

  // const handleGetUser = async () => {
  //   try {
    
  //     setUserCount(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const fetchUserCount = () => {
    if (data) {
      console.log(data.toString());
      setUserCount(data.toString());
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <a href="/" className="text-xl font-bold">
                My App
              </a>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="/"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Home
                </a>
                <a
                  href="/about"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  About
                </a>
                <a
                  href="/contact"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Contact
                </a>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold mb-4">Welcome to My App</h1>
          <ConnectButton />
        </div>

        <div className="flex items-ceter justify-center">
          <div className="max-w-md mx-auto">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={accountDetails.name}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 w-[500px] py-2 px-2 border border-black rounded-[4px]"
                />
              </div>
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={accountDetails.age}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 w-[500px] py-2 px-2 border border-black rounded-[4px]"
                />
              </div>
              <button
                disabled={loading}
                onClick={(e) =>
                  handleCreateAccount({
                    event: e,
                    name: accountDetails.name,
                    age: accountDetails.age,
                  })
                }
                className="w-[500px] h-[30px] flex items-center justify-center bg-green-500 rounded-[8px] text-white"
              >
                {loading ? "Loading..." : "Submit"}
              </button>
              <button
                disabled={loading}
                onClick={handleDeposit}
                className="w-[500px] h-[30px] flex items-center justify-center bg-red-500 rounded-[8px] text-white"
              >
                {loading ? "Loading..." : "Deposit"}
              </button>
              <div className="flex items-center justfy-between w-[500px]">
              <input
                  type="number"
                  id=""
                  name="withdrawalAmount"
                  value={withdrawalAmount}
                  onChange={(e) => setwithdrawalAmount(e.target.value)}
                  className="mt-1 w-[500px] py-2 px-2 border border-black rounded-[4px]"
                />
                 <button
                disabled={loading}
                onClick={()=> handleWithdrawal(withdrawalAmount)}
                className="w-[500px] h-[30px] flex items-center justify-center bg-red-500 rounded-[8px] text-white"
              >
                {loading ? "Loading..." : "Withdraw Funds"}
              </button>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Reciever
                </label>
                <input 
                  type="text" 
                  id="receiver" 
                  name="receiver" 
                  value={transferDetails.receiver}
                  onChange={(e) => handleTransferChange(e)}
                  className="mt-1 w-[500px] py-2 px-2 border border-black rounded-[4px]" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input 
                  type="text" 
                  id="amount" 
                  name="amount" 
                  value={transferDetails.amount}
                  onChange={(e) => handleTransferChange(e)}
                  className="mt-1 w-[500px] py-2 px-2 border border-black rounded-[4px]" />
              </div>
              <button
                disabled={loading}
                onClick={(e) =>
                  handleTransfer({
                    event: e,
                    receiver: transferDetails.receiver,
                    amount: transferDetails.amount,
                  })
                }
                className="w-[500px] h-[30px] flex items-center justify-center bg-green-500 rounded-[8px] text-white">
                {loading ? "Loading..." : "Transfer"}
              </button>
              <div className="flex items-center justify-center">
                <div className="max-w-md mx-auto">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h2 className="text-xl font-bold">User Count</h2>
                      <p className="text-2xl">{userCount}</p>
                    </div>
                    <button
                      onClick={() => fetchUserCount()}
                      className="w-[500px] h-[30px] flex items-center justify-center bg-blue-500 rounded-[8px] text-white"
                      >
                      Get User Count
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
