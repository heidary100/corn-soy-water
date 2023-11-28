import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

export default function Login() {
  const toast = useToast();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await AuthService.loginUser(values);
        toast({
          title: 'Login successful.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        navigate('/admin/');
      } catch (error) {
        toast({
          title: 'Failure.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <Stack align="center">
          <Heading fontSize="4xl">Sign in to your account</Heading>
        </Stack>
        <Box
          rounded="lg"
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow="lg"
          p={8}
        >
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="email" isInvalid={formik.touched.email && formik.errors.email}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl id="password" isInvalid={formik.touched.password && formik.errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              )}
            </FormControl>

            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align="start"
                justify="space-between"
              >
                <Checkbox>Remember me</Checkbox>
                <Link color="blue.400" href="/forget-password">Forgot password?</Link>
              </Stack>
              <Button
                type="submit"
                bg="blue.400"
                color="white"
                _hover={{
                  bg: 'blue.500',
                }}
                isLoading={formik.isSubmitting}
              >
                Sign in
              </Button>
            </Stack>
          </form>

          <Stack pt={6}>
            <Text align="center">
              Don
              &lsquo;
              t have an account?
              {' '}
              <Link color="blue.400" href="/register">
                Sign up
              </Link>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
