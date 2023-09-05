/** App.js */
import React from "react";
import schc from "./SCHC.json";
import vcit from "./VCIT.json";
import portfolio from "./portfolio.json";
import MultilineChart from "../../components/admin/MultilineChart";
import Legend from "../../components/admin/Legend";
import { Container, Heading } from "@chakra-ui/react";

const portfolioData = {
  name: "Portfolio",
  color: "#d53eff",
  items: portfolio.map((d) => ({ ...d, date: new Date(d.date) }))
};
const schcData = {
  name: "SCHC",
  color: "#d53e4f",
  items: schc.map((d) => ({ ...d, date: new Date(d.date) }))
};
const vcitData = {
  name: "VCIT",
  color: "#5e4fa2",
  items: vcit.map((d) => ({ ...d, date: new Date(d.date) }))
};

const dimensions = {
  width: 600,
  height: 300,
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60
  }
};

export default function SoybeanDetail() {
  const [selectedItems, setSelectedItems] = React.useState([]);
  const legendData = [portfolioData, schcData, vcitData];
  const chartData = [
    portfolioData,
    ...[schcData, vcitData].filter((d) => selectedItems.includes(d.name))
  ];
  const onChangeSelection = (name) => {
    const newSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];
    setSelectedItems(newSelectedItems);
  };

  return (
    <Container height={'100vh'} maxW='container.lg'>
    <Heading marginTop={10}>Soybean Detail</Heading>
      <Legend
        data={legendData}
        selectedItems={selectedItems}
        onChange={onChangeSelection}
      />
      <MultilineChart data={chartData} dimensions={dimensions} />
    </Container>
  );
}
