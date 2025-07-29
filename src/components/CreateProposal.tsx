"use client";

import React, { useState } from "react";
import { useBitteWallet } from "@bitte-ai/react";

function parseNearAmount(amountStr: string) {
  if (!amountStr || isNaN(Number(amountStr))) return "0";
  const [wholePart, fracPart = ""] = amountStr.split(".");
  const paddedFrac = (fracPart + "0".repeat(24)).slice(0, 24);
  return BigInt(wholePart + paddedFrac).toString();
}

interface CreateProposalProps {
  onSubmit?: (proposal: {
    title: string;
    description: string;
    voting_options: string[];
    link?: string;
  }) => void;
}

const CreateProposal: React.FC<CreateProposalProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [votingOptions, setVotingOptions] = useState<string[]>(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const { selector, activeAccountId } = useBitteWallet();

  const handleOptionChange = (idx: number, value: string) => {
    const updated = [...votingOptions];
    updated[idx] = value;
    setVotingOptions(updated);
  };

  const addOption = () => setVotingOptions([...votingOptions, ""]);
  const removeOption = (idx: number) =>
    setVotingOptions(votingOptions.filter((_, i) => i !== idx));

  const handleCreate = async (proposal: {
    title: string;
    description: string;
    voting_options: string[];
    link?: string;
  }) => {
    try {
      const wallet = await selector.wallet();
      const VOTING_CONTRACT = process.env.VOTING_CONTRACT || "example.ballotbox.testnet";
      const gasResult = "300000000000000"; // 300 Tgas
      const filteredVotingOptions = proposal.voting_options.filter((opt) => opt.trim() !== "");
      const result = await wallet.signAndSendTransaction({
        receiverId: VOTING_CONTRACT,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "create_proposal",
              gas: gasResult,
              deposit: parseNearAmount("0.2"), // 0.2 NEAR
              args: {
                metadata: {
                  title: proposal.title.trim(),
                  description: proposal.description.trim(),
                  link: proposal.link ? proposal.link.trim() : "",
                  voting_options: filteredVotingOptions
                }
              }
            }
          }
        ]
      });
      alert("Proposal created successfully!");
    } catch (error) {
      alert("Failed to create proposal: " + (error as Error).message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const proposal = {
      title,
      description,
      voting_options: votingOptions,
      link,
    };
    if (onSubmit) {
      await onSubmit(proposal);
    } else {
      await handleCreate(proposal);
    }
    setSubmitting(false);
    setTitle("");
    setDescription("");
    setLink("");
    setVotingOptions([""]);
  };

  const isFormValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    votingOptions.filter((opt) => opt.trim() !== "").length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-gray-900 border border-gray-700 rounded-lg shadow space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Create Proposal</h2>
      <div>
        <label className="block text-gray-300 mb-1">Title</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
        />
      </div>
      <div>
        <label className="block text-gray-300 mb-1">Description</label>
        <textarea
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
        />
      </div>
      <div>
        <label className="block text-gray-300 mb-1">Link (optional)</label>
        <input
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="block text-gray-300 mb-1">Voting Options</label>
        <div className="space-y-2">
          {votingOptions.map((option, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
                value={option}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                required
                placeholder={`Option ${idx + 1}`}
              />
              {votingOptions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="text-red-400 hover:text-red-600"
                  title="Remove option"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="text-blue-400 hover:text-blue-600 text-sm mt-2"
          >
            + Add Option
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting || !isFormValid}
        className={`w-full py-2 rounded font-semibold transition
          ${submitting || !isFormValid
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"}
        `}
      >
        {submitting ? "Submitting..." : "Create Proposal"}
      </button>
    </form>
  );
};

export default CreateProposal; 