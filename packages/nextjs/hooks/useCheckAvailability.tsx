import { useTargetNetwork } from "./scaffold-eth";
import { useReadContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";

export const useCheckNameAvailability = (name?: string) => {
  const { targetNetwork } = useTargetNetwork();

  const ensManagerContract = (deployedContracts as any)[String(targetNetwork.id)]?.ENSManager;
  const { data, isLoading, isError } = useReadContract({
    abi: ensManagerContract?.abi,
    address: ensManagerContract?.address as `0x${string}` | undefined,
    functionName: "isAvailable",
    args: name ? [name] : undefined,
    chainId: targetNetwork.id,
    // 👇 correct way: control via `query` object
    query: {
      enabled: Boolean(name && ensManagerContract?.address),
    },
  });

  return {
    available: data ?? false,
    isLoading,
    isError,
  };
};
