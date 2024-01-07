import React from 'react';
import {
  Button, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton, Text, FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';
import { useFormik } from 'formik';

export default function AddIrrigation({ isOpen, onClose, onSubmit }) {
  const formik = useFormik({
    initialValues: {
      date: '',
      amount: '',
    },
    validationSchema: Yup.object().shape({
      date: Yup.date()
        .required('Date is required'),
      amount: Yup.number()
        .required('Amount is required'),
    }),
    onSubmit: (values) => {
      onClose();
      onSubmit(values);
    },
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a new Irrigation record</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <FormControl>
              <FormLabel
                htmlFor="date"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Date
              </FormLabel>
              <DatePicker
                name="date"
                id="date"
                onChange={(value) => formik.setFieldValue('date', value)}
                selected={formik.values.date}
                onBlur={formik.handleBlur}
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                showIcon
                dateFormat="dd/MM/yyyy"
              />
              {formik.touched.date && formik.errors.date && (
                <Text color="red">{formik.errors.date}</Text>
              )}
            </FormControl>

            <FormControl>
              <FormLabel
                htmlFor="amount"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: 'gray.50',
                }}
                mt="2%"
              >
                Amount (inches)
              </FormLabel>

              <Select
                id="amount"
                name="amount"
                placeholder="Select one"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.amount}
              >
                <option value="0">0</option>
                <option value="0.1">0.1</option>
                <option value="0.2">0.2</option>
                <option value="0.3">0.3</option>
                <option value="0.4">0.4</option>
                <option value="0.5">0.5</option>
                <option value="0.6">0.6</option>
                <option value="0.7">0.7</option>
                <option value="0.8">0.8</option>
                <option value="0.9">0.9</option>
                <option value="1.0">1.0</option>
                <option value="1.1">1.1</option>
                <option value="1.2">1.2</option>
                <option value="1.3">1.3</option>
                <option value="1.4">1.4</option>
                <option value="1.5">1.5</option>
                <option value="1.6">1.6</option>
                <option value="1.7">1.7</option>
                <option value="1.8">1.8</option>
                <option value="1.9">1.9</option>
                <option value="2.0">2.0</option>
                <option value="2.1">2.1</option>
                <option value="2.2">2.2</option>
                <option value="2.3">2.3</option>
                <option value="2.4">2.4</option>
                <option value="2.5">2.5</option>
                <option value="2.6">2.6</option>
                <option value="2.7">2.7</option>
                <option value="2.8">2.8</option>
                <option value="2.9">2.9</option>
                <option value="3.0">3.0</option>
                <option value="3.1">3.1</option>
                <option value="3.2">3.2</option>
                <option value="3.3">3.3</option>
                <option value="3.4">3.4</option>
                <option value="3.5">3.5</option>
                <option value="3.6">3.6</option>
                <option value="3.7">3.7</option>
                <option value="3.8">3.8</option>
                <option value="3.9">3.9</option>
                <option value="4.0">4.0</option>
                <option value="4.1">4.1</option>
                <option value="4.2">4.2</option>
                <option value="4.3">4.3</option>
                <option value="4.4">4.4</option>
                <option value="4.5">4.5</option>
                <option value="4.6">4.6</option>
                <option value="4.7">4.7</option>
                <option value="4.8">4.8</option>
                <option value="4.9">4.9</option>
                <option value="5.0">5.0</option>
              </Select>

              {formik.touched.amount && formik.errors.amount && (
                <Text color="red">{formik.errors.amount}</Text>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button type="submit" colorScheme="green">
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
