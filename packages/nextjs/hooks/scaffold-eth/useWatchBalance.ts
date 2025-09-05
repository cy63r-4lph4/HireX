import { useEffect } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useQueryClient } from "@tanstack/react-query";
import { useBlockNumber, useReadContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";

export type CoreBalance = {
  balance: bigint;
  symbol: string;
  decimals: number;
};

export const useWatchCoreBalance = (address?: string) => {
  const { targetNetwork } = useTargetNetwork();
  const queryClient = useQueryClient();

  const { data: blockNumber } = useBlockNumber({
    watch: true,
    chainId: targetNetwork.id,
  });

  const coreToken = (deployedContracts as any)[String(targetNetwork.id)]?.Alph4Core;

  const {
    data: balanceData,
    queryKey,
    isError,
    isLoading,
  } = useReadContract({
    abi: coreToken.abi,
    address: coreToken.address as `0x${string}`,
    functionName: "balanceOf",
    args: [address!],
    chainId: targetNetwork.id,
  });

  const { data: symbol } = useReadContract({
    abi: coreToken.abi,
    address: coreToken.address as `0x${string}`,
    functionName: "symbol",
    chainId: targetNetwork.id,
  });

  const { data: decimals } = useReadContract({
    abi: coreToken.abi,
    address: coreToken.address as `0x${string}`,
    functionName: "decimals",
    chainId: targetNetwork.id,
  });

  useEffect(() => {
    if (blockNumber) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [blockNumber, queryClient, queryKey]);

  if (!address) {
    return { balance: null, symbol: undefined, decimals: undefined, isError: false, isLoading: false };
  }

  return {
    balance: balanceData as bigint | undefined,
    symbol: (symbol as string) ?? "CORE",
    decimals: (decimals as number) ?? 18,
    isError,
    isLoading,
  } as CoreBalance & { isError: boolean; isLoading: boolean };
};
