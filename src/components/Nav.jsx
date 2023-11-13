import React from 'react';
import {
  Box,
  Flex,
  Button,
  Stack,
  useColorModeValue,
  useBreakpointValue,
  Image,
  Link,
} from '@chakra-ui/react';
import ColorModeSwitcher from './ColorModeSwitcher';

export default function Nav() {
  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH="60px"
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle="solid"
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align="center"
      >
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Image
            boxSize="20px"
            objectFit="cover"
            src="/logo.png"
            alt="Dan Abramov"
          />
          {' '}
          &nbsp;
          <Link
            // as={'a'}
            href="/"
            variant="ghost"
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily="heading"
            color={useColorModeValue('gray.800', 'white')}
          >
            Corn Soy Water
          </Link>

        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify="flex-end"
          direction="row"
          spacing={6}
        >
          <ColorModeSwitcher />
          <Button as="a" fontSize="sm" fontWeight={400} variant="link" href="/login">
            Sign In
          </Button>
          <Button
            as="a"
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize="sm"
            fontWeight={600}
            color="white"
            bg="blue.400"
            href="/register"
            _hover={{
              bg: 'blue.300',
            }}
          >
            Sign Up
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
}
