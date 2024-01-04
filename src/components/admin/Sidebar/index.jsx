import React from 'react';
import {
  Box, Flex, IconButton,
} from '@chakra-ui/react';
import {
  FiHome, FiMapPin, FiBarChart, FiSettings, FiMenu, FiArrowLeft,
} from 'react-icons/fi';
import NavItem from './NavItem';

export default function Sidebar(props) {
  const { onToggle, isListMode } = props;
  return (
    <Box
      as="nav"
      // pos="fixed"
      // top="0"
      // left="0"
      zIndex="sticky"
      minH="100vh"
      pb="10"
      w="fit-content"
      overflowX="hidden"
      overflowY="auto"
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
        // display={{ base: 'inline-flex', md: 'none' }}
        // onClick={sidebar.onOpen}
        onClick={onToggle}
        // icon={<FiMenu />}
        icon={isListMode ? <FiMenu /> : <FiArrowLeft />}
        size="lg"
      />

      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NavItem isListMode={isListMode} icon={FiHome} to="/admin/">
          Home
        </NavItem>

        <NavItem isListMode={isListMode} icon={FiMapPin} to="/admin/new">
          Add new Field
        </NavItem>

        <NavItem isListMode={isListMode} icon={FiBarChart} to="/admin/result">
          Field info and Result
        </NavItem>

        <NavItem isListMode={isListMode} icon={FiSettings} to="/admin/profile">
          Setting
        </NavItem>

      </Flex>
    </Box>
  );
}
