import { XCircleIcon } from "@heroicons/react/16/solid";
import * as Dialog from "@radix-ui/react-dialog";
import { useContext, useState } from "react";
import useCreateProposal from "../hooks/useCreateProposal";
import { AppContext } from "../context/AppContext";

const CreateProposalModal = () => {
    const {isCreatingProposals} = useContext(AppContext)
    const handleCreateProposal = useCreateProposal();
    const [state, setState] = useState({
        description: "",
        recipient: "",
        amount: "",
        deadline: "",
        minVote: 2,
    });


    const handleInputChange = (name, e) => {
        setState((preState) => ({ ...preState, [name]: e.target.value }));
    };

    const { amount, deadline, description, minVote, recipient } = state;
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="bg-blue-500 p-4 text-white shadow-md rounded-md">
                    Create Proposal
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium mb-6">
                        Create Proposal
                    </Dialog.Title>
                    <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                            className="text-violet11 w-[90px] text-right text-[15px]"
                            htmlFor="name"
                        >
                            Description
                        </label>
                        <input
                            className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            id="name"
                            type="text"
                            value={description}
                            onChange={(e) =>
                                handleInputChange("description", e)
                            }
                        />
                    </fieldset>
                    <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                            className="text-violet11 w-[90px] text-right text-[15px]"
                            htmlFor="username"
                        >
                            Recipient
                        </label>
                        <input
                            className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            id="username"
                            type="text"
                            value={recipient}
                            onChange={(e) => handleInputChange("recipient", e)}
                        />
                    </fieldset>
                    <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                            className="text-violet11 w-[90px] text-right text-[15px]"
                            htmlFor="username"
                        >
                            Amount
                        </label>
                        <input
                            className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            id="username"
                            type="text"
                            value={amount}
                            onChange={(e) => handleInputChange("amount", e)}
                        />
                    </fieldset>
                    <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                            className="text-violet11 w-[90px] text-right text-[15px]"
                            htmlFor="username"
                        >
                            Deadline
                        </label>
                        <input
                            className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            id="username"
                            type="text"
                            value={deadline}
                            onChange={(e) => handleInputChange("deadline", e)}
                        />
                    </fieldset>
                    <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                            className="text-violet11 w-[90px] text-right text-[15px]"
                            htmlFor="username"
                        >
                            Min Required Votes
                        </label>
                        <input
                            className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                            id="username"
                            type="text"
                            value={minVote}
                            onChange={(e) => handleInputChange("minVote", e)}
                        />
                    </fieldset>
                    <div className="mt-[25px] flex w-full">
                        <button
                            className="block w-full bg-blue-500 p-4 text-white items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                            onClick={() =>
                                handleCreateProposal(
                                    description,
                                    recipient,
                                    amount,
                                    deadline,
                                    minVote
                                )
                            }
                            disabled={isCreatingProposals}
                        >
                            {isCreatingProposals ? "..." : "Create"}
                        </button>
                    </div>
                    <Dialog.Close asChild>
                        <button
                            className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                            aria-label="Close"
                        >
                            <XCircleIcon />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default CreateProposalModal;
