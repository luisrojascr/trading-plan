"use client"

import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts"

// const data = [
//   { name: "Operaciones Ganadas", value: 400 },
//   { name: "Operaciones Perdidas", value: 300 },
// ]

const COLORS = ["#3ad69d", "#f46a6a"]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function WinsVsLost({ data }: any) {
  return (
    <PieChart width={600} height={400}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry: any, index: number) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      {/* <Tooltip content={<CustomTooltip />} /> */}
      <Legend />
    </PieChart>
  )
}
