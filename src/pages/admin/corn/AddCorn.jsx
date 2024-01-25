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
  Avatar,
  Checkbox,
} from '@chakra-ui/react';
import {
  MapContainer, TileLayer, useMapEvents, Marker,
  FeatureGroup,
  LayersControl,
  LayerGroup,
} from 'react-leaflet';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import { InfoIcon } from '@chakra-ui/icons';
import { EditControl } from 'react-leaflet-draw';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import CornService from '../../../services/corn.service';
import 'react-datepicker/dist/react-datepicker.css';
import LeafletgeoSearch from '../../../components/LeafletgeoSearch';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'react-leaflet-fullscreen/styles.css';
import WeatherStations from '../../../components/admin/WeatherStations';

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
  relativeMaturity: Yup.number()
    .required('Relative Maturity is required')
    .min(90, 'Relative Maturity should be more than 90')
    .max(125, 'Relative Maturity should be less than 125'),
  plantPopulation: Yup.number()
    .required('Plant Population is required')
    .min(20, 'Plant Population should be more than 20')
    .max(45, 'Plant Population should be less than 45'),
});

const form3ValidationSchema = Yup.object().shape({
  soilRootingDepth: Yup.number()
    .required('Soil Rooting Depth is required'),
  soilSurfaceResiduesCoverage: Yup.number()
    .required('Soil Surface Residues Coverage is required'),
  topSoilBulkDensity: Yup.number()
    .required('Top Soil Bulk Density is required'),
  topSoilMoistureAtPlanting: Yup.number()
    .required('Top Soil (1 foot) Moisture at Planting is required'),
  subSoilMoistureAtPlanting: Yup.number()
    .required('Sub Soil (below 1 foot) Moisture at Planting is required'),
  topSoilTexture: Yup.string()
    .required('Top Soil (1 foot) Texture is required'),
  subSoilTexture: Yup.string()
    .required('Sub Soil (below 1 foot) Texture is required'),
});

export default function AddCorn({ edit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(50);
  const [soilTexture, setSoilTexture] = useState('automatic');
  const [loading, setLoading] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [showWS, setShowWS] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const shouldShowModal = !dontShowAgain && !localStorage.getItem('dontShowAgainWS');
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('dontShowAgainWS', 'true');
    }

    onClose();
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      // eslint-disable-next-line no-console
      if (edit === true) {
        await CornService.updateCorn(id, values);
        // Handle successful submission here
        toast({
          title: 'Updated Soybean Field Successfuly.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        navigate(`/admin/result/corn/${id}`);
      } else {
        const savedCorn = await CornService.createCorn(values);
        // Handle successful submission here
        toast({
          title: 'Created Soybean Field Successfuly.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        navigate(`/admin/result/corn/${savedCorn.id}`);
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
      relativeMaturity: '',
      plantPopulation: '',
      soilRootingDepth: '',
      soilSurfaceResiduesCoverage: '',
      topSoilBulkDensity: '',
      topSoilMoistureAtPlanting: '',
      subSoilMoistureAtPlanting: '',
      topSoilTexture: '',
      subSoilTexture: '',
    },
    // eslint-disable-next-line max-len, no-nested-ternary
    validationSchema: step === 1 ? form1ValidationSchema : step === 2 ? form2ValidationSchema : form3ValidationSchema,
    onSubmit: (values) => {
      if (step === 3) {
        handleSubmit(values);
      } else {
        setStep(step + 1);
        setProgress(progress + 25);
      }
    },
  });

  useEffect(() => {
    async function fetchData(cornId) {
      const soybean = await CornService.getCornById(cornId);
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
            <Heading w="100%" textAlign="center" fontWeight="normal" my={3} fontSize={{ base: 'xl', md: '2xl' }}>
              Step 2: Choose Location
            </Heading>
            <Box height="50vh" position="relative">
              <MapContainer
                center={[parseFloat(formik.values.lat), parseFloat(formik.values.lng)]}
                zoom={edit === true ? 16 : 10}
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
                {showWS && <WeatherStations />}
                <Marker position={[parseFloat(formik.values.lat), parseFloat(formik.values.lng)]} />
                <LocationFinderDummy
                  onClick={(point) => {
                    if (!drawing) {
                      formik.setValues({ ...formik.values, ...point });
                      if (shouldShowModal) {
                        onOpen();
                      }
                    }
                  }}
                />
                <LeafletgeoSearch />
                <FeatureGroup>
                  <EditControl
                    position="topright"
                    onDrawStart={() => { setDrawing(true); }}
                    onDrawStop={() => { setDrawing(false); }}
                    // onEdited={this._onEditPath}
                    // onCreated={this._onCreate}
                    // onDeleted={this._onDeleted}
                    draw={{
                      rectangle: false,
                    }}
                  />
                </FeatureGroup>
                <FullscreenControl
                  position="topleft"
                />
              </MapContainer>
              <Button
                pos="absolute"
                bottom="5"
                left="5"
                zIndex={10000}
                onClick={() => {
                  setShowWS(!showWS);
                }}
              >
                <Avatar borderRadius={0} size="sm" name="Weather Station" src="/img/climatology.png" />
        &nbsp;
                {showWS ? 'Hide' : 'Show'}
                &nbsp;
                Weather Stations
              </Button>
            </Box>

            <ButtonGroup mt={5} w="100%">
              <Flex w="100%" justifyContent="space-between">
                <Flex>
                  <Button
                    as={NavLink}
                    to={edit === true ? '/admin/' : '/admin/new'}
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
              Step 3: Crop Management Info
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
                <Tooltip label="enter your name" fontSize="md">
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
                htmlFor="relativeMaturity"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Relative Maturity (days)
                <Tooltip label="enter your Relative Maturity (days)" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>

              <Select
                id="relativeMaturity"
                name="relativeMaturity"
                placeholder="Select one"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.relativeMaturity}
              >
                <option value="90">90</option>
                <option value="91">91</option>
                <option value="92">92</option>
                <option value="93">93</option>
                <option value="94">94</option>
                <option value="95">95</option>
                <option value="96">96</option>
                <option value="97">97</option>
                <option value="98">98</option>
                <option value="99">99</option>
                <option value="100">100</option>
                <option value="101">101</option>
                <option value="102">102</option>
                <option value="103">103</option>
                <option value="104">104</option>
                <option value="105">105</option>
                <option value="106">106</option>
                <option value="107">107</option>
                <option value="108">108</option>
                <option value="109">109</option>
                <option value="110">110</option>
                <option value="111">111</option>
                <option value="112">112</option>
                <option value="113">113</option>
                <option value="114">114</option>
                <option value="115">115</option>
                <option value="116">116</option>
                <option value="117">117</option>
                <option value="118">118</option>
                <option value="119">119</option>
                <option value="120">120</option>
                <option value="121">121</option>
                <option value="122">122</option>
                <option value="123">123</option>
                <option value="124">124</option>
                <option value="125">125</option>
              </Select>
              {formik.touched.relativeMaturity && formik.errors.relativeMaturity && (
                <Text color="red">{formik.errors.relativeMaturity}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="plantPopulation"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Plant Population (x1000/acre)
                <Tooltip label="enter your Plant Population (x1000/acre)" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>

              <Select
                id="plantPopulation"
                name="plantPopulation"
                placeholder="Select one"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.plantPopulation}
              >
                <option value="20">20</option>
                <option value="20.5">20.5</option>
                <option value="21">21</option>
                <option value="21.5">21.5</option>
                <option value="22">22</option>
                <option value="22.5">22.5</option>
                <option value="23">23</option>
                <option value="23.5">23.5</option>
                <option value="24">24</option>
                <option value="24.5">24.5</option>
                <option value="25">25</option>
                <option value="25.5">25.5</option>
                <option value="26">26</option>
                <option value="26.5">26.5</option>
                <option value="27">27</option>
                <option value="27.5">27.5</option>
                <option value="28">28</option>
                <option value="28.5">28.5</option>
                <option value="29">29</option>
                <option value="29.5">29.5</option>
                <option value="30">30</option>
                <option value="30.5">30.5</option>
                <option value="31">31</option>
                <option value="31.5">31.5</option>
                <option value="32">32</option>
                <option value="32.5">32.5</option>
                <option value="33">33</option>
                <option value="33.5">33.5</option>
                <option value="34">34</option>
                <option value="34.5">34.5</option>
                <option value="35">35</option>
                <option value="35.5">35.5</option>
                <option value="36">36</option>
                <option value="36.5">36.5</option>
                <option value="37">37</option>
                <option value="37.5">37.5</option>
                <option value="38">38</option>
                <option value="38.5">38.5</option>
                <option value="39">39</option>
                <option value="39.5">39.5</option>
                <option value="40">40</option>
                <option value="40.5">40.5</option>
                <option value="41">41</option>
                <option value="41.5">41.5</option>
                <option value="42">42</option>
                <option value="42.5">42.5</option>
                <option value="43">43</option>
                <option value="43.5">43.5</option>
                <option value="44">44</option>
                <option value="44.5">44.5</option>
                <option value="45">45</option>
              </Select>
              {formik.touched.plantPopulation && formik.errors.plantPopulation && (
                <Text color="red">{formik.errors.plantPopulation}</Text>
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
            <Heading w="100%" textAlign="center" fontWeight="normal" fontSize={{ base: 'xl', md: '2xl' }}>
              Step 4: Soil Properties
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
                <option value="51">51</option>
                <option value="52">52</option>
                <option value="53">53</option>
                <option value="54">54</option>
                <option value="55">55</option>
                <option value="56">56</option>
                <option value="57">57</option>
                <option value="58">58</option>
                <option value="59">59</option>
                <option value="60">60</option>
              </Select>
              {formik.touched.soilRootingDepth && formik.errors.soilRootingDepth && (
                <Text color="red">{formik.errors.soilRootingDepth}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="soilSurfaceResiduesCoverage"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Soil Surface Residues Coverage (%)
                <Tooltip label="enter your Soil Surface Residues Coverage (%)" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>
              <Select
                id="soilSurfaceResiduesCoverage"
                name="soilSurfaceResiduesCoverage"
                placeholder="Select one"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.soilSurfaceResiduesCoverage}
              >
                <option value="0">0</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
                <option value="60">60</option>
                <option value="70">70</option>
                <option value="80">80</option>
                <option value="90">90</option>
                <option value="100">100</option>
              </Select>
              {formik.touched.soilSurfaceResiduesCoverage
                && formik.errors.soilSurfaceResiduesCoverage && (
                  <Text color="red">{formik.errors.soilSurfaceResiduesCoverage}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="topSoilBulkDensity"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Top Soil Bulk Density
                <Tooltip label="enter your Top Soil Bulk Density" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>
              <Select
                id="topSoilBulkDensity"
                name="topSoilBulkDensity"
                placeholder="Select one"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.topSoilBulkDensity}
              >
                <option value="1.2">1.2</option>
                <option value="1.3">1.3</option>
                <option value="1.4">1.4</option>
                <option value="1.5">1.5</option>
              </Select>
              {formik.touched.topSoilBulkDensity
                && formik.errors.topSoilBulkDensity && (
                  <Text color="red">{formik.errors.topSoilBulkDensity}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="topSoilMoistureAtPlanting"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Top Soil (1 foot) Moisture at Planting
                <Tooltip label="enter your Top Soil (1 foot) Moisture at Planting" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>
              <Select
                id="topSoilMoistureAtPlanting"
                name="topSoilMoistureAtPlanting"
                placeholder="Select one"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.topSoilMoistureAtPlanting}
              >
                <option value="100">Very wet (100% Available water)</option>
                <option value="75">Wet (75% Available water)</option>
                <option value="50">Moist (50% Available water)</option>
                <option value="25">Dry (25% Available water)</option>
              </Select>
              {formik.touched.topSoilMoistureAtPlanting
                && formik.errors.topSoilMoistureAtPlanting && (
                  <Text color="red">{formik.errors.topSoilMoistureAtPlanting}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="subSoilMoistureAtPlanting"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Sub Soil (below 1 foot) Moisture at Planting
                <Tooltip label="enter your Sub Soil (below 1 foot) Moisture at Planting" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>
              <Select
                id="subSoilMoistureAtPlanting"
                name="subSoilMoistureAtPlanting"
                placeholder="Select one"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.subSoilMoistureAtPlanting}
              >
                <option value="100">Very wet (100% Available water)</option>
                <option value="75">Wet (75% Available water)</option>
                <option value="50">Moist (50% Available water)</option>
                <option value="25">Dry (25% Available water)</option>
              </Select>
              {formik.touched.subSoilMoistureAtPlanting
                && formik.errors.subSoilMoistureAtPlanting && (
                  <Text color="red">{formik.errors.subSoilMoistureAtPlanting}</Text>
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
                htmlFor="topSoilTexture"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Top Soil (1 foot) Texture
                <Tooltip label="enter your Top Soil (1 foot) Texture" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>

              <Select
                id="topSoilTexture"
                name="topSoilTexture"
                placeholder="Select option"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.topSoilTexture}
                disabled={soilTexture === 'automatic'}
              >
                <option value="1">Loamy sand</option>
                <option value="2">Sandy loam</option>
                <option value="3">Silt loam</option>
                <option value="4">Loam</option>
                <option value="5">Sandy clay loam</option>
                <option value="6">Silty clay loam</option>
                <option value="7">Clay loam</option>
                <option value="8">Clay</option>
                <option value="9">Silty clay</option>
              </Select>
              {formik.touched.topSoilTexture && formik.errors.topSoilTexture && (
                <Text color="red">{formik.errors.topSoilTexture}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="subSoilTexture"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Sub Soil (below 1 foot) Texture
                <Tooltip label="enter your Sub Soil (below 1 foot) Texture" fontSize="md">
                  <InfoIcon marginLeft={2} />
                </Tooltip>
              </FormLabel>

              <Select
                id="subSoilTexture"
                name="subSoilTexture"
                placeholder="Select option"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.subSoilTexture}
                disabled={soilTexture === 'automatic'}
              >
                <option value="1">Loamy sand</option>
                <option value="2">Sandy loam</option>
                <option value="3">Silt Loam</option>
                <option value="4">Loam</option>
                <option value="5">Sandy clay loam</option>
                <option value="6">Silty clay loam</option>
                <option value="7">Clay loam</option>
                <option value="8">Clay</option>
                <option value="9">Silty clay</option>
              </Select>
              {formik.touched.subSoilTexture && formik.errors.subSoilTexture && (
                <Text color="red">{formik.errors.subSoilTexture}</Text>
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
        {edit === true ? 'Edit Corn Field' : 'Add New Corn Field'}
      </Heading>

      <Progress hidden={!loading} size="xs" isIndeterminate marginTop={10} />
      <Box
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        p={3}
        disabled={loading}
      >
        <Progress hasStripe value={progress} isAnimated my={3} />
        {currentForm()}
      </Box>
    </Container>
  );
}
