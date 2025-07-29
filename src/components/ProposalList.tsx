import React from "react";

interface ProposalListProps {
  data: any; // Accepts array or object with proposals
}

const ProposalList: React.FC<ProposalListProps> = ({ data }) => {
  // Support both array and { proposals: [...] }
  const proposals = Array.isArray(data)
    ? data
    : Array.isArray(data?.proposals)
      ? data.proposals
      : [];

  if (!proposals.length) {
    return <div className="text-gray-400">No proposals found.</div>;
  }

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
        return 'text-green-400 bg-green-900';
      case 'Voting':
        return 'text-yellow-400 bg-yellow-900';
      case 'Pending':
        return 'text-blue-400 bg-blue-900';
      case 'Created':
        return 'text-gray-400 bg-gray-800';
      default:
        return 'text-gray-400 bg-gray-800';
    }
  };

  const getDeadline = (proposal: any) => {
    if (!proposal.voting_start_time_ns || !proposal.voting_duration_ns) {
      return 'TBD';
    }
    const startTime = parseInt(proposal.voting_start_time_ns) / 1000000;
    const duration = parseInt(proposal.voting_duration_ns) / 1000000;
    const deadline = new Date(startTime + duration);
    return deadline.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {proposals.map((proposal: any) => (
        <div
          key={proposal.id}
          className="p-4 border border-gray-700 rounded-lg bg-gray-900 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">
              # {proposal.id} {proposal.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                {proposal.status}
              </span>
              <span className="text-xs text-gray-400">
                Deadline: {getDeadline(proposal)}
              </span>
            </div>
          </div>
          <p className="text-gray-300 mb-2">{proposal.description}</p>
          
          {/* Snapshot Information */}
          {proposal.snapshot_and_state && (
            <div className="mb-3 p-2 bg-gray-800 rounded text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-400">Snapshot Block:</span>
                  <span className="ml-1">{Number(proposal.snapshot_and_state.snapshot?.block_height || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Total vNEAR:</span>
                  <span className="ml-1">{formatVenear(proposal.snapshot_and_state.total_venear || "0")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Vote Breakdown */}
          <div className="mb-3">
            <div className="text-sm text-gray-400 mb-1">Vote Breakdown:</div>
            <div className="space-y-1">
              {proposal.votes?.map((vote: any, index: number) => {
                const votePercentage = proposal.total_votes?.total_votes > 0 
                  ? ((vote.total_votes / proposal.total_votes.total_votes) * 100).toFixed(1)
                  : "0.0";
                const venearPercentage = proposal.total_votes?.total_venear && parseFloat(proposal.total_votes.total_venear) > 0
                  ? ((parseFloat(vote.total_venear) / parseFloat(proposal.total_votes.total_venear)) * 100).toFixed(1)
                  : "0.0";
                
                const getPercentageColor = (percentage: string) => {
                  const num = parseFloat(percentage);
                  if (num >= 50) return "text-green-400";
                  if (num >= 25) return "text-yellow-400";
                  return "text-red-400";
                };
                
                return (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span>{proposal.voting_options?.[index] || `Option ${index + 1}`}</span>
                    <div className="text-right">
                      <div>{vote.total_votes} votes (<span className={getPercentageColor(votePercentage)}>{votePercentage}%</span>)</div>
                      <div className="text-gray-400">{formatVenear(vote.total_venear)} (<span className={getPercentageColor(venearPercentage)}>{venearPercentage}%</span>)</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700 flex justify-between items-center text-sm">
              <span className="text-gray-400">Total:</span>
              <div className="text-right">
                <div>{proposal.total_votes?.total_votes || 0} votes</div>
                <div className="text-gray-400">{formatVenear(proposal.total_votes?.total_venear || "0")}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProposalList; 