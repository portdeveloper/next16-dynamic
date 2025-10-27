"use client";

import { FC, useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { formatEther } from "viem";

export const WalletBalance: FC = () => {
  const { primaryWallet } = useDynamicContext();
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
        setBalance(null);
        return;
      }

      setIsLoading(true);

      try {
        const publicClient = await primaryWallet.getPublicClient();

        const balanceResult = await publicClient.getBalance({
          address: primaryWallet.address as `0x${string}`,
        });

        const balanceInMon = formatEther(balanceResult);
        setBalance(balanceInMon);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [primaryWallet]);

  if (!primaryWallet) return null;

  return (
    <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
        Wallet Balance
      </h2>

      {isLoading ? (
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      ) : balance !== null ? (
        <div className="space-y-2">
          <p className="text-3xl font-bold text-black dark:text-white">
            {parseFloat(balance).toFixed(4)} MON
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Address: {primaryWallet.address.slice(0, 6)}...
            {primaryWallet.address.slice(-4)}
          </p>
        </div>
      ) : (
        <div className="text-zinc-600 dark:text-zinc-400">
          Unable to fetch balance
        </div>
      )}
    </div>
  );
};
