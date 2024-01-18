import React from 'react';
import {
  Box,
  Container, SimpleGrid,
} from '@chakra-ui/react';
import SoybeanList from './soybean/SoybeanList';
import CornList from './corn/CornList';

export default function FieldsList() {
  return (
    <Container maxW="100%">
      <SimpleGrid minChildWidth="500px" columns={2} spacing={1}>
        <Box>
          <SoybeanList />
        </Box>
        <Box>
          <CornList />
        </Box>
      </SimpleGrid>
    </Container>
  );
}
