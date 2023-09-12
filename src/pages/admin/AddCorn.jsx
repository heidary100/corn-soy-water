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
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import {
  MapContainer, TileLayer, useMapEvents, Marker,
} from 'react-leaflet';
import { NavLink } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';

function LocationFinderDummy({ onClick }) {
  const map = useMapEvents({
    click(e) {
      // map.setView([e.latlng.lat, e.latlng.lng], map.getZoom())
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function Form1() {
  const [point, setPoint] = useState({ lat: 38, lng: -450 });

  return (
    <>
      <Heading w="100%" textAlign="center" fontWeight="normal" mb="2%">
        Step 1: Choose Location
      </Heading>
      <Box height="50vh" marginTop="10">
        <MapContainer center={[point.lat, point.lng]} zoom={4} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[point.lat, point.lng]} />

          <LocationFinderDummy onClick={setPoint} />
        </MapContainer>
      </Box>
    </>
  );
}

function Form2() {
  return (
    <>
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
        />
      </FormControl>

      <FormControl as={GridItem}>
        <FormLabel
          htmlFor="city"
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
        <Input
          type="text"
          name="city"
          id="city"
          autoComplete="city"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
        />
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
          defaultValue={1}
          precision={1}
          step={0.1}
          min={1}
          max={4.5}
          name="maturityGroup"
          id="maturityGroup"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
    </>
  );
}

function Form3() {
  return (
    <>
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
          defaultValue={20}
          precision={0}
          step={1}
          min={20}
          max={50}
          name="soilRootingDepth"
          id="soilRootingDepth"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <FormControl as={GridItem}>
        <FormLabel
          htmlFor="availableSoilWaterAtPlantingDay"
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
          defaultValue={25}
          precision={0}
          step={25}
          min={25}
          max={100}
          name="availableSoilWaterAtPlantingDay"
          id="availableSoilWaterAtPlantingDay"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <FormControl as={GridItem}>
        <FormLabel
          htmlFor="averageSoilTextureToTheRootingDepth"
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
          id="averageSoilTextureToTheRootingDepth"
          name="averageSoilTextureToTheRootingDepth"
          placeholder="Select option"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
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
          <option value="18" selected="">Silty clay loam</option>

        </Select>
      </FormControl>
    </>
  );
}

export default function AddCorn() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);

  return (
    <Container height="100vh" maxW="container.lg">
      <Heading marginTop={10}>Add Corn Field</Heading>
      <Stack direction="row" spacing={4} marginTop={10}>
        <Button as={NavLink} to="/admin/corn" float="right" leftIcon={<MdArrowBack />} colorScheme="blue" variant="outline">
          Back to List
        </Button>
      </Stack>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        // maxWidth={800}
        p={6}
        m="10px auto"
        marginTop={10}
        as="form"
      >
        <Progress hasStripe value={progress} mb="5%" mx="5%" isAnimated />
        {step === 1 ? <Form1 /> : step === 2 ? <Form2 /> : <Form3 />}
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
                w="7rem"
                isDisabled={step === 3}
                onClick={() => {
                  setStep(step + 1);
                  if (step === 3) {
                    setProgress(100);
                  } else {
                    setProgress(progress + 33.33);
                  }
                }}
                colorScheme="blue"
                variant="outline"
              >
                Next
              </Button>
            </Flex>
            {step === 3 ? (
              <Button
                w="7rem"
                colorScheme="green"
                variant="solid"
              >
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </Container>
  );
}
