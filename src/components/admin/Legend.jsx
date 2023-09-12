import React from 'react';

function Legend({ data, selectedItems, onChange }) {
  return (
    <div className="legendContainer">
      {data.map((d) => (
        <div className="checkbox" style={{ color: d.color }} key={d.name}>
          {d.name !== 'Portfolio' && (
          <input
            type="checkbox"
            value={d.name}
            checked={selectedItems.includes(d.name)}
            onChange={() => onChange(d.name)}
          />
          )}
          <p>{d.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Legend;
