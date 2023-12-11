import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  HStack,
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
} from '@chakra-ui/react';
import { NavLink, useParams } from 'react-router-dom';
import { MdAdd, MdArrowBack, MdDelete } from 'react-icons/md';
import {
  MapContainer, Marker, Popup, TileLayer,
} from 'react-leaflet';
import waterstress from '../../../data/waterstress.json';
import MultilineChart from '../../../components/admin/MultilineChart';
import Legend from '../../../components/admin/Legend';
import CornService from '../../../services/corn.service';
import 'react-datepicker/dist/react-datepicker.css';
import AddIrrigation from '../AddIrrigation';

const totalAvailableWaterData = {
  name: 'Total available water within active rooting zone',
  color: 'turquoise',
  items: waterstress.records.records.map((d) => ({ value: d.value - 1, date: new Date(d.date) })),
};

const waterStressData = {
  name: 'Crop Water Stress',
  color: 'deeppink',
  items: waterstress.records.records.map((d) => ({ value: d.value, date: new Date(d.date) })),
};

const availableSoilWaterData = {
  name: 'Available soil water at a 50% depletion',
  color: 'skyblue',
  items: waterstress.records.records.map((d) => ({ value: d.value + 1, date: new Date(d.date) })),
};

const rainfallAmountData = {
  name: 'Rainfall amount (inch)',
  color: 'blue',
  items: waterstress.records.records.map((d) => ({ value: d.value - 2, date: new Date(d.date) })),
};

const irrigationAmountData = {
  name: 'Irrigation amount (inch)',
  color: 'green',
  items: waterstress.records.records.map((d) => ({ value: d.value - 3, date: new Date(d.date) })),
};

const dimensions = {
  width: 500,
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
  const legendData = [
    totalAvailableWaterData,
    waterStressData,
    availableSoilWaterData,
    rainfallAmountData,
    irrigationAmountData];
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIrrigationRecord, setSelectedIrrigationRecord] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    console.log(name);
    const newSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];
    setSelectedItems(newSelectedItems);
  };

  return (
    <Container minHeight="100vh" maxW="container.lg">
      <Heading marginTop={10}>Corn Detail</Heading>
      <Stack direction="row" spacing={4} marginTop={10}>
        <Button as={NavLink} to="/admin/" float="right" leftIcon={<MdArrowBack />} colorScheme="blue" variant="outline">
          Back to List
        </Button>
      </Stack>
      <Tabs isFitted marginTop={10}>
        <TabList>
          <Tab fontWeight="bold">Irrigation Records</Tab>
          <Tab fontWeight="bold">Field Information</Tab>
          <Tab fontWeight="bold">Result</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box p={4}>
              <Stack direction="row" spacing={4}>
                <Heading float="left" as="h3" size="lg" mb={2}>
                  Irrigation Records
                </Heading>
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
                {fieldInfo.irrigations && (
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Amount</Th>
                        <Th>Date</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {fieldInfo.irrigations && fieldInfo.irrigations.map((item) => (
                        <Tr key={item.id}>
                          <Td>{item.amount}</Td>
                          <Td>{item.date.toString().split('T')[0]}</Td>
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
                )}
              </TableContainer>
              {!fieldInfo.irrigations
                && <Text fontWeight="bold">No irrigation records were found!</Text>}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box p={4}>
              <Progress hidden={!loading} size="xs" isIndeterminate marginTop={10} />
              {!loading && (
                <Box>
                  <Box height="50vh" marginBottom="10">
                    {!Number.isNaN(parseFloat(fieldInfo.lat))
                      && !Number.isNaN(parseFloat(fieldInfo.lng))
                      && (
                        <MapContainer
                          center={[fieldInfo.lat, fieldInfo.lng]}
                          zoom={6}
                          scrollWheelZoom
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker
                            position={[fieldInfo.lat, fieldInfo.lng]}
                          >
                            <Popup>
                              {fieldInfo.name}
                            </Popup>
                          </Marker>
                        </MapContainer>
                      )}
                  </Box>

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
                </Box>
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Grid templateColumns="repeat(12, 1fr)">
              <GridItem colSpan={8}>
                <Box border={1}>
                  <Heading color="green" marginTop={5}>
                    No crop water stress is projected for the next 10 days.
                  </Heading>
                  <Text fontSize="md" marginTop={5}>
                    Crop water stress scales from 0 to 1,
                    with 0 being no water stress and 1 being severe water stress.
                    When simulated water stress has occurred or is
                    predicted to occur within next three days,
                    irrigation is recommended if no substantial rainfall is forecasted.
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
                <Box p={4} position="relative">
                  <Text position="absolute" fontWeight="bold" left="0" right="0" margin="auto" textAlign="center">
                    Estimated soil water status & crop water stress
                  </Text>

                  <Text position="absolute" fontWeight="bold" left="0" top="0" margin="auto" textAlign="center" transform="rotate(-90deg) translateY(-125px) translateX(-165px)">
                    Total soil available water,
                    <br />
                    irrigation amount and rainfall (inch)
                  </Text>

                  <Text position="absolute" fontWeight="bold" right="0" top="0" margin="auto" textAlign="center" transform="rotate(90deg) translateY(-70px) translateX(165px)">
                    Crop water stress (0 to 1)
                  </Text>

                  <MultilineChart data={chartData} dimensions={dimensions} />
                  <Legend
                    data={legendData}
                    selectedItems={selectedItems}
                    onChange={onChangeSelection}
                  />
                </Box>
              </GridItem>
              <GridItem colSpan={4}>
                <Card>
                  <CardHeader>
                    <Heading size="md">Result Summary</Heading>
                  </CardHeader>

                  <CardBody>
                    <Stack divider={<StackDivider />} spacing="4">
                      <Box>
                        <Heading size="xs">
                          Current available water balance within the active rooting zone:
                        </Heading>
                        <Text pt="2" fontSize="sm">
                          0
                        </Text>
                      </Box>
                      <Box>
                        <Heading size="xs">
                          Initial available water in 0 - 12 inch soil zone at planting:
                        </Heading>
                        <Text pt="2" fontSize="sm">
                          2.1
                        </Text>
                      </Box>
                      <Box>
                        <Heading size="xs">
                          Total rainfall amount since planting:
                        </Heading>
                        <Text pt="2" fontSize="sm">
                          2
                        </Text>
                      </Box>
                      <Box>
                        <Heading size="xs">
                          Total irrigation amount:
                        </Heading>
                        <Text pt="2" fontSize="sm">
                          12
                        </Text>
                      </Box>
                      <Box>
                        <Heading size="xs">
                          Water consumption (i.e., total crop ET) since planting:
                        </Heading>
                        <Text pt="2" fontSize="sm">
                          29
                        </Text>
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
