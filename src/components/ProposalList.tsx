import React from "react";

interface ProposalListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDeadline = (proposal: any) => {
    if (!proposal.voting_start_time_ns || !proposal.voting_duration_ns) {
      return 'TBD';
    }
    const startTime = parseInt(proposal.voting_start_time_ns) / 1000000;
    const duration = parseInt(proposal.voting_duration_ns) / 1000000;
    const deadline = new Date(startTime + duration);
    return deadline.toLocaleDateString();
  };

  const getVotingProgress = (proposal: any) => {
    if (!proposal.voting_start_time_ns || !proposal.voting_duration_ns || proposal.status !== 'Voting') {
      return 0;
    }
    const startTime = parseInt(proposal.voting_start_time_ns) / 1000000;
    const duration = parseInt(proposal.voting_duration_ns) / 1000000;
    const endTime = startTime + duration;
    const now = Date.now();
    
    if (now < startTime) return 0;
    if (now > endTime) return 100;
    
    return Math.min(100, Math.max(0, ((now - startTime) / duration) * 100));
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-red-500";
    if (progress >= 60) return "bg-yellow-500";
    if (progress >= 40) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {proposals.map((proposal: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const voteBreakdown = proposal.votes?.map((vote: any, index: number) => {
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
        });

        return (
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
            
            {/* Voting Progress Bar */}
            {proposal.status === 'Voting' && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Voting Progress</span>
                  <span className="text-sm font-medium text-blue-400">
                    {getVotingProgress(proposal).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(getVotingProgress(proposal))}`}
                    style={{ width: `${getVotingProgress(proposal)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
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
                {voteBreakdown}
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
        );
      })}
    </div>
  );
};

export default ProposalList; 