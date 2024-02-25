import React from 'react';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Flex,
  Image,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

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
        </Heading>
        <Text fontSize={25} color="gray.600">
          An irrigation tool for Corn and Soybean producers
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
          <Flex justify="space-between" mt={20}>
            <Box w="16%">
              <NavLink to="https://www.unl.edu/" target="_blank">
                <Image src="/img/footer/logos/nebraska.png" />
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
        </Stack>
      </Stack>
    </Container>
  );
}
