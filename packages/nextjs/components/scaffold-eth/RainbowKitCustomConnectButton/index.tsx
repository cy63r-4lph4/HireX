"use client";

import { useEffect, useState } from "react";
import { Balance } from "../Balance";
import { CreateProfileModal } from "../ProfileModal";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { RevealBurnerPKModal } from "./RevealBurnerPKModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Address } from "viem";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGetProfile } from "~~/hooks/useGetProfile";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

// Inner component to allow hooks usage
const RainbowButtonInner = ({ account, chain, mounted, openConnectModal }: any) => {
  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();

  const [currentAccount, setCurrentAccount] = useState<Address | undefined>();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (account?.address) {
      setCurrentAccount(account.address as Address);
    }
  }, [account]);

  const { profile, isLoading } = useGetProfile(currentAccount);

  // Open profile modal if account exists but profile doesn’t
  useEffect(() => {
    if (currentAccount && !isLoading && !profile?.exists) {
      setShowProfileModal(true);
    }
  }, [currentAccount, isLoading, profile]);

  const connected = mounted && account && chain;
  const displayName = profile?.ensName || account?.displayName || (account?.address ? account.address : "");
  const blockExplorerAddressLink = account ? getBlockExplorerAddressLink(targetNetwork, account.address) : undefined;

  return (
    <>
      {!connected ? (
        <button className="btn btn-primary btn-sm" onClick={openConnectModal} type="button">
          Connect Wallet
        </button>
      ) : chain.unsupported || chain.id !== targetNetwork.id ? (
        <WrongNetworkDropdown />
      ) : (
        <div className="flex items-center gap-2">
          <div className="sm:flex items-center px-3 py-1.5 text-xs rounded-lg hover:bg-white/10">
            <span className="text-xs font-bold" style={{ color: networkColor }}>
              {chain.name}
            </span>
          </div>

          <Balance address={account.address as Address} className="min-h-0 h-auto" />

          <AddressInfoDropdown
            address={account.address as Address}
            displayName={displayName}
            ensAvatar={account.ensAvatar}
            blockExplorerAddressLink={blockExplorerAddressLink}
          />

          <RevealBurnerPKModal />
        </div>
      )}

      {showProfileModal && (
        <CreateProfileModal address={account?.address as Address} onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
};

export const RainbowKitCustomConnectButton = () => {
  return <ConnectButton.Custom>{props => <RainbowButtonInner {...props} />}</ConnectButton.Custom>;
};
