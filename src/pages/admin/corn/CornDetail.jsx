import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Heading,
  Progress,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useToast,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  StackDivider,
  Grid,
  SimpleGrid,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { MdAdd, MdDelete } from 'react-icons/md';
import {
  LayerGroup,
  LayersControl,
  MapContainer, Marker, Popup, TileLayer,
} from 'react-leaflet';
import waterstress from '../../../data/waterstress.json';
import totalAvailableWater from '../../../data/totalAvailableWater.json';
import availableSoilWater from '../../../data/availableSoilWater.json';
import rainfallAmount from '../../../data/rainfallAmount.json';
import irrigationAmount from '../../../data/irrigationAmount.json';
import MultilineChart from '../../../components/admin/Chart/MultilineChart';
import Legend from '../../../components/admin/Chart/Legend';
import CornService from '../../../services/corn.service';
import 'react-datepicker/dist/react-datepicker.css';
import AddIrrigation from '../AddIrrigation';
import EditCorn from './EditCorn';

const totalAvailableWaterData = {
  name: 'Total available water within active rooting zone',
  type: 'line',
  dashed: false,
  color: '#F17183',
  legendShape: 'line',
  checked: false,
  items: totalAvailableWater
    .records.records.map((d) => ({ value: d.value, date: d.date })),
};

const waterStressData = {
  name: 'Crop Water Stress',
  type: 'line',
  dashed: true,
  color: '#F17183',
  legendShape: 'line',
  checked: true,
  items: waterstress.records.records.map((d) => ({ value: d.value, date: d.date })),
};

const availableSoilWaterData = {
  name: 'Available soil water at a 50% depletion',
  type: 'line',
  dashed: false,
  color: '#E1CF5D',
  legendShape: 'line',
  checked: false,
  items: availableSoilWater
    .records.records.map((d) => ({ value: d.value, date: d.date })),
};

const rainfallAmountData = {
  name: 'Rainfall amount (inch)',
  type: 'bar',
  color: '#6799C4',
  legendShape: 'circle',
  checked: false,
  items: rainfallAmount.records.records.map((d) => ({ value: d.value, date: d.date })),
};

const irrigationAmountData = {
  name: 'Irrigation amount (inch)',
  type: 'bar',
  color: '#80BA70',
  legendShape: 'circle',
  checked: false,
  items: irrigationAmount.records.records.map((d) => ({ value: d.value, date: d.date })),
};

const dimensions = {
  width: 500,
  height: 400,
  margin: {
    top: 30,
    right: 50,
    bottom: 30,
    left: 70,
  },
};

export default function CornDetail() {
  const { id } = useParams();
  const [fieldInfo, setFieldInfo] = useState({});
  const [selectedItems, setSelectedItems] = useState([waterStressData.name]);
  const legendData = [
    totalAvailableWaterData,
    waterStressData,
    availableSoilWaterData,
    rainfallAmountData,
    irrigationAmountData];
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIrrigationRecord, setSelectedIrrigationRecord] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0); // Initial tab index is set to 0

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleIrrigationSubmit = async (values) => {
    setLoading(true);

    try {
      // eslint-disable-next-line no-console
      const addedRecord = await CornService.addIrrigationRecord(values, id);
      // Handle successful submission here
      toast({
        title: 'Added Irrigation record Successfuly.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });

      let irrigations = fieldInfo.irrigations ? fieldInfo.irrigations : [];
      irrigations = [...irrigations, addedRecord];
      setFieldInfo({ ...fieldInfo, irrigations });
    } catch (error) {
      // Handle submission error here
      toast({
        title: 'Failure, Try again.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIrrigation = async () => {
    setIsDeleteModalOpen(false);
    setLoading(true);
    try {
      // eslint-disable-next-line no-console
      await CornService.deleteIrrigationById(fieldInfo.id, selectedIrrigationRecord.id);
      let irrigations = fieldInfo.irrigations ? fieldInfo.irrigations : [];
      irrigations = irrigations.filter((item) => item.id !== selectedIrrigationRecord.id);
      setFieldInfo({ ...fieldInfo, irrigations });

      // Handle successful submission here
      toast({
        title: 'Deleted Irrigation Record Successfuly.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      // Handle submission error here
      toast({
        title: 'Failure, Try again.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData(cornId) {
      const corn = await CornService.getCornById(cornId);
      setFieldInfo(corn);
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
    waterStressData,
    ...[totalAvailableWaterData,
      availableSoilWaterData,
      rainfallAmountData,
      irrigationAmountData,
    ].filter((d) => selectedItems.includes(d.name)),
  ];

  const onChangeSelection = (name) => {
    const newSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];
    setSelectedItems(newSelectedItems);
  };

  return (
    <Container minHeight="100vh" maxW="100%">
      <Heading my={5} fontSize={{ base: 'xl', md: '2xl' }}>Corn Detail</Heading>

      <Tabs onChange={handleTabChange} index={tabIndex} isFitted p={0} m={0}>
        <TabList>
          <Tab fontWeight="bold">Field Information</Tab>
          <Tab fontWeight="bold">Irrigation Records</Tab>
          <Tab fontWeight="bold">Result</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Box p={4}>
              <Progress hidden={!loading} size="xs" isIndeterminate marginTop={10} />
              {!loading && (
                <Box>
                  <SimpleGrid minChildWidth="500px" columns={2} spacing={1}>
                    <Box>
                      {!isEditing && (
                      <SimpleGrid minChildWidth="300px" columns={2} spacing={1}>
                        <VStack spacing={4} align="top">
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
                            {new Date(fieldInfo.plantingDate).toLocaleDateString()}
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
                        <VStack spacing={4} align="top">
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
                      </SimpleGrid>
                      )}
                      {isEditing
                      && (
                      <EditCorn
                        fieldInfo={fieldInfo}
                        onCancel={() => setIsEditing(false)}
                        onSuccess={(newValues) => {
                          setFieldInfo(newValues);
                          setIsEditing(false);
                        }}
                      />
                      )}
                      <Button hidden={isEditing} varient="solid" colorScheme="blue" onClick={() => setIsEditing(true)}>Edit</Button>
                    </Box>
                    <Box height="50vh" marginBottom="10">
                      {tabIndex === 0 && !Number.isNaN(parseFloat(fieldInfo.lat))
                        && !Number.isNaN(parseFloat(fieldInfo.lng))
                        && (
                          <MapContainer
                            center={[parseFloat(fieldInfo.lat), parseFloat(fieldInfo.lng)]}
                            zoom={16}
                            scrollWheelZoom
                          >
                            <LayersControl>
                              <LayersControl.BaseLayer checked name="Satellite">
                                <LayerGroup>
                                  <TileLayer
                                    attribution="Google Maps Satellite"
                                    url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
                                  />
                                  <TileLayer url="https://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}" />
                                </LayerGroup>
                              </LayersControl.BaseLayer>
                              <LayersControl.BaseLayer name="Street View">
                                <TileLayer
                                  attribution="Google Maps"
                                  url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                                />
                              </LayersControl.BaseLayer>

                            </LayersControl>
                            <Marker
                              position={[parseFloat(fieldInfo.lat), parseFloat(fieldInfo.lng)]}
                            >
                              <Popup>
                                {fieldInfo.name}
                              </Popup>
                            </Marker>
                          </MapContainer>
                        )}
                    </Box>
                  </SimpleGrid>
                </Box>
              )}
            </Box>
          </TabPanel>
          <TabPanel p={0}>
            <Box p={2}>
              <Stack direction="row" spacing={4}>
                <Button float="right" leftIcon={<MdAdd />} colorScheme="green" variant="solid" onClick={openModal}>
                  Add new record
                </Button>
              </Stack>
              <AddIrrigation
                onSubmit={handleIrrigationSubmit}
                isOpen={isModalOpen}
                onClose={closeModal}
              />
              <TableContainer marginTop={10}>
                <Progress hidden={!loading} size="xs" isIndeterminate />
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Amount (inches)</Th>
                      <Th>Date</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {fieldInfo.irrigations && fieldInfo.irrigations.map((item) => (
                      <Tr key={item.id}>
                        <Td>{item.amount}</Td>
                        <Td>{new Date(item.date).toLocaleDateString()}</Td>
                        <Td>
                          <Stack direction="row" spacing={1}>
                            <Button
                              onClick={() => {
                                setSelectedIrrigationRecord(item);
                                setIsDeleteModalOpen(true);
                              }}
                              leftIcon={<MdDelete />}
                              colorScheme="red"
                              variant="solid"
                            >
                              Delete
                            </Button>
                          </Stack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

            </Box>
          </TabPanel>
          <TabPanel p={0}>
            <Grid templateColumns={['repeat(8, 1fr)', 'repeat(8, 1fr)', 'repeat(8, 1fr)', 'repeat(12, 1fr)']}>
              <GridItem colSpan={8}>
                <Box border={1} w="fit-content">
                  <Heading fontSize="2xl" fontWeight="semibold" color="red" marginTop={5}>
                    Crop is currently under water stress.
                    Irrigation is recommended if no significant
                    rainfall is expected for the next 3 days.
                  </Heading>
                  <Text fontSize="md" marginTop={5}>
                    Crop water stress scales from 0 to 1,
                    with 0 being no water stress and 1 being severe water stress.
                    When simulated water stress has occurred or is
                    predicted to occur within next three days,
                    irrigation is recommended if no substantial rainfall is forecasted.
                  </Text>
                </Box>
                <br />
                <Box position="relative">
                  <Text h="25" position="absolute" fontWeight="light" left="0" right="0" top="-5" margin="auto" textAlign="center">
                    Estimated soil water status & crop water stress for the field
                    &quot;
                    {fieldInfo.name}
                    &quot;
                  </Text>

                  <Text h="50" position="absolute" fontWeight="light" left="0" top="0" margin="auto" textAlign="center" transform="rotate(-90deg) translateY(-115px) translateX(-165px)">
                    Total soil available water,
                    <br />
                    irrigation amount and rainfall (inch)
                  </Text>

                  <Text h="25" position="absolute" fontWeight="light" right="0" top="0" margin="auto" textAlign="center" transform="rotate(90deg) translateY(-85px) translateX(165px)">
                    Crop water stress (0 to 1)
                  </Text>

                  {tabIndex === 2 && (<MultilineChart data={chartData} dimensions={dimensions} />)}
                  <Legend
                    data={legendData}
                    selectedItems={selectedItems}
                    onChange={onChangeSelection}
                  />
                </Box>
              </GridItem>
              <GridItem colSpan={[12, 12, 12, 4]}>
                <Card bg="rgba(0,0,0,0)" boxShadow="0 0 0">
                  <CardHeader>
                    <Heading size="md">Result Summary</Heading>
                  </CardHeader>

                  <CardBody>
                    <Stack divider={<StackDivider />} spacing="4">
                      <Box>
                        <Heading size="sm" fontWeight="light">
                          Current available water balance within the active rooting zone:
                          <Text fontSize="sm" display="inline-flex" fontWeight="semibold">
                            &nbsp; 0
                          </Text>
                        </Heading>
                      </Box>
                      <Box>
                        <Heading size="sm" fontWeight="light">
                          Initial available water in 0 - 12 inch soil zone at planting:
                          <Text fontSize="sm" display="inline-flex" fontWeight="semibold">
                            &nbsp; 2.1
                          </Text>
                        </Heading>
                      </Box>
                      <Box>
                        <Heading size="sm" fontWeight="light">
                          Total rainfall amount since planting:
                          <Text fontSize="sm" display="inline-flex" fontWeight="semibold">
                            &nbsp; 2
                          </Text>
                        </Heading>
                      </Box>
                      <Box>
                        <Heading size="sm" fontWeight="light">
                          Total irrigation amount:
                          <Text fontSize="sm" display="inline-flex" fontWeight="semibold">
                            &nbsp; 12
                          </Text>
                        </Heading>
                      </Box>
                      <Box>
                        <Heading size="sm" fontWeight="light">
                          Water consumption (i.e., total crop ET) since planting:
                          <Text fontSize="sm" display="inline-flex" fontWeight="semibold">
                            &nbsp; 29
                          </Text>
                        </Heading>
                      </Box>
                    </Stack>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this record?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDeleteIrrigation}>
              Delete
            </Button>
            &nbsp;
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
