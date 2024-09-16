import { Box, Text, HStack, VStack, Avatar, Divider } from "@chakra-ui/react";
import moment from "moment";

const TweetCard = ({ wallet, content, timestamp }) => {
  return (
    <Box
      w="full"
      p={4}
      bg="white"
      borderRadius="md"
      shadow="sm"
      border="1px solid #E2E8F0"
      _hover={{ shadow: "md" }}
      mb={4}
    >
      <VStack align="start" spacing={4}>
        {/* Header Section: Avatar, Wallet (Username) and Timestamp */}
        <HStack spacing={4} w="full">
          <Avatar size="md" name={wallet} />
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">{wallet}</Text>
            <Text fontSize="sm" color="gray.500">
              {moment(timestamp).fromNow()}
            </Text>
          </VStack>
        </HStack>

        {/* Content Section: Tweet text */}
        <Text>
          {content}
        </Text>
        
        <Divider />
      </VStack>
    </Box>
  );
};

export default TweetCard;
