import {
  Box,
  Heading,
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ButtonGroup,
  IconButton,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  MdEdit, MdDelete, MdInfo,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import SoybeanService from '../../../services/soybean.service';

export default function SoybeanList() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const soybeans = await SoybeanService.getSoybeans();
        setData(soybeans);
      } catch (error) {
        toast({
          title: 'Failed to load data. Try again.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [toast]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleteModalOpen(false);
    setLoading(true);

    try {
      await SoybeanService.deleteSoybeanById(selectedItem.id);
      setData((prevData) => prevData.filter((item) => item.id !== selectedItem.id));

      toast({
        title: 'Deleted Soybean Field Successfully.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failure. Try again.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box w="100%">
      <Heading fontWeight="normal" margin={2}>Soybean Fields</Heading>
      <Progress hidden={!loading} size="xs" isIndeterminate />

      <Table w="100%" colorScheme="gray" variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Date of Planting</Th>
            <Th>Crop Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => (
            <Tr key={item.id}>
              <Td>{item.name}</Td>
              <Td>{new Date(item.plantingDate).toLocaleDateString()}</Td>
              <Td color="green">No water stress</Td>
              <Td>
                <ButtonGroup spacing="2">
                  <IconButton
                    as={NavLink}
                    to={`/admin/result/soybean/${item.id}`}
                    leftIcon={<MdInfo />}
                    colorScheme="blue"
                    variant="ghost"
                    title="Detail"
                  />

                  <IconButton
                    as={NavLink}
                    to={`/admin/result/edit/soybean/${item.id}`}
                    leftIcon={<MdEdit />}
                    colorScheme="blue"
                    variant="ghost"
                    title="Edit"
                  />
                  <IconButton
                    onClick={() => {
                      setSelectedItem(item);
                      setIsDeleteModalOpen(true);
                    }}
                    icon={<MdDelete />}
                    colorScheme="red"
                    variant="ghost"
                    title="Delete"
                  />
                </ButtonGroup>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

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
    </Box>
  );
}
