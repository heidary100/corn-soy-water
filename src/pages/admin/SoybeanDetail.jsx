import React, { useEffect, useState } from 'react';
import {
  Box, Button, Container,
  Divider,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress, Stack,
  Tab, TabList, TabPanel, TabPanels,
  Table, TableContainer, Tabs, Tbody, Td, Text,
  Th, Thead, Tr, VStack, useToast,
} from '@chakra-ui/react';
import { NavLink, useParams } from 'react-router-dom';
import { MdAdd, MdArrowBack, MdDelete } from 'react-icons/md';
import {
  MapContainer, Marker, Popup, TileLayer,
} from 'react-leaflet';
import MultilineChart from '../../components/admin/MultilineChart';
import Legend from '../../components/admin/Legend';
import SoybeanService from '../../services/soybean.service';
import waterstress from '../../data/waterstress.json';
import availablewater from '../../data/available-water.json';
import AddIrrigation from './AddIrrigation';

const waterStressData = {
  name: 'Crop Water Stress',
  color: 'red',
  items: waterstress.records.records.map((d) => ({ value: d.wstress, date: parseInt(d.date.split('/').join(''), 10) })),
};

const thresholdOfTotalAvailableWaterData = {
  name: 'Threshold of total available soil water for irrigation',
  color: 'purple',
  items: availablewater.records.records.map((d) => ({ value: d.threshold + 1 + (Math.random()), date: parseInt(d.date.split('/').join(''), 10) })),
};

const totalAvailableWaterData = {
  name: 'Total available soil water to maximum rooting depth',
  color: 'brown',
  items: availablewater.records.records.map((d) => ({ value: d.threshold + (Math.random()), date: parseInt(d.date.split('/').join(''), 10) })),
};

const rainfallAmountData = {
  name: 'Rainfall amount (inch)',
  color: 'blue',
  items: availablewater.records.records.map((d) => ({ value: d.threshold + (Math.random()), date: parseInt(d.date.split('/').join(''), 10) })),
};

const irrigationAmountData = {
  name: 'Irrigation amount (inch)',
  color: 'green',
  items: availablewater.records.records.map((d) => ({ value: d.threshold + (Math.random()), date: parseInt(d.date.split('/').join(''), 10) })),
};

const availableWaterOfFirstFootData = {
  name: 'Available water of the first foot of soil',
  color: 'orange',
  items: availablewater.records.records.map((d) => ({ value: d.threshold + (Math.random()), date: parseInt(d.date.split('/').join(''), 10) })),
};

const availableWaterOfSecondFootData = {
  name: 'Available water of the second foot of soil',
  color: 'pink',
  items: availablewater.records.records.map((d) => ({ value: d.threshold + (Math.random()), date: parseInt(d.date.split('/').join(''), 10) })),
};

const availableWaterBelowSecondFootData = {
  name: 'Available water below the second foot of soil',
  color: 'grey',
  items: availablewater.records.records.map((d) => ({ value: d.threshold + (Math.random()), date: parseInt(d.date.split('/').join(''), 10) })),
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
  const legendData = [
    waterStressData,
    thresholdOfTotalAvailableWaterData,
    totalAvailableWaterData,
    rainfallAmountData,
    irrigationAmountData,
    availableWaterOfFirstFootData,
    availableWaterOfSecondFootData,
    availableWaterBelowSecondFootData];
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
      const addedRecord = await SoybeanService.addIrrigationRecord(values, id);
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
      await SoybeanService.deleteIrrigationById(selectedIrrigationRecord.id);
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
    waterStressData,
    ...[thresholdOfTotalAvailableWaterData,
      totalAvailableWaterData,
      rainfallAmountData,
      irrigationAmountData,
      availableWaterOfFirstFootData,
      availableWaterOfSecondFootData,
      availableWaterBelowSecondFootData,
    ].filter((d) => selectedItems.includes(d.name)),
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
          <Tab fontWeight="bold">Result</Tab>
        </TabList>
        <TabPanels>
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
                          center={[parseFloat(fieldInfo.lat), parseFloat(fieldInfo.lng)]}
                          zoom={6}
                          scrollWheelZoom
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
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

                  <Divider />

                  <Stack direction="row" spacing={4} marginTop={10}>
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
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box border={1}>
              <Heading color="green" marginTop={5}>
                No crop water stress is projected for the next 10 days.
              </Heading>
              <Text fontSize="md" marginTop={5}>
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
            <Box p={4}>
              <VStack spacing={4} align="left">
                <Heading as="h3" size="lg" mb={2}>
                  Result Summary
                </Heading>
                <Text fontSize="lg">
                  <strong>Current available water balance within the active rooting zone: </strong>
                  {' '}
                  0
                </Text>
                <Text fontSize="lg">
                  <strong>Initial available water in 0 - 12 inch soil zone at planting: </strong>
                  {' '}
                  2.1
                </Text>
                <Text fontSize="lg">
                  <strong>Total rainfall amount since planting: </strong>
                  {' '}
                  2
                </Text>
                <Text fontSize="lg">
                  <strong>Total irrigation amount: </strong>
                  {' '}
                  12
                </Text>
                <Text fontSize="lg">
                  <strong>Water consumption (i.e., total crop ET) since planting: </strong>
                  {' '}
                  2982
                </Text>
              </VStack>
            </Box>
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
