import { Checkbox, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

function Legend({ data, onChange }) {
  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={1} p={5}>
      {data.map((d) => (
        <GridItem key={d.name} colSpan={6}>
          <Checkbox
            fontWeight="medium"
            key={d.name}
            value={d.name}
            onChange={() => onChange(d.name)}
            checked={d.checked}
            disabled={d.checked}
          >

            {d.legendShape === 'line' && (
              <span style={{
                display: 'inline-block',
                marginBottom: '5px',
                height: '3px',
                width: '15px',
                borderTop: `3px solid ${d.color}`,
                borderStyle: d.dashed ? 'dashed' : 'solid',
              }}
              />
            )}

            {d.legendShape === 'circle' && (
              <span style={{
                display: 'inline-block',
                background: d.color,
                height: '13px',
                width: '13px',
                borderRadius: '13px',
              }}
              />
            )}
            &nbsp;
            {d.name}
          </Checkbox>
        </GridItem>
      ))}
    </Grid>
  );
}

export default Legend;
