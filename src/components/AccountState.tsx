"use client";

import React from "react";

interface AccountStateData {
  accountBalance: {
    raw: string;
    nears: string;
  };
  veNearTokenBalance: {
    raw: string;
    nears: string;
  };
  lockup: {
    isLockupDeployed: boolean;
    lockupId: string;
    lockupBalance: {
      raw: string;
      nears: string;
    };
    lockupInfoReady: boolean;
    lockedAmount: {
      raw: string;
      nears: string;
    };
    lockupLiquidOwnersBalance: {
      raw: string;
      nears: string;
    };
    lockupLiquidAmount: {
      raw: string;
      nears: string;
    };
    withdrawableAmount: {
      raw: string;
      nears: string;
    };
    lockupPendingAmount: {
      raw: string;
      nears: string;
    };
    lockupUnlockTimestampNs: string;
    untilUnlock: string;
    registrationCost: {
      raw: string;
      nears: string;
    };
    lockupCost: {
      raw: string;
      nears: string;
    };
    stakingPool: string;
    knownDepositedBalance: {
      raw: string;
      nears: string;
    };
  };
}

interface AccountStateProps {
  data: AccountStateData;
}

const AccountState: React.FC<AccountStateProps> = ({ data }) => {
  const formatNEAR = (amount: string) => {
    return `${parseFloat(amount).toLocaleString()} NEAR`;
  };

  const getStatusColor = (isReady: boolean) => {
    return isReady ? "text-green-400" : "text-red-400";
  };

  return (
    <div className="p-6 border border-gray-700 rounded-lg bg-gray-900 text-white">
      <h3 className="text-xl font-semibold mb-4">Account State</h3>
      
      <div className="space-y-6">
        {/* Account Balance */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <h4 className="text-lg font-medium mb-3 text-blue-400">Account Balance</h4>
          <div className="text-2xl font-bold text-green-400">
            {formatNEAR(data.accountBalance.nears)}
          </div>
        </div>

        {/* vNEAR Token Balance */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <h4 className="text-lg font-medium mb-3 text-purple-400">vNEAR Token Balance</h4>
          <div className="text-2xl font-bold text-purple-400">
            {formatNEAR(data.veNearTokenBalance.nears)}
          </div>
        </div>

        {/* Lockup Information */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-medium text-yellow-400">Lockup Status</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              data.lockup.isLockupDeployed ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"
            }`}>
              {data.lockup.isLockupDeployed ? "Deployed" : "Not Deployed"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Lockup ID:</span>
              <div className="font-mono text-xs break-all mt-1">{data.lockup.lockupId}</div>
            </div>
            
            <div>
              <span className="text-gray-400">Staking Pool:</span>
              <div className="font-mono text-xs break-all mt-1">{data.lockup.stakingPool}</div>
            </div>

            <div>
              <span className="text-gray-400">Lockup Balance:</span>
              <div className="font-bold text-green-400">{formatNEAR(data.lockup.lockupBalance.nears)}</div>
            </div>

            <div>
              <span className="text-gray-400">Locked Amount:</span>
              <div className="font-bold text-yellow-400">{formatNEAR(data.lockup.lockedAmount.nears)}</div>
            </div>

            <div>
              <span className="text-gray-400">Liquid Balance:</span>
              <div className="font-bold text-blue-400">{formatNEAR(data.lockup.lockupLiquidOwnersBalance.nears)}</div>
            </div>

            <div>
              <span className="text-gray-400">Withdrawable Amount:</span>
              <div className="font-bold text-green-400">{formatNEAR(data.lockup.withdrawableAmount.nears)}</div>
            </div>

            <div>
              <span className="text-gray-400">Pending Amount:</span>
              <div className="font-bold text-orange-400">{formatNEAR(data.lockup.lockupPendingAmount.nears)}</div>
            </div>

            <div>
              <span className="text-gray-400">Deposited Balance:</span>
              <div className="font-bold text-purple-400">{formatNEAR(data.lockup.knownDepositedBalance.nears)}</div>
            </div>
          </div>

          {/* Costs */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h5 className="text-md font-medium mb-2 text-gray-300">Costs</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Registration Cost:</span>
                <div className="font-bold">{formatNEAR(data.lockup.registrationCost.nears)}</div>
              </div>
              <div>
                <span className="text-gray-400">Lockup Cost:</span>
                <div className="font-bold">{formatNEAR(data.lockup.lockupCost.nears)}</div>
              </div>
            </div>
          </div>

          {/* Info Status */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Lockup Info Ready:</span>
              <span className={getStatusColor(data.lockup.lockupInfoReady)}>
                {data.lockup.lockupInfoReady ? "✓ Ready" : "✗ Not Ready"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountState; 