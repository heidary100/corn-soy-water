import React from 'react';
import {
  Collapse,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export default function NavItem(props) {
  const {
    icon, image, children, isListMode, ...rest
  } = props;
  return (
    <Flex
      align="center"
      px="4"
      mx="2"
      mb="2"
      rounded="md"
      py="3"
      cursor="pointer"
      color="whiteAlpha.900"
      _hover={{
        bg: 'blackAlpha.300',
        color: 'whiteAlpha.700',
      }}
      w="fit-content"
      role="group"
      as={NavLink}
      fontWeight="semibold"
      transition=".15s ease"
      {...rest}
      style={({ isActive }) => ({
        background: isActive ? 'rgba(0,0,0,0.3)' : '',
        color: isActive ? 'white' : '',
      })}
    >
      {icon && (
        <Icon
          // m="2"
          mr={isListMode ? 2 : 0}
          boxSize="5"
          _groupHover={{
            color: 'gray.300',
          }}
          as={icon}
        />
      )}

      <Collapse in={isListMode}>
        <Text w="40">
          {children}
        </Text>
      </Collapse>
    </Flex>
  );
}
