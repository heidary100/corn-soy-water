import { Checkbox, VStack } from '@chakra-ui/react';
import React from 'react';

function Legend({ data, selectedItems, onChange }) {
  return (
    <VStack align="flex-start">
      {data.map((d) => (
        <Checkbox
          fontWeight="bold"
          key={d.name}
          value={d.name}
          checked={selectedItems.includes(d.name)}
          onChange={() => onChange(d.name)}
        >
          <span style={{
            display: 'inline-block',
            height: '15px',
            width: '15px',
            borderRadius: '15px',
            background: d.color,
          }}
          />
          {' '}
          {d.name}
        </Checkbox>
      ))}
    </VStack>
  );
}

export default Legend;
