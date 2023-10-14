import React from 'react';
import {
  Box, Container, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack,
} from '@chakra-ui/react';
import schc from '../../data/SCHC.json';
import vcit from '../../data/VCIT.json';
import portfolio from '../../data/portfolio.json';
import MultilineChart from '../../components/admin/MultilineChart';
import Legend from '../../components/admin/Legend';

const portfolioData = {
  name: 'Total available water within active rooting zone',
  color: 'blue',
  items: portfolio.map((d) => ({ ...d, date: new Date(d.date) })),
};
const schcData = {
  name: 'Available soil water at a 50% depletion',
  color: '#d53e4f',
  items: schc.map((d) => ({ ...d, date: new Date(d.date) })),
};
const vcitData = {
  name: 'Crop water stress',
  color: '#d568fb',
  items: vcit.map((d) => ({ ...d, date: new Date(d.date) })),
};

const dimensions = {
  width: 600,
  height: 300,
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60,
  },
};

export default function SoybeanDetail() {
  const [selectedItems, setSelectedItems] = React.useState([]);
  const legendData = [portfolioData, schcData, vcitData];
  const chartData = [
    portfolioData,
    ...[schcData, vcitData].filter((d) => selectedItems.includes(d.name)),
  ];

  const onChangeSelection = (name) => {
    const newSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];
    setSelectedItems(newSelectedItems);
  };

  const fieldInfo = {
    name: 'name of crop',
    location: 'xx',
    cropManagement: 'xx',
    plantingDate: '2023/01/01',
    maturityGroup: 4.5,
    soilRootingDepth: 21,
    availableSoilWater: 50,
    soilTexture: 'Automatic',
    averageSoilTexture: 'eh',
  };

  return (
    <Container minHeight="100vh" maxW="container.lg">
      <Heading marginTop={10}>Soybean Detail</Heading>
      <br />
      <Tabs isFitted>
        <TabList>
          <Tab>Field Information</Tab>
          <Tab>Result Summary</Tab>
          <Tab>Insights</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box p={4}>
              <Heading as="h3" size="xl" mb={4}>
                Crop Management:
              </Heading>
              <VStack spacing={4} align="left">
                <Text fontSize="lg">
                  <strong>Name: </strong>
                  {fieldInfo.name}
                </Text>
                <Text fontSize="lg">
                  <strong>Planting Date: </strong>
                  {fieldInfo.plantingDate}
                </Text>
                <Text fontSize="lg">
                  <strong>Maturity Group: </strong>
                  {fieldInfo.maturityGroup}
                </Text>
                <Heading as="h3" size="xl" mb={4}>
                  Soil Properties:
                </Heading>
                <Text fontSize="lg">
                  <strong>Soil Rooting Depth: </strong>
                  {fieldInfo.soilRootingDepth}
                  &nbsp;inches
                </Text>
                <Text fontSize="lg">
                  <strong>Available Soil Water at Planting Day: </strong>
                  {fieldInfo.availableSoilWater}
                  %
                </Text>
                <Text fontSize="lg">
                  <strong>Soil Texture: </strong>
                  {fieldInfo.soilTexture}
                </Text>
                <Text fontSize="lg">
                  <strong>Average Soil Texture to the Rooting Depth: </strong>
                  {fieldInfo.averageSoilTexture}
                </Text>
              </VStack>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p={4}>
              <VStack spacing={4} align="left">
                <Text fontSize="lg">
                  <strong>Current available water balance within the active rooting zone: </strong>
                  0
                </Text>
                <Text fontSize="lg">
                  <strong>Initial available water in 0 - 12 inch soil zone at planting: </strong>
                  2.1
                </Text>
                <Text fontSize="lg">
                  <strong>Total rainfall amount since planting: </strong>
                  2
                </Text>
                <Text fontSize="lg">
                  <strong>Total irrigation amount: </strong>
                  12
                </Text>
                <Text fontSize="lg">
                  <strong>Water consumption (i.e., total crop ET) since planting: </strong>
                  2982
                </Text>
              </VStack>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box border={1}>
              <Heading as="h5" color="green">
                No crop water stress is projected for the next 10 days.
              </Heading>
              <Text fontSize="lg">
                Irrigation should be commenced THREE DAYS BEFORE the day when the chart
                crop water stress dashed line moves up from zero.
                Crop water stress (red solid/dashed chart line) can vary
                from 0 (no stress) to 1 (severe stress).
              </Text>
              {/* <Heading as="h5" color="red">
                Crop is currently under water stress.
                Irrigation is recommended if no significant
                rainfall is expected for the next 3 days.
              </Heading>
              Crop water stress scales from 0 to 1,
              with O being no water stress and 1 being severe water stress.
              When simulated water stress has occurred or is predicted
              to occur within next three days, irrigation is recommended
              if no substantial rainfall is forecasted. */}
            </Box>
            <br />
            <Box p={4}>
              <MultilineChart data={chartData} dimensions={dimensions} />
              <Legend
                data={legendData}
                selectedItems={selectedItems}
                onChange={onChangeSelection}
              />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
