import React from 'react';
import {
  Box,
  Heading,
  Container,
  SimpleGrid,
  Image,
  Text,
} from '@chakra-ui/react';

export default function About() {
  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Founder & CEO',
      image: 'https://placekitten.com/200/200', // Replace with your own image URL
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...',
    },
    {
      id: 2,
      name: 'John Doe',
      role: 'Founder & CEO',
      image: 'https://placekitten.com/200/200', // Replace with your own image URL
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...',
    },
    {
      id: 3,
      name: 'John Doe',
      role: 'Founder & CEO',
      image: 'https://placekitten.com/200/200', // Replace with your own image URL
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...',
    },
    {
      id: 4,
      name: 'John Doe',
      role: 'Founder & CEO',
      image: 'https://placekitten.com/200/200', // Replace with your own image URL
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...',
    },
    {
      id: 5,
      name: 'John Doe',
      role: 'Founder & CEO',
      image: 'https://placekitten.com/200/200', // Replace with your own image URL
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...',
    },
    {
      id: 6,
      name: 'John Doe',
      role: 'Founder & CEO',
      image: 'https://placekitten.com/200/200', // Replace with your own image URL
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...',
    },
    // Add more team members as needed
  ];

  return (
    <Container maxW="container.lg" mt={10}>
      <Heading mb={6}>About Us</Heading>
      <Box>
        <p>
          Welcome to our amazing app! This is a brief introduction about what our app does.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...
        </p>
      </Box>
      {/* <TeamSection /> */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mt={8}>
        {teamMembers.map(({
          id, image, name, role, bio,
        }) => (
          <Box key={id} p={4} borderWidth="1px" borderRadius="lg">
            <Image src={image} alt={name} borderRadius="full" boxSize="150px" mb={4} />
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              {name}
            </Text>
            <Text color="gray.600" mb={2}>
              {role}
            </Text>
            <Text>{bio}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
}
