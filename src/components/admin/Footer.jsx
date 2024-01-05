import React from 'react';
import {
  Container,
  Flex,
  Image,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <Flex
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
        <Stack alignItems="center" direction="row" spacing={1}>
          <NavLink to="https://www.unl.edu/" target="_blank">
            <Image src="/img/footer/unl.png" />
          </NavLink>

          <NavLink to="https://ncesr.unl.edu/?page_id=532" target="_blank">
            <Image src="/img/footer/weai.jpg" />
          </NavLink>

          <NavLink to="https://hprcc.unl.edu/" target="_blank">
            <Image src="/img/footer/hprcc.jpg" />
          </NavLink>

          <NavLink to="https://nebraskacorn.gov/" target="_blank">
            <Image src="/img/footer/cornboard.jpg" />
          </NavLink>

          <NavLink to="https://waterforfood.nebraska.edu/" target="_blank">
            <Image src="/img/footer/waterforfood.jpg" />
          </NavLink>

          <NavLink to="https://nebraskasoybeans.org/" target="_blank">
            <Image src="/img/footer/soyboard.jpg" />
          </NavLink>

        </Stack>
      </Container>
    </Flex>
  );
}
