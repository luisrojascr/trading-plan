import { Metadata } from "next"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MainNav } from "@/components/main-nav"
import TeamSwitcher from "@/components/team-switcher"
import { UserNav } from "@/components/user-nav"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
}

export default function RiskPlanPage() {
  return (
    <div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Gestión de Riesgo
          </h2>
        </div>
        <Table>
          <TableCaption>
            Maneja tu plan de riesgo inteligentemente. Conoce tus números.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="text-center">Balance Inicial</TableHead>
              <TableHead className="text-center">
                Objetivo Mensual Propuesto %
              </TableHead>
              <TableHead className="text-center">
                Objetivo Mensual Propuesto $
              </TableHead>
              <TableHead className="text-center">
                Porcentaje de Pérdida Diaria Permitido %
              </TableHead>
              <TableHead className="text-center">
                Límite de Pérdida Diaria Max Permitido USD
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Proyección</TableCell>
              <TableCell className="text-center font-medium">$1,000</TableCell>
              <TableCell className="text-center">20%</TableCell>
              <TableCell className="text-center">$200</TableCell>
              <TableCell className="text-center">5%</TableCell>
              <TableCell className="text-center">$50 </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="text-center">Balance Actual</TableHead>
              <TableHead className="text-center">
                Objetivo Mensual Alcanzado %
              </TableHead>
              <TableHead className="text-center">
                Objetivo Mensual Alcanzado $
              </TableHead>
              <TableHead className="text-center">
                Máximo de Pérdida Diaria Alcanzado $
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Cuenta Real</TableCell>
              <TableCell className="text-center font-medium">$1,000</TableCell>
              <TableCell className="text-center">40%</TableCell>
              <TableCell className="text-center">$100</TableCell>
              <TableCell className="text-center">$50</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
