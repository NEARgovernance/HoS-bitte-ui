"use client";

import { useBitteWallet } from "@bitte-ai/react";
import { useState } from "react";

interface ProposalData {
  proposal: {
    id: number;
    creation_time_ns: string;
    proposer_id: string;
    reviewer_id: string;
    voting_start_time_ns: string;
    voting_duration_ns: string;
    rejected: boolean;
    snapshot_and_state?: {
      snapshot?: {
        root?: string;
        length?: number;
        block_height?: string | number;
      };
      timestamp_ns?: string;
      total_venear?: string;
      venear_growth_config?: {
        FixedRate?: {
          annual_growth_rate_ns?: {
            numerator?: string;
            denominator?: string;
          };
        };
      };
    };
    votes: Array<{
      total_venear: string;
      total_votes: number;
    }>;
    total_votes: {
      total_venear: string;
      total_votes: number;
    };
    status: string;
    title: string;
    description: string;
    link: string;
    voting_options: string[];
  };
}

interface ProposalProps {
  data: ProposalData;
}

const Proposal: React.FC<ProposalProps> = ({ data }) => {
  const { proposal } = data;
  const { selector, activeAccountId } = useBitteWallet();
  const [votingOption, setVotingOption] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [venearBalance, setVenearBalance] = useState<string>("");

  const formatTimestamp = (timestampNs: string) => {
    const timestamp = parseInt(timestampNs) / 1000000; // Convert nanoseconds to milliseconds
    return new Date(timestamp).toLocaleString();
  };

  const formatVotingDuration = (durationNs: string) => {
    const durationMs = parseInt(durationNs) / 1000000; // Convert nanoseconds to milliseconds
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  const formatVenear = (venear: string) => {
    const amount = parseFloat(venear) / Math.pow(10, 24); // Convert from yoctoNEAR to NEAR
    return `${amount.toLocaleString()} NEAR`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finished':
        return 'text-green-400';
      case 'Active':
        return 'text-yellow-400';
      case 'Pending':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleVote = async () => {
    if (!votingOption || !activeAccountId) {
      alert("Please select a voting option");
      return;
    }


    setIsVoting(true);
    try {
      const wallet = await selector.wallet();
      
      // Get proof from vNEAR contract
      const VENEAR_CONTRACT_ID = process.env.VENEAR_CONTRACT_ID || "stake.govai.near";
      const proofPayload = {
        jsonrpc: "2.0",
        id: "1",
        method: "query",
        params: {
          request_type: "call_function",
          finality: "final",
          account_id: VENEAR_CONTRACT_ID,
          method_name: "get_proof",
          args_base64: Buffer.from(JSON.stringify({ 
            account_id: activeAccountId,
          })).toString("base64"),
        },
      };

      const proofResponse = await fetch("https://rpc.mainnet.near.org", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proofPayload),
      });

      const proofResult = await proofResponse.json();
      
      if (!proofResult.result || !proofResult.result.result) {
        throw new Error("Failed to get proof data");
      }

      // Parse the proof data
      const proofData = JSON.parse(Buffer.from(proofResult.result.result, 'base64').toString());
      
      // Call the smart contract to vote with proof
      const result = await wallet.signAndSendTransaction({
        receiverId: process.env.VOTING_CONTRACT || "vote.govai.near",
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "vote",
              args: {
                proposal_id: proposal.id,
                vote_option: votingOption,
                merkleProof: proofData[0],
                vAccount: proofData[1]
              },
              gas: "300000000000000",
              deposit: "0"
            }
          }
        ]
      });
      console.log("Vote transaction result:", result);
      alert("Vote submitted successfully!");
      
      // Reset form
      setVotingOption(null);
      
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to submit vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const isVotingActive = proposal.status === "Voting";

  return (
    <div className="p-6 border border-gray-700 rounded-lg bg-gray-900 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Proposal #{proposal.id}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
          {proposal.status}
        </span>
      </div>

      <div className="space-y-4">
        {/* Title and Description */}
        <div>
          <h4 className="text-lg font-medium mb-2">{proposal.title}</h4>
          <p className="text-gray-300 mb-2">{proposal.description}</p>
          {proposal.link && (
            <a 
              href={proposal.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              View Details
            </a>
          )}
        </div>

        {/* Proposal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <span className="text-gray-400">Proposer:</span>
              <span className="ml-2 font-mono text-sm">{proposal.proposer_id}</span>
            </div>
            <div>
              <span className="text-gray-400">Reviewer:</span>
              <span className="ml-2 font-mono text-sm">{proposal.reviewer_id}</span>
            </div>
            <div>
              <span className="text-gray-400">Created:</span>
              <span className="ml-2">{formatTimestamp(proposal.creation_time_ns)}</span>
            </div>
            <div>
              <span className="text-gray-400">Voting Started:</span>
              <span className="ml-2">{formatTimestamp(proposal.voting_start_time_ns)}</span>
            </div>
            <div>
              <span className="text-gray-400">Duration:</span>
              <span className="ml-2">{formatVotingDuration(proposal.voting_duration_ns)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-gray-400">Total Votes:</span>
              <span className="ml-2">{proposal.total_votes.total_votes}</span>
            </div>
            <div>
              <span className="text-gray-400">Total vNEAR:</span>
              <span className="ml-2">{formatVenear(proposal.total_votes.total_venear)}</span>
            </div>
            <div>
              <span className="text-gray-400">Snapshot Block:</span>
              <span className="ml-2">
                {proposal.snapshot_and_state?.snapshot?.block_height 
                  ? Number(proposal.snapshot_and_state.snapshot.block_height).toLocaleString()
                  : 'N/A'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-400">Rejected:</span>
              <span className={`ml-2 ${proposal.rejected ? 'text-red-400' : 'text-green-400'}`}>
                {proposal.rejected ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Voting Section */}
        {isVotingActive && activeAccountId && (
          <div className="border border-gray-600 rounded-lg p-4 bg-gray-800">
            <h5 className="text-md font-medium mb-3">Cast Your Vote</h5>
            <div className="space-y-3">
              {/* Voting Options */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Option:</label>
                <div className="flex flex-wrap gap-2">
                  {proposal.voting_options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setVotingOption(index)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        votingOption === index
                          ? 'bg-blue-600 text-white border border-blue-500'
                          : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Vote Button */}
              <button
                onClick={handleVote}
                disabled={!votingOption || isVoting}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  votingOption !== null && !isVoting
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isVoting ? 'Submitting Vote...' : 'Submit Vote'}
              </button>
            </div>
          </div>
        )}

        {/* Vote Breakdown */}
        <div>
          <h5 className="text-md font-medium mb-2">Vote Breakdown:</h5>
          <div className="space-y-2">
            {proposal.votes.map((vote, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                <span>{proposal.voting_options[index] || `Option ${index + 1}`}</span>
                <div className="text-right">
                  <div>{vote.total_votes} votes</div>
                  <div className="text-sm text-gray-400">{formatVenear(vote.total_venear)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Status */}
        {!activeAccountId && isVotingActive && (
          <div className="text-center p-4 bg-yellow-900 border border-yellow-600 rounded-lg">
            <p className="text-yellow-200">Please connect your wallet to vote on this proposal.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Proposal; 