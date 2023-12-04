import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Checkbox,
  Container, HStack, Heading, Image, useDisclosure,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export default function New() {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const shouldShowModal = !dontShowAgain && !localStorage.getItem('dontShowAgain');
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: shouldShowModal });

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('dontShowAgain', 'true');
    }

    onClose();
  };

  return (
    <Container justifyItems="center">
      <Heading textAlign="center" marginTop={10}>Choose a Crop Type:</Heading>

      <HStack marginTop={10} alignContent="center">
        <Box
          as={NavLink}
          to="/admin/new/corn"
          bg="#61b0b7"
          borderRadius="lg"
          padding={10}
          paddingBottom={0}
        >
          <Image
            boxSize="200px"
            src="/img/corn.png"
            alt="Corn"
          />
          <Heading textAlign="center" margin={5} color="white">Corn</Heading>

        </Box>
        <Box
          as={NavLink}
          to="/admin/new/soybean"
          bg="#61b0b7"
          borderRadius="lg"
          padding={10}
          paddingBottom={0}
        >
          <Image
            boxSize="200px"
            src="/img/soybean.png"
            alt="Soybean"
          />

          <Heading textAlign="center" margin={5} color="white">Soybean</Heading>
        </Box>
      </HStack>

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Info
            </AlertDialogHeader>

            <AlertDialogBody>
              If you already have a field from last year, you can use it for this year!
              <br />
              <Checkbox
                marginTop={5}
                isChecked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              >
                Don&lsquo;t show again
              </Checkbox>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button as={NavLink} to="/admin/" onClick={onClose}>
                Go back!
              </Button>
              <Button colorScheme="blue" onClick={handleClose} ml={3}>
                Got it!
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}
