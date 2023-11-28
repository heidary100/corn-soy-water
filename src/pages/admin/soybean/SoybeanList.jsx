import {
  Container,
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
  CardBody,
  Text,
  Card,
  CardHeader,
  CardFooter,
  Box,
  StackDivider,
  ButtonGroup,
  HStack,
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
    <Container maxW="container.lg">
      <Heading marginTop={10}>Soybean Fields</Heading>
      <Progress hidden={!loading} size="xs" isIndeterminate />

      {data.map((item) => (
        <Card marginTop={5}>
          <CardHeader>
            <Heading size="md">{item.name}</Heading>
          </CardHeader>
          <CardBody>
            <HStack divider={<StackDivider />} spacing="4">
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Date of planting
                </Heading>
                <Text pt="2" fontSize="sm">
                  {item.plantingDate.toString().split('T')[0]}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Maturity Group
                </Heading>
                <Text pt="2" fontSize="sm">
                  {item.maturityGroup}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Crop Status
                </Heading>
                <Text pt="2" fontSize="sm" color="green">
                  No water stress
                </Text>
              </Box>
            </HStack>
          </CardBody>
          <CardFooter>
            <ButtonGroup spacing="2">
              <Button as={NavLink} to={`/admin/result/soybean/${item.id}`} leftIcon={<MdInfo />} colorScheme="blue" variant="ghost">
                Detail
              </Button>
              <Button as={NavLink} to={`/admin/edit/soybean/${item.id}`} leftIcon={<MdEdit />} colorScheme="blue" variant="ghost">
                Edit
              </Button>
              <Button
                onClick={() => {
                  setSelectedItem(item);
                  setIsDeleteModalOpen(true);
                }}
                leftIcon={<MdDelete />}
                colorScheme="red"
                variant="ghost"
              >
                Delete
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
      ))}

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
