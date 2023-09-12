import * as d3 from 'd3';
import { useState } from 'react';
import { Container } from '@chakra-ui/react';
import LinePlot from '../../components/admin/LinePlot';

export default function SoybeanDetail() {
  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

  return (
    <Container height="100vh" maxW="container.lg">

      <LinePlot data={data} />
    </Container>
  );
}
