import React, { useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import AuthService from '../services/auth.service';

export default function Register() {
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    // Handle form submission here
    setLoading(true);

    try {
      await AuthService.registerUser(values);
      // Handle a successful API response (e.g., display a success message)
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      // setStatus('Registration successful');
    } catch (error) {
      // Handle API errors (e.g., display an error message)
      toast({
        title: 'Failure.',
        description: 'Registration failed.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl" textAlign="center">
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded="lg"
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow="lg"
          p={8}
        >
          <Stack spacing={4}>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form>
                  <HStack>
                    <Box>
                      <Field name="firstName">
                        {({ field, form }) => (
                          <FormControl
                            isRequired
                            isInvalid={form.errors.firstName && form.touched.firstName}
                          >
                            <FormLabel htmlFor="firstName">First Name</FormLabel>
                            <Input type="text" {...field} id="firstName" placeholder="First Name" />
                            <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <Box>
                      <Field name="lastName">
                        {({ field, form }) => (
                          <FormControl
                            isRequired
                            isInvalid={form.errors.lastName && form.touched.lastName}
                          >
                            <FormLabel htmlFor="lastName">Last Name</FormLabel>
                            <Input type="text" {...field} id="lastName" placeholder="Last Name" />
                            <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                  </HStack>

                  <Field name="email">
                    {({ field, form }) => (
                      <FormControl isRequired isInvalid={form.errors.email && form.touched.email}>
                        <FormLabel htmlFor="email">Email address</FormLabel>
                        <Input type="email" {...field} id="email" placeholder="email@example.com" />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="password">
                    {({ field, form }) => (
                      <FormControl
                        isRequired
                        isInvalid={form.errors.password && form.touched.password}
                      >
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <InputGroup>
                          <Input type={showPassword ? 'text' : 'password'} {...field} id="password" placeholder="******" />
                          <InputRightElement h="full">
                            <Button
                              variant="ghost"
                              onClick={() => setShowPassword((show) => !show)}
                            >
                              {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Stack spacing={10} pt={6}>
                    <Button
                      type="submit"
                      loadingText="Submitting"
                      size="lg"
                      bg="blue.400"
                      color="white"
                      isLoading={loading}
                      _hover={{
                        bg: 'blue.500',
                      }}
                    >
                      Sign up
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>

            <Stack pt={6}>
              <Text align="center">
                Already a user?
                {' '}
                <Link color="blue.400" href="/login">Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
