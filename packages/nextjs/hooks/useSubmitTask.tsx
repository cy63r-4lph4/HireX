"use client";

import { useCallback, useState } from "react";
import { useTargetNetwork } from "./scaffold-eth";
import { ethers } from "ethers";
import { useAccount, useBlockNumber, useWriteContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { TaskPayload } from "~~/interface";

export function useSubmitTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { targetNetwork } = useTargetNetwork();
  useBlockNumber({
    watch: true,
    chainId: targetNetwork.id,
  });

  // ✅ get user address
  const { address } = useAccount();

  // CoreToken + JobFactory addresses
  const coreTokenInfo = (deployedContracts as any)[String(targetNetwork.id)]?.Alph4Core;
  const jobFactoryInfo = (deployedContracts as any)[String(targetNetwork.id)]?.JobFactory;

  const { writeContractAsync } = useWriteContract();

  const submitTask = useCallback(
    async (task: TaskPayload) => {
      if (!coreTokenInfo || !jobFactoryInfo) {
        throw new Error("Contracts not deployed for this chain");
      }
      if (!address) {
        throw new Error("Wallet not connected");
      }

      try {
        setLoading(true);
        setError(null);

        // === 1. Approve JobFactory to spend hirer's budget ===
        const decimals = Number(process.env.NEXT_PUBLIC_CORE_DECIMALS ?? 18);
        const budgetRaw = ethers.parseUnits(task.budget.toString(), decimals);

        await writeContractAsync({
          abi: coreTokenInfo.abi,
          address: coreTokenInfo.address,
          functionName: "approve",
          args: [jobFactoryInfo.address, budgetRaw],
        });

        // === 2. Call backend with hirer included ===
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...task,
            hirer: address,
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to submit task: ${res.statusText}`);
        }

        const data = await res.json();
        return data;
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [coreTokenInfo, jobFactoryInfo, writeContractAsync, address],
  );

  return { submitTask, loading, error };
}
