import React, {
  useRef, useState,
} from 'react';
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
  Avatar,
  Checkbox,
} from '@chakra-ui/react';
import {
  MapContainer, TileLayer, Marker, LayersControl, LayerGroup,
} from 'react-leaflet';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import { InfoIcon } from '@chakra-ui/icons';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import SoybeanService from '../../../services/soybean.service';
import 'react-datepicker/dist/react-datepicker.css';
import LeafletgeoSearch from '../../../components/LeafletgeoSearch';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'react-leaflet-fullscreen/styles.css';
import WeatherStations from '../../../components/admin/WeatherStations';
import { soybeanIcon } from '../../../components/admin/MarkerIcons';
import DrawTools from '../../../components/admin/DrawTools';

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

export default function AddSoybean() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(50);
  const [soilTexture, setSoilTexture] = useState('automatic');
  const [loading, setLoading] = useState(false);
  const [showWS, setShowWS] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const shapeRef = useRef(null);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('dontShowAgainWS', 'true');
    }

    onClose();
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const savedSoybean = await SoybeanService.createSoybean({
        ...values, shape: JSON.stringify(shapeRef.current),
      });
      // Handle successful submission here
      toast({
        title: 'Created Soybean Field Successfuly.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      navigate(`/admin/result/soybean/${savedSoybean.id}`);
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
      lat: '',
      lng: '',
      name: '',
      plantingDate: '',
      maturityGroup: '',
      soilRootingDepth: '',
      availableSoilWater: '',
      averageSoilTexture: '1',
    },
    // eslint-disable-next-line max-len, no-nested-ternary
    validationSchema: step === 1 ? form1ValidationSchema : step === 2 ? form2ValidationSchema : form3ValidationSchema,
    onSubmit: (values) => {
      if (step === 1 && (shapeRef.current === null || formik.values.lat === '' || formik.values.lng === '')) {
        toast({
          title: 'Please draw shape!',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      } else if (step === 3) {
        handleSubmit(values);
      } else {
        setStep(step + 1);
        setProgress(progress + 25);
      }
    },
  });

  const onUpdateShape = ({ shape, lat, lng }) => {
    if (shape !== null && !dontShowAgain && !localStorage.getItem('dontShowAgainWS')) {
      onOpen();
    }
    shapeRef.current = shape;
    formik.setFieldValue('lat', lat === null ? '' : lat);
    formik.setFieldValue('lng', lng === null ? '' : lng);
  };

  const currentForm = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={formik.handleSubmit}>
            <Heading w="100%" textAlign="center" fontWeight="normal" my={3} fontSize={{ base: 'xl', md: '2xl' }}>
              Step 2: Choose Location
            </Heading>
            <Box height="50vh" position="relative">
              <MapContainer
                center={
                  (formik.values.lat === '' && formik.values.lng === '') ? ['40.505664', '-98.966389']
                    : [parseFloat(formik.values.lat), parseFloat(formik.values.lng)]
                }
                zoom={8}
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
                    <LayersControl.BaseLayer name="Street View">
                      <TileLayer
                        attribution="Google Maps"
                        url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                      />
                    </LayersControl.BaseLayer>

                  </LayersControl.BaseLayer>
                </LayersControl>
                {showWS && <WeatherStations />}
                <Marker
                  icon={soybeanIcon}
                  position={
                    (formik.values.lat === '' && formik.values.lng === '') ? ['', '']
                      : [parseFloat(formik.values.lat), parseFloat(formik.values.lng)]
                  }
                />

                <LeafletgeoSearch />
                {step === 1 && <DrawTools updateShape={onUpdateShape} shape={shapeRef.current} />}
                <FullscreenControl
                  position="topleft"
                />
              </MapContainer>
              <Button
                p={0}
                pos="absolute"
                top="110"
                left="11px"
                zIndex={10000}
                onClick={() => {
                  setShowWS(!showWS);
                }}
                size="sm"
              >
                <Text style={{ pointerEvents: 'none' }}>
                  <Avatar p={0} borderRadius={0} boxSize="5" name="ws" src={showWS ? '/img/climatology.png' : '/img/climatology-off.png'} />
                </Text>
              </Button>

            </Box>

            <ButtonGroup mt={5} w="100%">
              <Flex w="100%" justifyContent="space-between">
                <Flex>
                  <Button
                    as={NavLink}
                    to="/admin/new"
                    colorScheme="blue"
                    variant="solid"
                    w="7rem"
                    mr="5%"
                  >
                    Back
                  </Button>
                </Flex>
                <Button
                  type="submit"
                  w="7rem"
                  colorScheme="blue"
                  variant="outline"
                >
                  Next
                </Button>

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
                    <br />
                    <Checkbox
                      marginTop={5}
                      isChecked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                    >
                      Don&lsquo;t show again
                    </Checkbox>
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button colorScheme="green" onClick={handleClose} ml={3}>
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
            <Heading w="100%" textAlign="center" fontWeight="normal" my={3} fontSize={{ base: 'xl', md: '2xl' }}>
              Step 3: Crop Information
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
                Field Name
                <Tooltip label="Enter Field's Name" fontSize="md">
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
                <Tooltip label="Enter Planting Date" fontSize="md">
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
                placeholderText="MM/dd/yyyy"
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
                <Tooltip label="Enter Maturity Group" fontSize="md">
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
                <option value="1">1.0</option>
                <option value="1.1">1.1</option>
                <option value="1.2">1.2</option>
                <option value="1.3">1.3</option>
                <option value="1.4">1.4</option>
                <option value="1.5">1.5</option>
                <option value="1.6">1.6</option>
                <option value="1.7">1.7</option>
                <option value="1.8">1.8</option>
                <option value="1.9">1.9</option>
                <option value="2">2.0</option>
                <option value="2.1">2.1</option>
                <option value="2.2">2.2</option>
                <option value="2.3">2.3</option>
                <option value="2.4">2.4</option>
                <option value="2.5">2.5</option>
                <option value="2.6">2.6</option>
                <option value="2.7">2.7</option>
                <option value="2.8">2.8</option>
                <option value="2.9">2.9</option>
                <option value="3">3.0</option>
                <option value="3.1">3.1</option>
                <option value="3.2">3.2</option>
                <option value="3.3">3.3</option>
                <option value="3.4">3.4</option>
                <option value="3.5">3.5</option>
                <option value="3.6">3.6</option>
                <option value="3.7">3.7</option>
                <option value="3.8">3.8</option>
                <option value="3.9">3.9</option>
                <option value="4">4.0</option>
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

            <ButtonGroup mt={5} w="100%">
              <Flex w="100%" justifyContent="space-between">
                <Flex>
                  <Button
                    onClick={() => {
                      setStep(step - 1);
                      setProgress(progress - 25);
                    }}
                    colorScheme="blue"
                    variant="solid"
                    w="7rem"
                    mr="5%"
                  >
                    Back
                  </Button>
                </Flex>
                <Button
                  type="submit"
                  w="7rem"
                  colorScheme="blue"
                  variant="outline"
                >
                  Next
                </Button>
              </Flex>
            </ButtonGroup>
          </form>
        );

      case 3:
        return (
          <form onSubmit={formik.handleSubmit}>
            <Heading w="100%" textAlign="center" fontWeight="normal" fontSize={{ base: 'xl', md: '2xl' }}>
              Step 4: Soil Information
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
                <Tooltip label="Enter Soil Rooting Depth (inch)" fontSize="md">
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
                <Tooltip label="Enter Available soil water at planting day (%)" fontSize="md">
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
                <Tooltip label="Enter Soil Texture" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>

              <RadioGroup id="soilTexture" onChange={setSoilTexture} value={soilTexture}>
                <Stack direction="row">
                  <Radio value="automatic">Automatically select from Online Soil Database</Radio>
                  <Radio value="manual">Manual Setting</Radio>
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
                <Tooltip label="Enter Average soil texture to the rooting depth" fontSize="md">
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

            <ButtonGroup mt={5} w="100%">
              <Flex w="100%" justifyContent="space-between">
                <Flex>
                  <Button
                    onClick={() => {
                      setStep(step - 1);
                      setProgress(progress - 25);
                    }}
                    colorScheme="blue"
                    variant="solid"
                    w="7rem"
                    mr="5%"
                  >
                    Back
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
    <Container maxW="100%">
      <Heading my={5} fontSize={{ base: 'xl', md: '2xl' }}>
        Add New Soybean Field
      </Heading>

      <Progress hidden={!loading} size="xs" isIndeterminate marginTop={10} />
      <Box
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        p={3}
        disabled={loading}
      >
        <Progress hasStripe value={progress} my={3} isAnimated />
        {currentForm()}
      </Box>
    </Container>
  );
}
