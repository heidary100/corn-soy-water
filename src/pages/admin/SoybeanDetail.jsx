import React, { useEffect, useState } from 'react';
import {
  Box, Button, Container,
  HStack,
  Heading, Progress, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack, useToast,
} from '@chakra-ui/react';
import { NavLink, useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import {
  MapContainer, Marker, Popup, TileLayer,
} from 'react-leaflet';
import schc from '../../data/SCHC.json';
import vcit from '../../data/VCIT.json';
import portfolio from '../../data/portfolio.json';
import MultilineChart from '../../components/admin/MultilineChart';
import Legend from '../../components/admin/Legend';
import SoybeanService from '../../services/soybean.service';

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
  width: 800,
  height: 300,
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60,
  },
};
// [Log] Object (main.5d97ed8e880d9cf27c95.hot-update.js, line 113)

// availableSoilWater: "25"

// averageSoilTexture: "11"

// id: 8832

// lat: 26.714667780379038

// lng: -81.07910156250001

// maturityGroup: "4.4"

// name: "Field 1"

// plantingDate: Tue Oct 17 2023 00:00:00 GMT+0330 (Iran Standard Time)

// soilRootingDepth: "45"

// Object Prototype

export default function SoybeanDetail() {
  const { id } = useParams();
  const [fieldInfo, setFieldInfo] = useState({
    // lat
    // lng
    // name: 'name of crop',
    // location: 'xx',
    // cropManagement: 'xx',
    // plantingDate: '2023/01/01',
    // maturityGroup: 4.5,
    // soilRootingDepth: 21,
    // availableSoilWater: 50,
    // averageSoilTexture: 'eh',
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const legendData = [portfolioData, schcData, vcitData];
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function fetchData(soybeanId) {
      const soybean = await SoybeanService.getSoybeanById(soybeanId);
      setFieldInfo(soybean);
      console.log(soybean);
      setLoading(false);
    }

    if (id !== undefined) {
      setLoading(true);
      try {
        fetchData(id);
      } catch (error) {
        // Handle submission error here
        toast({
          title: 'Failed to load data, Try again.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }, []);

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

  return (
    <Container minHeight="100vh" maxW="container.lg">
      <Heading marginTop={10}>Soybean Detail</Heading>
      <Stack direction="row" spacing={4} marginTop={10}>
        <Button as={NavLink} to="/admin/soybean" float="right" leftIcon={<MdArrowBack />} colorScheme="blue" variant="outline">
          Back to List
        </Button>
      </Stack>
      <Tabs isFitted marginTop={10}>
        <TabList>
          <Tab fontWeight="bold">Field Information</Tab>
          <Tab fontWeight="bold">Result Summary</Tab>
          <Tab fontWeight="bold">Insights</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box p={4}>
              <Progress hidden={!loading} size="xs" isIndeterminate marginTop={10} />
              {!loading && (
                <Box>
                  <HStack>
                    <VStack spacing={4} align="left" padding={3}>
                      <Heading as="h3" size="lg" mb={2}>
                        Crop Management
                      </Heading>
                      <Text fontSize="lg">
                        <strong>Name:</strong>
                        {' '}
                        {fieldInfo.name}
                      </Text>
                      <Text fontSize="lg">
                        <strong>Planting Date:</strong>
                        {' '}
                        {(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(fieldInfo.plantingDate)
                        )}
                      </Text>
                      <Text fontSize="lg">
                        <strong>Maturity Group:</strong>
                        {' '}
                        {fieldInfo.maturityGroup}
                      </Text>
                    </VStack>
                    <VStack spacing={4} align="left" padding={3}>
                      <Heading as="h3" size="lg" mb={2}>
                        Soil Properties
                      </Heading>
                      <Text fontSize="lg">
                        <strong>Soil Rooting Depth:</strong>
                        {' '}
                        {fieldInfo.soilRootingDepth}
                        {' '}
                        inches
                      </Text>
                      <Text fontSize="lg">
                        <strong>Available Soil Water at Planting Day:</strong>
                        {' '}
                        {fieldInfo.availableSoilWater}
                        %
                      </Text>
                      <Text fontSize="lg">
                        <strong>Average Soil Texture to the Rooting Depth:</strong>
                        {' '}
                        {fieldInfo.averageSoilTexture}
                      </Text>
                    </VStack>
                  </HStack>

                  <Box height="50vh" marginTop="10">
                    {!Number.isNaN(parseFloat(fieldInfo.lat))
                    && !Number.isNaN(parseFloat(fieldInfo.lng))
                    && (
                    <MapContainer
                      center={[parseFloat(fieldInfo.lat), parseFloat(fieldInfo.lng)]}
                      zoom={6}
                      scrollWheelZoom
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[fieldInfo.lat, fieldInfo.lng]} />
                      <Marker
                        position={[fieldInfo.lat, fieldInfo.lng]}
                        eventHandlers={{
                          mouseover: (event) => event.target.openPopup(),
                        }}
                      >
                        <Popup>
                          {fieldInfo.name}
                        </Popup>
                      </Marker>
                    </MapContainer>
                    )}
                  </Box>
                </Box>
              )}
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
