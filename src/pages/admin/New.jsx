import React from 'react';
import {
  Box,
  Container, Heading, Image, SimpleGrid,
} from '@chakra-ui/react';

export default function Dashboard() {
  return (
    <Container maxW="7xl">
      <Heading marginTop={10}>Choose a crop type:</Heading>

      <SimpleGrid columns={2} spacing={1}>
        <Box>
          <Image
            boxSize="200px"
            src="/img/corn.png"
            alt="Dan Abramov"
          />
        </Box>
        <Box>
          <Image
            boxSize="200px"
            src="/img/soybean.png"
            alt="Dan Abramov"
          />
        </Box>
      </SimpleGrid>
    </Container>
  );
}
