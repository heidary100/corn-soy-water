import {
    Container,
    Heading,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Divider,
    Stack,
    Button
} from '@chakra-ui/react'
import { MdAdd, MdMap, MdEdit, MdDetails, MdDelete } from "react-icons/md"

export default function Corn() {
    return (
        <Container height={'100vh'} maxW='container.lg'>
            <Heading marginTop={10}>Corn Fields</Heading>
            <Stack direction='row' spacing={4} marginTop={10}>
                <Button as={'a'} href={'/admin/add-corn'} leftIcon={<MdAdd />} colorScheme='green' variant='solid'>
                    Add Corn Field
                </Button>
                <Button as={'a'} href={'/admin/corn-map'} float={'right'} rightIcon={<MdMap />} colorScheme='blue' variant='outline'>
                    Show on Map
                </Button>
            </Stack>
            <TableContainer marginTop={10}>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Date of planting</Th>
                            <Th isNumeric>Relative maturity</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Field 1</Td>
                            <Td>07/04/2023</Td>
                            <Td isNumeric>1.4</Td>
                            <Td>
                                <Stack direction='row' spacing={1}>
                                    <Button leftIcon={<MdEdit />} colorScheme='blue' variant='outline'>
                                        Edit
                                    </Button>
                                    <Button leftIcon={<MdDetails />} colorScheme='blue' variant='outline'>
                                        Detail
                                    </Button>
                                    <Button leftIcon={<MdDelete />} colorScheme='red' variant='solid'>
                                        Delete
                                    </Button>
                                </Stack>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td>Field 2</Td>
                            <Td>07/04/2023</Td>
                            <Td isNumeric>2.48</Td>
                            <Td>
                                <Stack direction='row' spacing={1}>
                                    <Button leftIcon={<MdEdit />} colorScheme='blue' variant='outline'>
                                        Edit
                                    </Button>
                                    <Button leftIcon={<MdDetails />} colorScheme='blue' variant='outline'>
                                        Detail
                                    </Button>
                                    <Button leftIcon={<MdDelete />} colorScheme='red' variant='solid'>
                                        Delete
                                    </Button>
                                </Stack>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td>Field 3</Td>
                            <Td>07/04/2023</Td>
                            <Td isNumeric>3.9</Td>
                            <Td>
                                <Stack direction='row' spacing={1}>
                                    <Button leftIcon={<MdEdit />} colorScheme='blue' variant='outline'>
                                        Edit
                                    </Button>
                                    <Button leftIcon={<MdDetails />} colorScheme='blue' variant='outline'>
                                        Detail
                                    </Button>
                                    <Button leftIcon={<MdDelete />} colorScheme='red' variant='solid'>
                                        Delete
                                    </Button>
                                </Stack>
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Container>)
}