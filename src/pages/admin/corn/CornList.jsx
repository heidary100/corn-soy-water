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
  MdDelete, MdInfo,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import CornService from '../../../services/corn.service';

export default function CornList() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const corns = await CornService.getCorns();
        setData(corns);
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
      await CornService.deleteCornById(selectedItem.id);
      setData((prevData) => prevData.filter((item) => item.id !== selectedItem.id));

      toast({
        title: 'Deleted Corn Field Successfully.',
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
      <Heading fontWeight="normal" margin={2}>Corn Fields</Heading>
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
              <Td color="red">Under water stress</Td>
              <Td>
                <ButtonGroup spacing="2">
                  <IconButton
                    as={NavLink}
                    to={`/admin/result/corn/${item.id}`}
                    leftIcon={<MdInfo />}
                    colorScheme="blue"
                    variant="ghost"
                    title="Detail"
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
