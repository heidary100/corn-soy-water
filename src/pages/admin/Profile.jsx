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
  Text,
  useToast,
  Checkbox,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UserService from '../../services/user.service';

export default function Profile() {
  const toast = useToast();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required'),
    lastName: Yup.string()
      .required('Last Name is required'),
    phone: Yup.string(),
    address: Yup.string(),
    state: Yup.string(),
    hideAlerts: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      state: '',
      hideAlerts: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        console.log(values);
        await UserService.updateUser(values);
        // Handle successful submission here
        toast({
          title: 'Updated profile information Successfuly.',
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
    },
  });

  useEffect(() => {
    async function fetchData() {
      const user = await UserService.getUser();
      formik.setValues(user);
      setLoading(false);
      setIsDataLoaded(true);
    }

    setLoading(true);
    try {
      fetchData();
    } catch (error) {
      // Handle submission error here
      toast({
        title: 'Failed to load data, Try again.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }, []);

  return (
    <Container minHeight="100vh" maxW="container.lg">
      <Heading marginTop={10}>
        Your Profile
      </Heading>
      <Progress hidden={!loading} size="xs" isIndeterminate marginTop={10} />
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        p={6}
        m="10px auto"
        marginTop={10}
      >

        <form onSubmit={formik.handleSubmit}>
          <fieldset disabled={loading}>
            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="firstName"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                First Name
              </FormLabel>
              <Input
                type="text"
                name="firstName"
                id="firstName"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <Text color="red">{formik.errors.firstName}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="lastName"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Last Name
              </FormLabel>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <Text color="red">{formik.errors.lastName}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="address"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Address
              </FormLabel>
              <Input
                type="text"
                name="address"
                id="address"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
              />
              {formik.touched.address && formik.errors.address && (
                <Text color="red">{formik.errors.address}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="state"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                State
              </FormLabel>
              <Input
                type="text"
                name="state"
                id="state"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.state}
              />
              {formik.touched.state && formik.errors.state && (
                <Text color="red">{formik.errors.state}</Text>
              )}
            </FormControl>

            <FormControl as={GridItem}>
              <FormLabel
                htmlFor="hideAlerts"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Hide Alerts
              </FormLabel>
              <Checkbox
                name="hideAlerts"
                id="hideAlerts"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.hideAlerts}
              />

              {formik.touched.hideAlerts && formik.errors.hideAlerts && (
                <Text color="red">{formik.errors.hideAlerts}</Text>
              )}
            </FormControl>

            <ButtonGroup mt="5%" w="100%">
              <Flex w="100%" justifyContent="space-between">
                <Flex>
                  <Button
                    type="submit"
                    w="7rem"
                    colorScheme="green"
                    variant="solid"
                    isLoading={loading && isDataLoaded}
                    loadingText="Submitting"
                  >
                    Submit
                  </Button>
                </Flex>
              </Flex>
            </ButtonGroup>
          </fieldset>
        </form>

      </Box>
    </Container>
  );
}
