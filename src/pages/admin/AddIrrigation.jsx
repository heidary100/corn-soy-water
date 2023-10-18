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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
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
                Amount
              </FormLabel>

              <NumberInput
                name="amount"
                id="amount"
                onChange={(value) => formik.setFieldValue('amount', value)}
                onBlur={formik.handleBlur}
                value={formik.values.amount}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
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
