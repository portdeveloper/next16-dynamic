"use client";

import { FC, FormEventHandler, useState } from "react";
import { parseEther } from "viem";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";

export const SendTransactionSection: FC = () => {
  const { primaryWallet } = useDynamicContext();

  const [txnHash, setTxnHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!primaryWallet || !isEthereumWallet(primaryWallet)) return null;

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setTxnHash("");

    try {
      const formData = new FormData(event.currentTarget);

      const address = formData.get("address") as string;
      const amount = formData.get("amount") as string;

      const publicClient = await primaryWallet.getPublicClient();
      const walletClient = await primaryWallet.getWalletClient();

      const transaction = {
        to: address as `0x${string}`,
        value: amount ? parseEther(amount) : undefined,
      };

      const hash = await walletClient.sendTransaction(transaction);
      setTxnHash(hash);

      // Wait for the transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      console.log("Transaction mined:", receipt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Send Transaction
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            To Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            placeholder="0x..."
            className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-black placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-white dark:focus:ring-white"
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Amount (MON)
          </label>
          <input
            id="amount"
            name="amount"
            type="text"
            required
            placeholder="0.05"
            className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-black placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-white dark:focus:ring-white"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {isLoading ? "Sending..." : "Send Transaction"}
        </button>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-900 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

        {txnHash && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Transaction Successful!
            </p>
            <a
              href={`https://testnet.monadscan.com/tx/${txnHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
            >
              View on Monadscan Explorer
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <p className="break-all text-center font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {txnHash}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
