import React, { useEffect } from 'react';
import {
  Box, Flex, IconButton, Text, useDisclosure, useMediaQuery,
} from '@chakra-ui/react';
import {
  FiHome, FiMapPin, FiBarChart, FiSettings, FiMenu, FiArrowLeft,
} from 'react-icons/fi';
import NavItem from './NavItem';

export default function Sidebar(props) {
  const sidebar = useDisclosure();
  const [isLargerThanMd] = useMediaQuery('(min-width: 48em)'); // Detect screen size

  useEffect(() => {
    // Set isListMode to false on smaller screens
    if (isLargerThanMd) {
      sidebar.onOpen();
    } else {
      sidebar.onClose();
    }
  }, [isLargerThanMd]);

  return (
    <Box
      as="nav"
      zIndex="sticky"
      h="100vh"
      position="relative"
      pb="10"
      w="fit-content"
      overflowX="hidden"
      overflowY="scroll"
      bg="#61b0b7"
      borderColor="blackAlpha.300"
      borderRightWidth="1px"
      {...props}
    >
      <IconButton
        m="2"
        aria-label="Menu"
        variant="ghost"
        _hover={{
          bg: 'blackAlpha.300',
          color: 'whiteAlpha.700',
        }}
        color="whiteAlpha.900"
        onClick={sidebar.onToggle}
        icon={sidebar.isOpen ? <FiMenu /> : <FiArrowLeft />}
        size="lg"
      />

      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NavItem isListMode={sidebar.isOpen} icon={FiHome} to="/admin/">
          Home
        </NavItem>

        <NavItem isListMode={sidebar.isOpen} icon={FiMapPin} to="/admin/new">
          Add new Field
        </NavItem>

        <NavItem isListMode={sidebar.isOpen} icon={FiBarChart} to="/admin/result">
          Field info and Result
        </NavItem>

        <NavItem isListMode={sidebar.isOpen} icon={FiSettings} to="/admin/profile">
          Setting
        </NavItem>

      </Flex>

      <Text pos="absolute" bottom="5" w="full" textAlign="center" fontWeight="semibold" color="whiteAlpha.900">
        {sidebar.isOpen ? 'Version 1.0' : 'v. 1.0'}
      </Text>
    </Box>
  );
}
