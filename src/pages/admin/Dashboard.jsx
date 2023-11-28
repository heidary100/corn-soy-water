import React from 'react';
import {
  Box,
  Container, SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs,
} from '@chakra-ui/react';
import SoybeanList from './soybean/SoybeanList';
import CornList from './corn/CornList';
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
                <SoybeanList />
              </Box>
              <Box>
                <CornList />
              </Box>
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
