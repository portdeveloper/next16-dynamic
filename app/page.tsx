"use client";

import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { WalletBalance } from "./components/WalletBalance";
import { SendTransactionSection } from "./components/SendTransaction";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white p-4 dark:bg-black">
      <DynamicWidget />
      <WalletBalance />
      <SendTransactionSection />
    </div>
  );
}
