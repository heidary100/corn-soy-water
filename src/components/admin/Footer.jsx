import React from 'react';
import {
  Box,
  Container,
  Image,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container
        as={Stack}
        maxW="6xl"
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={1}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Stack direction="row" spacing={6}>
          <Image src="/img/footer/unl.png" />
          <Image src="/img/footer/weai.jpg" />
          <Image src="/img/footer/hprcc.jpg" />
          <Image src="/img/footer/cornboard.jpg" />
          <Image src="/img/footer/waterforfood.jpg" />
          <Image src="/img/footer/soyboard.jpg" />
        </Stack>
      </Container>
    </Box>
  );
}
