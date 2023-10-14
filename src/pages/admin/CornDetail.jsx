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
import CornService from '../../services/corn.service';

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

export default function CornDetail() {
  const { id } = useParams();
  const [fieldInfo, setFieldInfo] = useState({
    // lat: '40.505664',
    // lng: '-98.966389',
    // name: '',
    // plantingDate: '',
    // relativeMaturity: '',
    // plantPopulation: '',
    // soilRootingDepth: '',
    // soilSurfaceResiduesCoverage: '',
    // topSoilBulkDensity: '',
    // topSoilMoistureAtPlanting: '',
    // subSoilMoistureAtPlanting: '',
    // topSoilTexture: '',
    // subSoilTexture: '',
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const legendData = [portfolioData, schcData, vcitData];
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function fetchData(cornId) {
      const corn = await CornService.getCornById(cornId);
      setFieldInfo(corn);
      console.log(corn);
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
      <Heading marginTop={10}>Corn Detail</Heading>
      <Stack direction="row" spacing={4} marginTop={10}>
        <Button as={NavLink} to="/admin/corn" float="right" leftIcon={<MdArrowBack />} colorScheme="blue" variant="outline">
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
                  <HStack align="top">
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
                        <strong>Relative Group:</strong>
                        {' '}
                        {fieldInfo.relativeMaturity}
                      </Text>
                      <Text fontSize="lg">
                        <strong>Plant Population (x1000/acre):</strong>
                        {' '}
                        {fieldInfo.plantPopulation}
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
                        <strong>Soil Surface Residues Coverage (%):</strong>
                        {' '}
                        {fieldInfo.soilSurfaceResiduesCoverage}
                      </Text>
                      <Text fontSize="lg">
                        <strong>Top Soil Bulk Density:</strong>
                        {' '}
                        {fieldInfo.topSoilBulkDensity}
                      </Text>
                      <Text fontSize="lg">
                        <strong>Top Soil (1 foot) Moisture at Planting:</strong>
                        {' '}
                        {fieldInfo.topSoilMoistureAtPlanting}
                      </Text>
                      <Text fontSize="lg">
                        <strong>Top Soil (1 foot) Moisture at Planting:</strong>
                        {' '}
                        {fieldInfo.topSoilMoistureAtPlanting}
                      </Text>
                      <Text fontSize="lg">
                        <strong>Sub Soil (below 1 foot) Moisture at Planting:</strong>
                        {' '}
                        {fieldInfo.subSoilMoistureAtPlanting}
                      </Text>
                      <Text fontSize="lg">
                        <strong>Top Soil (1 foot) Texture:</strong>
                        {' '}
                        {fieldInfo.topSoilTexture}
                      </Text>
                      <Text fontSize="lg">
                        <strong>Sub Soil (below 1 foot) Texture:</strong>
                        {' '}
                        {fieldInfo.subSoilTexture}
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
