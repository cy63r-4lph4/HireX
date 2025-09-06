import { useEffect } from "react";
import { useTargetNetwork } from "./scaffold-eth";
import { useQueryClient } from "@tanstack/react-query";
import { useBlockNumber, useReadContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";

export type UserProfile = {
  user: string;
  ensName: string;
  metadataURI: string;
  exists: boolean;
  hasEFP: boolean;
  credentialHash: string;
  reputation: bigint;
};

export const useGetProfile = (address?: string) => {
  const { targetNetwork } = useTargetNetwork();
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    chainId: targetNetwork.id,
  });

  const profileContract = (deployedContracts as any)[String(targetNetwork.id)]?.Profile;

  const hasRequirements = !!address && !!profileContract;

  const {
    data: profileData,
    queryKey,
    isError,
    isLoading,
  } = useReadContract({
    abi: hasRequirements ? profileContract.abi : undefined,
    address: hasRequirements ? (profileContract.address as `0x${string}`) : undefined,
    functionName: hasRequirements ? "getProfile" : undefined,
    args: hasRequirements ? [address as string] : undefined,
    chainId: targetNetwork.id,
  });

  useEffect(() => {
    if (blockNumber) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [blockNumber, queryClient, queryKey]);

  const profileTyped = profileData as UserProfile | null;
  const hasProfile = profileTyped?.exists ?? false;

  return {
    profile: profileTyped,
    hasProfile,
    isError,
    isLoading,
  };
};
