import { VStack, Box } from "@chakra-ui/react";
import TweetCard from "./TweetCard";
import { useEffect, useState } from "react";
import { AnchorProvider, Idl, Program, web3 } from "@coral-xyz/anchor";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import idl from '../../../anchor/target/idl/solana_twitter.json';
import { BN } from "@coral-xyz/anchor";

const Feed = () => {
  type SolanaWallet = WalletContextState & {
    publicKey: PublicKey;
    signTransaction(tx: web3.Transaction): Promise<web3.Transaction>;
    signAllTransactions(txs: web3.Transaction[]): Promise<web3.Transaction[]>;
  };

  const opts: web3.ConnectionConfig = { commitment: 'processed' };
  const wallet = useWallet();

  const connection = new Connection(clusterApiUrl('devnet'), opts.commitment);
  const provider = new AnchorProvider(
    connection,
    wallet as SolanaWallet,
    {
      preflightCommitment: opts.commitment,
      commitment: opts.commitment
    }
  );
  const program = new Program<Idl>(idl as Idl, provider);

  const [tweets, setTweets] = useState<any[]>([]);

  // Helper function to derive PDA based on author (sender) and timestamp
  const getTweetPDA = async (author: PublicKey, timestamp: number) => {
    const [tweetPDA, _bump] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from("tweet"), // Seed as in the program
        author.toBuffer(),    // Author's public key
      ],
      program.programId
    );
    return tweetPDA;
  };

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const tweetsData = await program.account.tweet.all();

        // Iterate through the accounts and fetch PDAs for each tweet
        const tweetAccountsWithPDA = await Promise.all(tweetsData.map(async (tweetData: any) => {
          const author = tweetData.account.author;
          const timestamp = tweetData.account.timestamp;
          const tweetPDA = await getTweetPDA(author, timestamp);
          
          return {
            ...tweetData,
            pda: tweetPDA.toBase58(), // Attach the PDA to each tweet
          };
        }));

        setTweets(tweetAccountsWithPDA);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };

    fetchTweets();
  }, []);

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
            tweet={tweetData.account} // Pass the account data directly
            pda={tweetData.pda} // Pass the PDA to the TweetCard
          />
        ))}
      </VStack>
    </Box>
  );
};

export default Feed;
