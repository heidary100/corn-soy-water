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
  useToast,
  Progress,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  MdAdd, MdMap, MdEdit, MdDetails, MdDelete,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import SoybeanService from '../../services/soybean.service';

export default function Soybean() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const soybeans = await SoybeanService.getSoybeans();
      setData(soybeans);
      setLoading(false);
    }

    try {
      setLoading(true);
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

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleteModalOpen(false);
    setLoading(true);
    try {
      // eslint-disable-next-line no-console
      await SoybeanService.deleteSoybeanById(selectedItem.id);
      setData(data.filter((item) => item.id !== selectedItem.id));

      // Handle successful submission here
      toast({
        title: 'Deleted Soybean Field Successfuly.',
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
  };

  return (
    <Container minHeight="100vh" maxW="container.lg">
      <Heading marginTop={10}>Soybean Fields</Heading>
      <Stack direction="row" spacing={4} marginTop={10}>
        <Button as={NavLink} to="/admin/soybean/add" leftIcon={<MdAdd />} colorScheme="green" variant="solid">
          Add Soybean Field
        </Button>
        <Button as={NavLink} to="/admin/soybean/map" float="right" rightIcon={<MdMap />} colorScheme="blue" variant="outline">
          Show on Map
        </Button>
      </Stack>

      <TableContainer marginTop={10}>
        <Progress hidden={!loading} size="xs" isIndeterminate />
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Date of planting</Th>
              <Th isNumeric>Maturity Group</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => (
              <Tr key={item.id}>
                <Td>{item.name}</Td>
                <Td>{item.plantingDate.toString().split('T')[0]}</Td>
                <Td isNumeric>{item.maturityGroup}</Td>
                <Td>
                  <Stack direction="row" spacing={1}>
                    <Button as={NavLink} to={`/admin/soybean/edit/${item.id}`} leftIcon={<MdEdit />} colorScheme="blue" variant="outline">
                      Edit
                    </Button>
                    <Button as={NavLink} to={`/admin/soybean/detail/${item.id}`} leftIcon={<MdDetails />} colorScheme="blue" variant="outline">
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
            Are you sure you want to delete &ldquo;
            {selectedItem?.name}
            &ldquo;?
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
