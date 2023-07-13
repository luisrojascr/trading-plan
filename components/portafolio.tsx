"use client"

import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts"

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
]

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#008921",
  "#00FF22",
  "#FF2200",
  "#00FFF2",
  "#FF0099",
  "#FFFF00",
  "#FF5533",
]

export function Portfolio({ data }: any) {
  return (
    <PieChart width={400} height={400}>
      <Pie
        dataKey="value"
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {data.map((entry: any, index: number) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  )
}
