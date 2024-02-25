import React from 'react';

import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  VisuallyHidden,
  HStack,
  Button,
  useDisclosure,
  VStack,
  IconButton,
  CloseButton,
  Image,
} from '@chakra-ui/react';
import { AiOutlineMenu } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import ColorModeSwitcher from './ColorModeSwitcher';

export default function App() {
  const bg = useColorModeValue('white', 'gray.800');
  const mobileNav = useDisclosure();

  return (
    <chakra.header
      bg={bg}
      w="full"
      px={{ base: 2, sm: 4 }}
      py={4}
      shadow="md"
    >
      <Flex alignItems="center" justifyContent="space-between" mx="auto">
        <Flex>
          <chakra.a
            href="/"
            title="Choc Home Page"
            display="flex"
            alignItems="center"
          >
            <Image
              boxSize="20px"
              objectFit="cover"
              src="/logo.png"
              alt="Dan Abramov"
            />
            <VisuallyHidden>CornSoyWater</VisuallyHidden>
          </chakra.a>
          <chakra.h1 as={NavLink} to="/" fontSize="xl" fontWeight="medium" ml="2">
            CornSoyWater
          </chakra.h1>
        </Flex>
        <HStack display="flex" alignItems="center" spacing={1}>
          <HStack
            spacing={1}
            mr={1}
            color="brand.500"
            display={{ base: 'none', md: 'inline-flex' }}
          >
            <Button as={NavLink} to="/about" variant="ghost">About</Button>
            <Button as={NavLink} to="/register" variant="ghost">Sign up</Button>
          </HStack>
          <Button as={NavLink} to="/login" colorScheme="green" size="sm">
            Login
          </Button>
          <ColorModeSwitcher />
          <Box display={{ base: 'inline-flex', md: 'none' }}>
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              aria-label="Open menu"
              fontSize="20px"
              color="gray.800"
              _dark={{ color: 'inherit' }}
              variant="ghost"
              icon={<AiOutlineMenu />}
              onClick={mobileNav.onOpen}
            />

            <VStack
              pos="absolute"
              top={0}
              left={0}
              right={0}
              display={mobileNav.isOpen ? 'flex' : 'none'}
              flexDirection="column"
              p={2}
              pb={4}
              m={2}
              bg={bg}
              spacing={3}
              rounded="sm"
              shadow="sm"
            >
              <CloseButton
                aria-label="Close menu"
                onClick={mobileNav.onClose}
              />
              <Button as={NavLink} to="/about" w="full" variant="ghost">
                About
              </Button>
              <Button as={NavLink} to="/register" w="full" variant="ghost">
                Sign up
              </Button>
            </VStack>
          </Box>
        </HStack>
      </Flex>
    </chakra.header>
  );
}
