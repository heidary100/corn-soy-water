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
  Container, Heading, Image, Progress, SimpleGrid, useDisclosure,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function New() {
  const navigate = useNavigate();
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const shouldShowModal = !dontShowAgain && !localStorage.getItem('dontShowAgain');
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: shouldShowModal });

  localStorage.removeItem('dontShowAgainWS');

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('dontShowAgain', 'true');
    }

    onClose();
  };
  const handleGoBack = () => {
    if (dontShowAgain) {
      localStorage.setItem('dontShowAgain', 'true');
    }

    navigate(-1);
  };

  return (
    <Container justifyItems="center" maxW="100%">
      <Heading my={5} fontSize={{ base: 'xl', md: '2xl' }}>Add New Field</Heading>
      <Box
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        p={3}
      >
        <Progress hasStripe value={25} isAnimated my={3} />
        <Heading w="100%" textAlign="center" fontWeight="normal" my={3} fontSize={{ base: 'xl', md: '2xl' }}>
          Step 1: Select Crop Type
        </Heading>
        <SimpleGrid
          minChildWidth="200px"
          columns={2}
          spacing={1}
          rounded="lg"
          p={3}
        >
          <Box
            textAlign="center"
            as={NavLink}
            to="/admin/new/corn"
            bg="#61b0b7"
            borderRadius="lg"
            padding={10}
            paddingBottom={0}
          >
            <Image
              boxSize="150px"
              src="/img/corn.png"
              alt="Corn"
              margin="0px auto"
            />
            <Heading fontSize="2xl" textAlign="center" margin={5} color="white">Corn</Heading>

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
              boxSize="150px"
              src="/img/soybean.png"
              alt="Soybean"
              margin="0px auto"
            />

            <Heading fontSize="2xl" textAlign="center" margin={5} color="white">Soybean</Heading>
          </Box>
        </SimpleGrid>
      </Box>
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
              <Button onClick={handleGoBack}>
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
