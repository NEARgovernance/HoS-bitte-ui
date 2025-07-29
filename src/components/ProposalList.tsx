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

  return (
    <div className="space-y-6">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {proposals.map((proposal: any) => (
        <div
          key={proposal.id}
          className="p-4 border border-gray-700 rounded-lg bg-gray-900 text-white"
        >
          <h3 className="text-lg font-semibold mb-1">
            # {proposal.id} {proposal.title}
          </h3>
          <p className="text-gray-300 mb-2">{proposal.description}</p>
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-sm text-gray-400 mb-1">Vote options:</span>
            <div className="flex flex-wrap gap-2">
              {proposal.voting_options?.map((option: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm border border-gray-600"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProposalList; 