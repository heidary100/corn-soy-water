import React from 'react';
import {
  Container,
  Flex,
  Image,
  Stack,
  // useColorModeValue,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <Flex
      // bg={useColorModeValue('gray.50', 'gray.900')}
      // color={useColorModeValue('gray.700', 'gray.200')}
      position="absolute"
      bottom={0}
      right={0}
      w="80%"
    >
      <Container
        p="0"
        as={Stack}
        maxW="6xl"
        direction={{ base: 'column', md: 'row' }}
        spacing={1}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Stack alignItems="center" direction="row" spacing={1} margin="0px auto">
          <NavLink to="https://www.unl.edu/" target="_blank">
            <Image boxSize="18vh" objectFit="contain" src="/img/footer/logos/University_of_Nebraska–Lincoln.png" />
          </NavLink>

          <NavLink to="https://ncesr.unl.edu/?page_id=532" target="_blank">
            <Image boxSize="18vh" objectFit="contain" src="/img/footer/logos/nebraska_weai.png" />
          </NavLink>

          <NavLink to="https://hprcc.unl.edu/" target="_blank">
            <Image boxSize="18vh" objectFit="contain" src="/img/footer/logos/HPRCC_Bug_RGB.png" />
          </NavLink>

          <NavLink to="https://nebraskacorn.gov/" target="_blank">
            <Image boxSize="18vh" objectFit="contain" src="/img/footer/logos/nebraska_corn_board.png" />
          </NavLink>

          <NavLink to="https://waterforfood.nebraska.edu/" target="_blank">
            <Image boxSize="18vh" objectFit="contain" src="/img/footer/logos/water_for_food_Institude.svg" />
          </NavLink>

          <NavLink to="https://nebraskasoybeans.org/" target="_blank">
            <Image boxSize="18vh" objectFit="contain" src="/img/footer/logos/nebraska_soybean_board.svg" />
          </NavLink>
        </Stack>
      </Container>
    </Flex>
  );
}
