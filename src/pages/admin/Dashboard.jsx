import React from 'react';
import {
  Box,
  Container, SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs,
} from '@chakra-ui/react';
import Soybean from './Soybean';
import Corn from './Corn';
import FieldsMap from './FieldsMaps';

export default function Dashboard() {
  return (
    <Container maxW="7xl">
      <Tabs isFitted marginTop={10}>
        <TabList>
          <Tab fontWeight="bold">Fields Map</Tab>
          <Tab fontWeight="bold">Fields List</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FieldsMap />
          </TabPanel>
          <TabPanel>
            <SimpleGrid minChildWidth="400px" columns={2} spacing={1}>
              <Box>
                <Soybean />
              </Box>
              <Box>
                <Corn />
              </Box>
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
