"use client";

import { Address, formatEther } from "viem";
import { useDisplayUsdMode } from "~~/hooks/scaffold-eth/useDisplayUsdMode";
// import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useWatchCoreBalance } from "~~/hooks/scaffold-eth/useWatchBalance";
import { useGlobalState } from "~~/services/store/store";

type BalanceProps = {
  address?: Address;
  className?: string;
  usdMode?: boolean;
};

/**
 * Display (ETH & USD) balance of an ETH address.
 */
export const Balance = ({ address, className = "", usdMode }: BalanceProps) => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const isNativeCurrencyPriceFetching = useGlobalState(state => state.nativeCurrency.isFetching);

  const { balance, symbol, isError, isLoading } = useWatchCoreBalance(
    address ?? "0x0000000000000000000000000000000000000000",
  );

  const { displayUsdMode, toggleDisplayUsdMode } = useDisplayUsdMode({ defaultUsdMode: usdMode });

  // Loading skeleton
  if (!address || isLoading || balance === undefined || (isNativeCurrencyPriceFetching && nativeCurrencyPrice === 0)) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded-sm"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="border-2 border-base-content/30 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer">
        <div className="text-warning">Error</div>
      </div>
    );
  }

  // Safe formatting
  const formattedBalance = balance ? Number(formatEther(balance)) : 0;
  const formattedUsd = nativeCurrencyPrice ? (formattedBalance * nativeCurrencyPrice).toFixed(2) : "0.00";

  return (
    <button
      className={`btn btn-sm btn-ghost flex flex-col font-normal items-center hover:bg-transparent ${className}`}
      onClick={toggleDisplayUsdMode}
      type="button"
    >
      <div
        className={`hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full border border-yellow-500/30 
    ${displayUsdMode ? "bg-gradient-to-r from-green-500/20 to-teal-500/20" : "bg-gradient-to-r from-yellow-500/20 to-orange-500/20"}`}
      >
        <span className="text-white text-sm font-medium">
          {displayUsdMode ? formattedUsd : formattedBalance.toFixed(4)}
        </span>
        <span className="core-token text-sm font-bold">{displayUsdMode ? "$" : symbol}</span>
      </div>
    </button>
  );
};
