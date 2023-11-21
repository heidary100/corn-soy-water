import React from 'react';
import {
  Box,
  Container, HStack, Heading, Image,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export default function Dashboard() {
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
    </Container>
  );
}
