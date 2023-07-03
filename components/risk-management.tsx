"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

export function RiskManagement() {
  return (
    <div>
      <Table>
        <TableCaption>
          Maneja tu plan de riesgo inteligentemente. Conoce tus números.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead className="text-center">Balance</TableHead>
            <TableHead className="text-center">Objetivo Mensual %</TableHead>
            <TableHead className="text-center">Objetivo Mensual $</TableHead>
            <TableHead className="text-center">
              Porcentaje de Pérdida Diaria Permitido %
            </TableHead>
            <TableHead className="text-center">
              Pérdida Diaria Max Permitido USD
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Proyección</TableCell>
            <TableCell className="font-medium">$1,000</TableCell>
            <TableCell className="text-center">40%</TableCell>
            <TableCell className="text-center">$100</TableCell>
            <TableCell className="text-center">5%</TableCell>
            <TableCell className="text-center">$50 </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Real</TableCell>
            <TableCell className="font-medium">$1,000</TableCell>
            <TableCell className="text-center">40%</TableCell>
            <TableCell className="text-center">$100</TableCell>
            <TableCell className="text-center">5%</TableCell>
            <TableCell className="text-center">$50 </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
