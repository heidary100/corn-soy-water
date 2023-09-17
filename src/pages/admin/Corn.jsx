import React, { useState } from 'react';
import {
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import {
  MdAdd, MdMap, MdEdit, MdDetails, MdDelete,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';

export default function Corn() {
  const [data, setData] = useState([
    {
      id: 1, name: 'Item 1', dateOfPlanting: '07/04/2023', relativeMaturity: '1.4',
    },
    {
      id: 2, name: 'Item 2', dateOfPlanting: '07/05/2023', relativeMaturity: '1.1',
    },
    {
      id: 3, name: 'Item 3', dateOfPlanting: '07/07/2023', relativeMaturity: '2.4',
    },
    {
      id: 4, name: 'Item 4', dateOfPlanting: '07/08/2023', relativeMaturity: '1.3',
    },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    // Remove the selected item from the data array
    setData(data.filter((item) => item.id !== selectedItem.id));
    // Close the delete confirmation modal
    setIsDeleteModalOpen(false);
  };

  return (
    <Container height="100vh" maxW="container.lg">
      <Heading marginTop={10}>Corn Fields</Heading>
      <Stack direction="row" spacing={4} marginTop={10}>
        <Button as={NavLink} to="/admin/corn/add" leftIcon={<MdAdd />} colorScheme="green" variant="solid">
          Add Corn Field
        </Button>
        <Button as={NavLink} to="/admin/corn/map" float="right" rightIcon={<MdMap />} colorScheme="blue" variant="outline">
          Show on Map
        </Button>
      </Stack>
      <TableContainer marginTop={10}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Date of planting</Th>
              <Th isNumeric>Relative maturity</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => (
              <Tr>
                <Td>{item.name}</Td>
                <Td>{item.dateOfPlanting}</Td>
                <Td isNumeric>{item.relativeMaturity}</Td>
                <Td>
                  <Stack direction="row" spacing={1}>
                    <Button leftIcon={<MdEdit />} colorScheme="blue" variant="outline">
                      Edit
                    </Button>
                    <Button leftIcon={<MdDetails />} colorScheme="blue" variant="outline">
                      Detail
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDeleteModalOpen(true);
                      }}
                      leftIcon={<MdDelete />}
                      colorScheme="red"
                      variant="solid"
                    >
                      Delete
                    </Button>
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete &qout;
            {selectedItem?.name}
            &qout;?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
                        &nbsp;
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
