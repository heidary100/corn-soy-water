import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading, Input, Radio, RadioGroup, Select,
  SimpleGrid, Stack, Text, Tooltip, VStack, useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useRef, useState } from 'react';
import * as Yup from 'yup';
import { InfoIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import {
  LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer,
} from 'react-leaflet';
import SoybeanService from '../../../services/soybean.service';
import { soybeanIcon } from '../../../components/admin/MarkerIcons';
import DrawTools from '../../../components/admin/DrawTools';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required'),
  plantingDate: Yup.date()
    .required('Planting date is required'),
  maturityGroup: Yup.number()
    .required('Maturity Group is required')
    .min(1, 'Maturity Group should be more than 1')
    .max(4.5, 'Maturity Group should be less than 4.5'),
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

export default function EditSoybean({ fieldInfo, onCancel, onSuccess }) {
  const {
    id, lat, lng, name, plantingDate, maturityGroup,
    soilRootingDepth, availableSoilWater, averageSoilTexture,
  } = fieldInfo;
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [soilTexture, setSoilTexture] = useState('automatic');
  const shapeRef = useRef(JSON.parse(fieldInfo.shape));
  const formik = useFormik({
    initialValues: {
      lat,
      lng,
      name,
      plantingDate,
      maturityGroup,
      soilRootingDepth,
      availableSoilWater,
      averageSoilTexture,
    },
    validationSchema,
    onSubmit: async (values) => {
      if ((shapeRef.current === null || formik.values.lat === '' || formik.values.lng === '')) {
        toast({
          title: 'Please draw shape!',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      } else {
        setLoading(true);
        try {
          await SoybeanService.updateSoybean(id, {
            ...values, shape: JSON.stringify(shapeRef.current),
          });
          // Handle successful submission here
          toast({
            title: 'Updated Soybean Field Successfuly.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
          onSuccess({ id, ...values, shape: JSON.stringify(shapeRef.current) });
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
      }
    },
  });

  const onUpdateShape = (newShape) => {
    shapeRef.current = newShape.shape;
    formik.setFieldValue('lat', newShape.lat === null ? '' : newShape.lat);
    formik.setFieldValue('lng', newShape.lng === null ? '' : newShape.lng);
  };

  return (
    <SimpleGrid minChildWidth="500px" columns={2} spacing={1}>
      <Box>
        <form onSubmit={formik.handleSubmit}>
          <SimpleGrid minChildWidth="300px" columns={2} spacing={1}>
            <VStack spacing={4} align="top">
              <Heading as="h3" size="lg" mb={2}>
                Crop Information
              </Heading>
              <FormControl>
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

              <FormControl>
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

              <FormControl>
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
                  <Tooltip label="Select Maturity Group" fontSize="md">
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
            </VStack>
            <VStack spacing={4} align="top">
              <Heading as="h3" size="lg" mb={2}>
                Soil Information
              </Heading>

              <FormControl>
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
                  <Tooltip label="Enter Soil Rooting Depth in inches" fontSize="md">
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

              <FormControl>
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

              <FormControl>
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

              <FormControl>
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
            </VStack>
          </SimpleGrid>
          <Divider mt="5" />
          <ButtonGroup mt={5} w="100%">
            <Flex w="100%" justifyContent="space-between">
              <Flex>
                <Button
                  colorScheme="red"
                  variant="solid"
                  w="7rem"
                  mr="5%"
                  onClick={onCancel}
                >
                  Cancel
                </Button>

              </Flex>
              <Button
                type="submit"
                w="7rem"
                colorScheme="green"
                variant="solid"
                isLoading={loading}
                loadingText="Submitting"
                onClick={formik.on}
              >
                Submit
              </Button>
            </Flex>
          </ButtonGroup>
        </form>
      </Box>

      <Box height="50vh" marginBottom="10">
        {!Number.isNaN(parseFloat(fieldInfo.lat))
          && !Number.isNaN(parseFloat(fieldInfo.lng))
          && (
            <MapContainer
              center={
                (formik.values.lat === '' && formik.values.lng === '') ? ['40.505664', '-98.966389']
                  : [parseFloat(formik.values.lat), parseFloat(formik.values.lng)]
              }
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
                icon={soybeanIcon}
                position={
                  (formik.values.lat === '' && formik.values.lng === '') ? ['', '']
                    : [parseFloat(formik.values.lat), parseFloat(formik.values.lng)]
                }
              >
                <Popup>
                  {fieldInfo.name}
                </Popup>
              </Marker>
              <DrawTools updateShape={onUpdateShape} shape={shapeRef.current} />
            </MapContainer>
          )}
      </Box>
    </SimpleGrid>
  );
}
