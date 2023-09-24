import { Checkbox, VStack } from '@chakra-ui/react';
import React from 'react';

function Legend({ data, selectedItems, onChange }) {
  return (
    <VStack align="flex-start">
      {data.map((d) => (
        <Checkbox
          style={{ color: d.color }}
          key={d.name}
          value={d.name}
          checked={selectedItems.includes(d.name)}
          onChange={() => onChange(d.name)}
        >
          {d.name}
        </Checkbox>
      ))}
    </VStack>
  );
}

export default Legend;
