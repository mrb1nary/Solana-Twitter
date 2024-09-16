import {
  VStack,
  HStack,
  IconButton,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea
} from "@chakra-ui/react";
import { FiHome, FiHash, FiMail, FiEdit } from "react-icons/fi";
import { useState } from "react";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react"; // Assuming you're using Solana Wallet Adapter
import { AnchorProvider, Idl, Program, web3 } from "@coral-xyz/anchor";
import idl from '../../../anchor/target/idl/solana_twitter.json'; 
const Sidebar = () => {

  type SolanaWallet = WalletContextState & {
    publicKey: PublicKey;
    signTransaction(tx: web3.Transaction): Promise<web3.Transaction>;
    signAllTransactions(txs: web3.Transaction[]): Promise<web3.Transaction[]>;
  };

  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tweetContent, setTweetContent] = useState("");
  const opts: web3.ConnectionConfig = { commitment: 'processed' };
  const characterLimit = 250;
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
  const program = new Program<Idl>(idl as Idl, provider);

  // Handle tweet content change
  const handleTweetChange = (e) => {
    if (e.target.value.length <= characterLimit) {
      setTweetContent(e.target.value);
    }
  };

  // Function to handle sending the transaction to Solana
  const handlePostTweet = async () => {
    if (!tweetContent.trim()) return;

    try {
      const tweet = web3.Keypair.generate()

      // Send the transaction
      await program.methods
        .sendTweet(tweetContent)
        .accounts({
          tweetAccount: tweet.publicKey,
          sender: wallet.publicKey,
          systemProgram: SystemProgram.programId
        }).signers([tweet])
        .rpc();

      console.log("Tweet posted:", tweetContent);
      setTweetContent(""); // Reset textarea after posting
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error posting tweet:", error);
    }
  };

  // Function to render a sidebar item
  const renderSidebarItem = (icon, label, ariaLabel) => (
    <HStack w="full" spacing={4} alignItems="center">
      <IconButton
        icon={icon}
        aria-label={ariaLabel}
        size="lg"
        variant="solid"
        bg="gray.700"
        color="white"
        _hover={{ bg: "black" }}
        borderRadius="full"
      />
      <Text color="white" fontSize="lg">{label}</Text>
    </HStack>
  );

  return (
    <>
      <VStack
        align="start"
        p={4}
        spacing={8}
        h="100vh"
        w="15%"
        bg="gray.800"
        borderRight="1px solid #E2E8F0"
        position="sticky"
        top={0}
      >
        {renderSidebarItem(<FiHome />, "Home", "Home")}
        {renderSidebarItem(<FiHash />, "Explore", "Explore")}
        {renderSidebarItem(<FiMail />, "Messages", "Messages")}

        {/* New Tweet Button */}
        <Button
          leftIcon={<FiEdit />}
          size="lg"
          bg="blue.500"
          color="white"
          _hover={{ bg: "blue.600" }}
          borderRadius="full"
          w="full"
          onClick={onOpen}
        >
          New Tweet
        </Button>
      </VStack>

      {/* Modal for New Tweet */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New Tweet</ModalHeader>
          <ModalBody>
            <Textarea
              placeholder="What's happening?"
              value={tweetContent}
              onChange={handleTweetChange}
              size="md"
              resize="none"
              maxLength={characterLimit}
            />
            <Text mt={2} fontSize="sm" color="gray.500">
              {tweetContent.length}/{characterLimit} characters
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handlePostTweet}
              isDisabled={!tweetContent.trim()} // Disable button if tweet is empty
            >
              Post
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Sidebar;
