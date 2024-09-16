import { VStack, HStack, IconButton, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea } from "@chakra-ui/react";
import { FiHome, FiHash, FiMail, FiEdit } from "react-icons/fi";
import { useState } from "react";

const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tweetContent, setTweetContent] = useState("");
  const characterLimit = 250;

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

  // Handle tweet content change
  const handleTweetChange = (e) => {
    if (e.target.value.length <= characterLimit) {
      setTweetContent(e.target.value);
    }
  };

  // Handle tweet post (you can implement posting logic here)
  const handlePostTweet = () => {
    console.log("Tweet posted:", tweetContent);
    setTweetContent("");  // Reset the textarea after posting
    onClose();  // Close the modal
  };

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
