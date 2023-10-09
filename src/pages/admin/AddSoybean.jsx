import React, { useState } from 'react';
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  RadioGroup,
  Radio,
  useToast,
} from '@chakra-ui/react';
import {
  MapContainer, TileLayer, useMapEvents, Marker,
} from 'react-leaflet';
import { NavLink } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import SoybeanService from '../../services/soybean.service';
import 'react-datepicker/dist/react-datepicker.css';

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
    .min(1, 'Maturity Group shoud be more than 1')
    .max(4.5, 'Maturity Group shoud be less than 4.5'),
});

const form3ValidationSchema = Yup.object().shape({
  soilRootingDepth: Yup.number()
    .required('Soil Rooting Depth is required')
    .min(20, 'Soil Rooting Depth shoud be more than 20')
    .max(50, 'Soil Rooting Depth shoud be less than 50'),
  availableSoilWater: Yup.number()
    .required('Average Soil Water is required')
    .min(0, 'Average Soil Water shoud be more than 0')
    .max(100, 'Average Soil Water shoud be less than 100'),
  averageSoilTexture: Yup.string()
    .required('Average Soil Texture is required'),
});

export default function AddSoybean() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);
  const [soilTexture, setSoilTexture] = useState('automatic');

  const handleSubmit = async (values) => {
    try {
      await SoybeanService.createSoybean(values);
      // Handle successful submission here
      toast({
        title: 'Created Soybean Field Successfuly.',
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
                  onClick={(point) => formik.setValues({ ...formik.values, ...point })}
                />
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
              </FormLabel>
              {/* <Input
                type="text"
                name="plantingDate"
                id="plantingDate"
                autoComplete="plantingDate"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.plantingDate}
              /> */}
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
                dateFormat="dd/MM/yyyy"
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
              </FormLabel>

              <NumberInput
                precision={1}
                step={0.1}
                min={1}
                max={4.5}
                name="maturityGroup"
                id="maturityGroup"
                onChange={(value) => formik.setFieldValue('maturityGroup', value)}
                onBlur={formik.handleBlur}
                value={formik.values.maturityGroup}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
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
              </FormLabel>
              <NumberInput
                precision={0}
                step={1}
                min={20}
                max={50}
                name="soilRootingDepth"
                id="soilRootingDepth"
                onChange={(value) => formik.setFieldValue('soilRootingDepth', value)}
                onBlur={formik.handleBlur}
                value={formik.values.soilRootingDepth}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
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
              </FormLabel>
              <NumberInput
                precision={0}
                step={25}
                min={25}
                max={100}
                name="availableSoilWater"
                id="availableSoilWater"
                onChange={(value) => formik.setFieldValue('availableSoilWater', value)}
                onBlur={formik.handleBlur}
                value={formik.values.availableSoilWater}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.touched.availableSoilWater && formik.errors.availableSoilWater && (
                <Text color="red">{formik.errors.availableSoilWater}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Soil Texture
              </FormLabel>

              <RadioGroup onChange={setSoilTexture} value={soilTexture}>
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
    <Container height="100vh" maxW="container.lg">
      <Heading marginTop={10}>Add Soybean Field</Heading>
      <Stack direction="row" spacing={4} marginTop={10}>
        <Button as={NavLink} to="/admin/soybean" float="right" leftIcon={<MdArrowBack />} colorScheme="blue" variant="outline">
          Back to List
        </Button>
      </Stack>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        p={6}
        m="10px auto"
        marginTop={10}
      >
        <Progress hasStripe value={progress} mb="5%" mx="5%" isAnimated />
        {currentForm()}
      </Box>
    </Container>
  );
}
