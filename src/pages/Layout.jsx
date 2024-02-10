import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
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
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import { AiOutlineMenu } from 'react-icons/ai';
import ColorModeSwitcher from '../components/ColorModeSwitcher';

// import Nav from '../components/Nav';
// import Footer from '../components/Footer';

function Layout() {
  const bg = useColorModeValue('white', 'gray.800');
  const mobileNav = useDisclosure();
  const [footerHeight, setFooterHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [mainHeight, setMainHeight] = useState(0);
  const headerRef = useRef(null);
  const mainRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    setMainHeight(mainRef.current.offsetHeight);
    setHeaderHeight(headerRef.current.offsetHeight);
    setFooterHeight(footerRef.current.offsetHeight);
    console.log(headerRef.current.offsetHeight, headerRef.current.clientHeight);
  });

  return (
    <ChakraProvider theme={theme}>
      <Box h="100vh" w="100vw" ref={mainRef}>
        <chakra.header
          ref={headerRef}
          // bg={bg}
          w="full"
          px={{ base: 2, sm: 4 }}
          // h="14"
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
                <VisuallyHidden>Corn Soy Water</VisuallyHidden>
              </chakra.a>
              <chakra.h1 as={NavLink} to="/" fontSize="xl" fontWeight="medium" ml="2">
                Corn Soy Water
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

        <Box as="main" h={`${(mainHeight - headerHeight - footerHeight - 20).toString()}px`} mb="5px" overflow="scroll">
          <Outlet />
        </Box>

        <Flex justify="space-between" ref={footerRef}>
          <Box w="16%">
            <NavLink to="https://www.unl.edu/" target="_blank">
              <Image src="/img/footer/logos/University_of_Nebraska–Lincoln.png" />
            </NavLink>
          </Box>
          <Box w="16%">
            <NavLink to="https://ncesr.unl.edu/?page_id=532" target="_blank">
              <Image src="/img/footer/logos/nebraska_weai.png" />
            </NavLink>
          </Box>
          <Box w="16%">
            <NavLink to="https://hprcc.unl.edu/" target="_blank">
              <Image src="/img/footer/logos/HPRCC_Bug_RGB.png" />
            </NavLink>
          </Box>
          <Box w="16%">
            <NavLink to="https://nebraskacorn.gov/" target="_blank">
              <Image src="/img/footer/logos/nebraska_corn_board.png" />
            </NavLink>
          </Box>
          <Box w="16%">
            <NavLink to="https://waterforfood.nebraska.edu/" target="_blank">
              <Image src="/img/footer/logos/water_for_food_Institude.svg" />
            </NavLink>
          </Box>
          <Box w="16%">
            <NavLink to="https://nebraskasoybeans.org/" target="_blank">
              <Image src="/img/footer/logos/nebraska_soybean_board.svg" />
            </NavLink>
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  );
}

export default Layout;
