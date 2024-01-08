import React, { useEffect, useState } from 'react';
import {
  Container,
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  RadioGroup,
  Radio,
  useToast,
  Tooltip,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from '@chakra-ui/react';
import {
  MapContainer, TileLayer, useMapEvents, Marker,
} from 'react-leaflet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import { InfoIcon } from '@chakra-ui/icons';
import SoybeanService from '../../../services/soybean.service';
import 'react-datepicker/dist/react-datepicker.css';
import LeafletgeoSearch from '../../../components/LeafletgeoSearch';

function LocationFinderDummy({ onClick }) {
  // eslint-disable-next-line no-unused-vars
  const map = useMapEvents({
    click(e) {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

const form1ValidationSchema = Yup.object().shape({
});

const form2ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required'),
  plantingDate: Yup.date()
    .required('Planting date is required'),
  maturityGroup: Yup.number()
    .required('Maturity Group is required')
    .min(1, 'Maturity Group should be more than 1')
    .max(4.5, 'Maturity Group should be less than 4.5'),
});

const form3ValidationSchema = Yup.object().shape({
  soilRootingDepth: Yup.number()
    .required('Soil Rooting Depth is required')
    .min(20, 'Soil Rooting Depth should be more than 20')
    .max(50, 'Soil Rooting Depth should be less than 50'),
  availableSoilWater: Yup.number()
    .required('Average Soil Water is required')
    .min(0, 'Average Soil Water should be more than 0')
    .max(100, 'Average Soil Water should be less than 100'),
  averageSoilTexture: Yup.string()
    .required('Average Soil Texture is required'),
});

export default function AddSoybean({ edit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);
  const [soilTexture, setSoilTexture] = useState('automatic');
  const [loading, setLoading] = useState(false);
  const { onOpen, isOpen, onClose } = useDisclosure();

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      // eslint-disable-next-line no-console
      if (edit === true) {
        await SoybeanService.updateSoybean(id, values);
        // Handle successful submission here
        toast({
          title: 'Updated Soybean Field Successfuly.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      } else {
        const savedSoybean = await SoybeanService.createSoybean(values);
        // Handle successful submission here
        toast({
          title: 'Created Soybean Field Successfuly.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        navigate(`/admin/result/soybean/${savedSoybean.id}`);
      }
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

  const formik = useFormik({
    initialValues: {
      lat: '40.505664',
      lng: '-98.966389',
      name: '',
      plantingDate: '',
      maturityGroup: '',
      soilRootingDepth: '',
      availableSoilWater: '',
      averageSoilTexture: '',
    },
    // eslint-disable-next-line max-len, no-nested-ternary
    validationSchema: step === 1 ? form1ValidationSchema : step === 2 ? form2ValidationSchema : form3ValidationSchema,
    onSubmit: (values) => {
      if (step === 3) {
        handleSubmit(values);
      } else {
        setStep(step + 1);
        setProgress(progress + 33.33);
      }
    },
  });

  useEffect(() => {
    async function fetchData(soybeanId) {
      const soybean = await SoybeanService.getSoybeanById(soybeanId);
      formik.setValues(soybean);
      setLoading(false);
    }

    if (edit === true && id !== undefined) {
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

  const currentForm = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={formik.handleSubmit}>
            <Heading w="100%" textAlign="center" fontWeight="normal" mb="2%">
              Step 1: Choose Location
            </Heading>
            <Box height="50vh" marginTop="10">
              <MapContainer
                center={[formik.values.lat, formik.values.lng]}
                zoom={4}
                scrollWheelZoom
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[formik.values.lat, formik.values.lng]} />
                <LocationFinderDummy
                  onClick={(point) => {
                    formik.setValues({ ...formik.values, ...point });
                    onOpen();
                  }}
                />
                <LeafletgeoSearch />
              </MapContainer>
            </Box>

            <ButtonGroup mt="5%" w="100%">
              <Flex w="100%" justifyContent="space-between">
                <Flex>
                  <Button
                    onClick={() => {
                      setStep(step - 1);
                      setProgress(progress - 33.33);
                    }}
                    isDisabled={step === 1}
                    colorScheme="blue"
                    variant="solid"
                    w="7rem"
                    mr="5%"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    w="7rem"
                    colorScheme="blue"
                    variant="outline"
                  >
                    Next
                  </Button>
                </Flex>
              </Flex>
            </ButtonGroup>
            <AlertDialog
              isOpen={isOpen}
              onClose={onClose}
              isCentered
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Warning
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Your field is 43 miles away from the nearest weather station.
                    The result of the program may not accurately represent your field.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button colorScheme="green" onClick={onClose} ml={3}>
                      Proceed
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </form>
        );

      case 2:
        return (
          <form onSubmit={formik.handleSubmit}>
            <Heading w="100%" textAlign="center" fontWeight="normal" mb="2%">
              Step 2: Crop Management Info
            </Heading>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="name"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Name
                <Tooltip label="enter your Name" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>
              <Input
                type="text"
                name="name"
                id="name"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <Text color="red">{formik.errors.name}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="plantingDate"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Date of Planting
                <Tooltip label="enter your Date of Planting" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>
              <DatePicker
                name="plantingDate"
                id="plantingDate"
                onChange={(value) => formik.setFieldValue('plantingDate', value)}
                selected={formik.values.plantingDate}
                onBlur={formik.handleBlur}
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                showIcon
                dateFormat="MM/dd/yyyy"
              />
              {formik.touched.plantingDate && formik.errors.plantingDate && (
                <Text color="red">{formik.errors.plantingDate}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="maturityGroup"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Maturity Group
                <Tooltip label="enter your Maturity Group" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>
              <Select
                id="maturityGroup"
                name="maturityGroup"
                placeholder="Select one"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.maturityGroup}
              >
                <option value="1">1</option>
                <option value="1.1">1.1</option>
                <option value="1.2">1.2</option>
                <option value="1.3">1.3</option>
                <option value="1.4">1.4</option>
                <option value="1.5">1.5</option>
                <option value="1.6">1.6</option>
                <option value="1.7">1.7</option>
                <option value="1.8">1.8</option>
                <option value="1.9">1.9</option>
                <option value="2">2</option>
                <option value="2.1">2.1</option>
                <option value="2.2">2.2</option>
                <option value="2.3">2.3</option>
                <option value="2.4">2.4</option>
                <option value="2.5">2.5</option>
                <option value="2.6">2.6</option>
                <option value="2.7">2.7</option>
                <option value="2.8">2.8</option>
                <option value="2.9">2.9</option>
                <option value="3">3</option>
                <option value="3.1">3.1</option>
                <option value="3.2">3.2</option>
                <option value="3.3">3.3</option>
                <option value="3.4">3.4</option>
                <option value="3.5">3.5</option>
                <option value="3.6">3.6</option>
                <option value="3.7">3.7</option>
                <option value="3.8">3.8</option>
                <option value="3.9">3.9</option>
                <option value="4">4</option>
                <option value="4.1">4.1</option>
                <option value="4.2">4.2</option>
                <option value="4.3">4.3</option>
                <option value="4.4">4.4</option>
                <option value="4.5">4.5</option>
              </Select>
              {formik.touched.maturityGroup && formik.errors.maturityGroup && (
                <Text color="red">{formik.errors.maturityGroup}</Text>
              )}
            </FormControl>

            <ButtonGroup mt="5%" w="100%">
              <Flex w="100%" justifyContent="space-between">
                <Flex>
                  <Button
                    onClick={() => {
                      setStep(step - 1);
                      setProgress(progress - 33.33);
                    }}
                    isDisabled={step === 1}
                    colorScheme="blue"
                    variant="solid"
                    w="7rem"
                    mr="5%"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    w="7rem"
                    colorScheme="blue"
                    variant="outline"
                  >
                    Next
                  </Button>
                </Flex>
              </Flex>
            </ButtonGroup>
          </form>
        );

      case 3:
        return (
          <form onSubmit={formik.handleSubmit}>
            <Heading w="100%" textAlign="center" fontWeight="normal">
              Step 3: Soil Properties
            </Heading>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="soilRootingDepth"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Soil Rooting Depth (inch)
                <Tooltip label="enter your Soil Rooting Depth (inch)" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>
              <Select
                id="soilRootingDepth"
                name="soilRootingDepth"
                placeholder="Select one"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.soilRootingDepth}
              >
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
                <option value="32">32</option>
                <option value="33">33</option>
                <option value="34">34</option>
                <option value="35">35</option>
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42">42</option>
                <option value="43">43</option>
                <option value="44">44</option>
                <option value="45">45</option>
                <option value="46">46</option>
                <option value="47">47</option>
                <option value="48">48</option>
                <option value="49">49</option>
                <option value="50">50</option>
              </Select>
              {formik.touched.soilRootingDepth && formik.errors.soilRootingDepth && (
                <Text color="red">{formik.errors.soilRootingDepth}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="availableSoilWater"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Available soil water at planting day (%)
                <Tooltip label="enter your Available soil water at planting day (%)" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>
              <Select
                id="availableSoilWater"
                name="availableSoilWater"
                placeholder="Select one"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.availableSoilWater}
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="75">75</option>
                <option value="100">100</option>
              </Select>
              {formik.touched.availableSoilWater && formik.errors.availableSoilWater && (
                <Text color="red">{formik.errors.availableSoilWater}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="soilTexture"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Soil Texture
                <Tooltip label="enter your Soil Texture" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>

              <RadioGroup id="soilTexture" onChange={setSoilTexture} value={soilTexture}>
                <Stack direction="row">
                  <Radio value="automatic">Automatic</Radio>
                  <Radio value="manual">Manual</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="averageSoilTexture"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Average soil texture to the rooting depth
                <Tooltip label="enter your Average soil texture to the rooting depth" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>

              <Select
                id="averageSoilTexture"
                name="averageSoilTexture"
                placeholder="Select option"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.averageSoilTexture}
                disabled={soilTexture === 'automatic'}
              >
                <option value="1">Clay</option>
                <option value="2">Clay loam</option>
                <option value="6">Loam</option>
                <option value="9">Loamy sand</option>
                <option value="11">Sand</option>
                <option value="12">Sand clay</option>
                <option value="13">Sandy clay loam</option>
                <option value="14">Sandy loam</option>
                <option value="15">Silt</option>
                <option value="16">Silt loam</option>
                <option value="17">Silty clay</option>
                <option value="18">Silty clay loam</option>
              </Select>
              {formik.touched.averageSoilTexture && formik.errors.averageSoilTexture && (
                <Text color="red">{formik.errors.averageSoilTexture}</Text>
              )}
            </FormControl>

            <ButtonGroup mt="5%" w="100%">
              <Flex w="100%" justifyContent="space-between">
                <Flex>
                  <Button
                    onClick={() => {
                      setStep(step - 1);
                      setProgress(progress - 33.33);
                    }}
                    isDisabled={step === 1}
                    colorScheme="blue"
                    variant="solid"
                    w="7rem"
                    mr="5%"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    w="7rem"
                    isDisabled={step === 3}
                    colorScheme="blue"
                    variant="outline"
                  >
                    Next
                  </Button>
                </Flex>
                <Button
                  type="submit"
                  w="7rem"
                  colorScheme="green"
                  variant="solid"
                  isLoading={loading}
                  loadingText="Submitting"
                >
                  Submit
                </Button>
              </Flex>
            </ButtonGroup>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <Container minHeight="100vh" maxW="container.lg">
      <Heading marginTop={10}>
        {edit === true ? 'Edit Soybean Field' : 'Add Soybean Field'}
      </Heading>
      <Stack direction="row" spacing={4} marginTop={10}>
        {edit === true ? (
          <Button as={NavLink} to="/admin/" float="right" leftIcon={<MdArrowBack />} colorScheme="blue" variant="outline">
            Back to List
          </Button>
        )
          : (
            <Button as={NavLink} to="/admin/new" float="right" leftIcon={<MdArrowBack />} colorScheme="blue" variant="outline">
              Select Crop Type
            </Button>
          )}
      </Stack>
      <Progress hidden={!loading} size="xs" isIndeterminate marginTop={10} />
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        p={6}
        m="10px auto"
        marginTop={10}
        disabled={loading}
      >
        <Progress hasStripe value={progress} mb="5%" mx="5%" isAnimated />
        {currentForm()}
      </Box>
    </Container>
  );
}
