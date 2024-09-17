import { VStack, Box } from "@chakra-ui/react";
import TweetCard from "./TweetCard";
import { useEffect, useState } from "react";
import { AnchorProvider, Idl, Program, web3 } from "@coral-xyz/anchor";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from '../../../anchor/target/idl/solana_twitter.json';

const Feed = () => {
  type SolanaWallet = WalletContextState & {
    publicKey: PublicKey;
    signTransaction(tx: web3.Transaction): Promise<web3.Transaction>;
    signAllTransactions(txs: web3.Transaction[]): Promise<web3.Transaction[]>;
  };

  const opts: web3.ConnectionConfig = { commitment: 'processed' };
  const wallet = useWallet();

  const connection = new Connection("http://localhost:8899");
  const provider = new AnchorProvider(
    connection,
    wallet as SolanaWallet,
    {
      preflightCommitment: opts.commitment,
      commitment: opts.commitment
    }
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const program = new Program<Idl>(idl as Idl, provider);

  const [tweets, setTweets] = useState<any[]>([]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const tweetsData = await program.account.tweet.all();
        setTweets(tweetsData);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };

    fetchTweets();
  }, [program]);

  return (
    <Box
      w={{ base: "100%", md: "85%" }} // Full width on mobile, 85% on larger screens
      p={6}
      bg="gray.100"
      overflowY="scroll"
      h="100vh"
    >
      <VStack spacing={4} align="start">
        {tweets.map((tweetData, index) => (
          <TweetCard
            key={index}
            tweet={tweetData.account} // Pass the account directly
          />
        ))}
      </VStack>
    </Box>
  );
};

export default Feed;
