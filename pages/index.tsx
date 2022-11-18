import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import { useContract, Web3Button } from "@thirdweb-dev/react";
import { toast } from "react-toastify";

const Home: NextPage = () => {
  const [tokenSupply, setTokenSupply] = React.useState<any>();
  const [amount, setAmount] = React.useState<number>(0);
  const [pastSales, setPastSales] = React.useState<any>();

  const contract = useContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    "token-drop"
  ).contract;

  React.useEffect(() => {
    const getSupply = async () => {
      const supply = await contract?.totalSupply();
      setTokenSupply(supply);
      setPastSales(contract?.sales);
    };
    getSupply();
  }, [contract, handleSuccess]);

  function handleError(error: any) {
    error.errors.forEach((error: any) => {
      toast.error(error.message);
    });
  }

  function handleSuccess() {
    toast.success(`Congrats, you just purchased ${amount} shit coins 🤣`);
    setAmount(0);
  }

  return (
    <div className="flex min-h-screen bg-slate-900 flex-col items-center justify-center py-2">
      <Head>
        <title>Dumb Coin</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className="flex w-full flex-1 space-y-6 flex-col items-center justify-center px-20 text-center">
        <Image src="/dumb.webp" alt="Dumb Coin" width={200} height={200} />
        <h1 className="text-8xl text-yellow-400 text-leading font-black">
          Dumb Coin.
        </h1>
        {tokenSupply && (
          <h2 className="text-4xl text-white text-leading font-black">
            Total Supply:{" "}
            <span className="text-green-600">{tokenSupply.displayValue}</span>{" "}
            {tokenSupply.symbol}
          </h2>
        )}
        <section className="border-2 lg:w-1/3 border-slate-700 p-3 rounded-lg space-y-3">
          <h1 className="text-white font-bold text-left">Buy</h1>
          <input
            className="w-full h-8 bg-slate-600 color-white p-2 rounded-lg"
            type="number"
            value={amount}
            onChange={(e: any) => setAmount(e.target.value)}
          />
          <div>
            <Web3Button
              accentColor="#5204BF"
              colorMode="dark"
              contractAddress={
                process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string
              }
              action={(contract) => contract.erc20.claim(amount)}
              onSuccess={() => handleSuccess()}
              onError={(err) => handleError(err)}
            >
              ({`${0.001 * amount} ETH`}) Buy Shit Coins
            </Web3Button>
          </div>
        </section>
      </main>

      <footer className="flex h-24 w-full items-center justify-center">
        <a
          className="flex items-center justify-center gap-2 text-slate-600"
          href="https://blogr.conceptcodes.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Developed with ❤️ by Conceptcodes
        </a>
      </footer>
    </div>
  );
};

export default Home;
