"use client";

import React, { useState } from "react";
import { useBitteWallet } from "@bitte-ai/react";

function parseNearAmount(amountStr: string) {
  if (!amountStr || isNaN(Number(amountStr))) return "0";
  const [wholePart, fracPart = ""] = amountStr.split(".");
  const paddedFrac = (fracPart + "0".repeat(24)).slice(0, 24);
  return BigInt(wholePart + paddedFrac).toString();
}

interface DepositAndStakeProps {
  onSubmit?: (amount: string) => void;
}

const DepositAndStake: React.FC<DepositAndStakeProps> = ({ onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [stakingPool, setStakingPool] = useState("chorusone.pool.f863973.m0");
  const [submitting, setSubmitting] = useState(false);
  const { selector } = useBitteWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const wallet = await selector.wallet();
      const VENEAR_CONTRACT_ID = process.env.VENEAR_CONTRACT_ID || "v.hos03.testnet";
      const gasResult = "300000000000000"; // 300 Tgas
      const depositAmount = parseNearAmount(amount);

      // First, deposit NEAR to the vNEAR contract
      await wallet.signAndSendTransaction({
        receiverId: VENEAR_CONTRACT_ID,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "deposit_and_stake",
              gas: gasResult,
              deposit: depositAmount,
              args: {
                staking_pool: stakingPool
              }
            }
          }
        ]
      });

      alert("Successfully deposited and staked NEAR!");
      
      if (onSubmit) {
        await onSubmit(amount);
      }
      
      setAmount("");
    } catch (error) {
      alert("Failed to deposit and stake: " + (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = amount.trim().length > 0 && parseFloat(amount) > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-gray-900 border border-gray-700 rounded-lg shadow space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Deposit & Stake NEAR</h2>
      
      <div>
        <label className="block text-gray-300 mb-1">Amount (NEAR)</label>
        <input
          type="number"
          step="0.000001"
          min="0.000001"
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          required
        />
        <p className="text-xs text-gray-400 mt-1">
          Minimum: 0.000001 NEAR
        </p>
      </div>

      <div>
        <label className="block text-gray-300 mb-1">Staking Pool</label>
        <select
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
          value={stakingPool}
          onChange={(e) => setStakingPool(e.target.value)}
        >
          <option value="chorusone.pool.f863973.m0">Chorus One</option>
          <option value="figment.pool.f863973.m0">Figment</option>
          <option value="p2p.pool.f863973.m0">P2P</option>
          <option value="stakewars.pool.f863973.m0">Stake Wars</option>
        </select>
        <p className="text-xs text-gray-400 mt-1">
          Select a validator to stake with
        </p>
      </div>

      <div className="p-3 bg-blue-900 border border-blue-700 rounded text-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-300">ℹ️</span>
          <span className="text-blue-200 font-medium">What happens:</span>
        </div>
        <ul className="text-blue-100 text-xs space-y-1">
          <li>• NEAR will be deposited to the vNEAR contract</li>
          <li>• Funds will be automatically staked with the selected validator</li>
          <li>• You&apos;ll receive vNEAR tokens representing your stake</li>
          <li>• Staking rewards will be automatically compounded</li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={submitting || !isFormValid}
        className={`w-full py-3 rounded font-semibold transition
          ${submitting || !isFormValid
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white"}
        `}
      >
        {submitting ? "Processing..." : "Deposit & Stake"}
      </button>

      {amount && isFormValid && (
        <div className="text-center text-sm text-gray-400">
          You will deposit: <span className="text-green-400 font-medium">{parseFloat(amount).toLocaleString()} NEAR</span>
        </div>
      )}
    </form>
  );
};

export default DepositAndStake; 