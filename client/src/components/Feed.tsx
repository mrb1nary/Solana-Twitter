import { VStack, Box } from "@chakra-ui/react";
import TweetCard from "./TweetCard";

const Feed = () => {
  
  const tweets = [
    {
      wallet: "User1234",
      content: "This is a sample tweet on Solana-based Twitter clone!",
      timestamp: new Date(),
    },
    {
      wallet: "SolanaDev",
      content: "Exploring the possibilities of decentralized applications.",
      timestamp: new Date('2023-09-14T12:30:00'),
    },
    {
      wallet: "BlockChainGuru",
      content: "Loving the speed of Solana transactions!",
      timestamp: new Date('2023-09-14T14:00:00'),
    },
  ];

  return (
    <Box w="85%" p={6} bg="gray.100" overflowY="scroll" h="100vh">
      <VStack spacing={4} align="start">
        {tweets.map((tweet, index) => (
          <TweetCard
            key={index}
            wallet={tweet.wallet}
            content={tweet.content}
            timestamp={tweet.timestamp}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default Feed;
