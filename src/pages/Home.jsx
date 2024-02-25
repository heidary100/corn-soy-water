import React from 'react';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
} from '@chakra-ui/react';

export default function Home() {
  return (
    <Container maxW="3xl">
      <Stack
        as={Box}
        textAlign="center"
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
          lineHeight="110%"
        >
          CornSoyWater
          {' '}
          <br />
          <Text as="span" color="green.400">
            Web Application
          </Text>
        </Heading>
        <Text color="gray.500">
          A web-based irrigation tool for corn and soybean producers in Nebraska
        </Text>
        <Stack
          direction="column"
          spacing={3}
          align="center"
          alignSelf="center"
          position="relative"
        >
          <Button
            as="a"
            href="/login"
            colorScheme="green"
            bg="green.400"
            rounded="full"
            px={6}
            _hover={{
              bg: 'green.500',
            }}
          >
            Sign in
          </Button>
          <Text align="center">
            Don&apos;t have an account?
            {' '}
            <Button as="a" href="/register" variant="link" colorScheme="blue" size="sm">
              Sign up.
            </Button>
          </Text>
        </Stack>
      </Stack>
    </Container>
  );
}
