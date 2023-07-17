"use server"

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
import { numberFormat } from "@/components/helpers/number_format"
import { MonthPickerDemo } from "@/components/risk-plan-month-picker"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
}

async function fetchAccountInfo() {
  const region = "london"
  const accountId = "877a9b2c-81e0-4f50-91c8-5390b8e41cff"
  const URL = `https://mt-client-api-v1.${region}.agiliumtrade.ai/users/current/accounts/${accountId}/account-information`
  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        "auth-token": process.env.META_API_TOKEN || "",
      },
      referrerPolicy: "no-referrer",
      next: { revalidate: 10 },
    })

    return await response.json()
  } catch (err) {
    console.error(err)
  }
}

async function fetchDeals() {
  const region = "london"
  const accountId = "877a9b2c-81e0-4f50-91c8-5390b8e41cff"
  // Ultimos 2 dias
  // const startTime = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  var currentDate = new Date()
  const startTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )
  const endTime = currentDate // today
  const URL = `https://mt-client-api-v1.${region}.agiliumtrade.ai/users/current/accounts/${accountId}/history-deals/time/${startTime}/${endTime}`
  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        "auth-token": process.env.META_API_TOKEN || "",
      },
      referrerPolicy: "no-referrer",
    })

    const data = await response.json()
    const operations = data
      .filter((deal: any) => deal.entryType == "DEAL_ENTRY_OUT")
      .map((deal: any) => ({
        ...deal,
        profit2: deal.profit,
        status: deal.profit >= 0 ? "win" : "lost",
        swap: deal.swap,
        type: deal.type === "DEAL_TYPE_BUY" ? "Sell" : "Buy",
      }))

    return operations
  } catch (err) {
    console.error(err)
  }
}

const getMonthlyProfit = (deals: any) => {
  return deals
    .filter((deal: any) => deal.status === "win")
    .reduce((acc: any, curr: any) => acc + curr.profit, 0)
}

const getMonthlyLosses = (deals: any) => {
  return deals
    .map((deal: any) => ({
      ...deal,
      lost: deal.profit < 0 ? deal.profit : 0,
    }))
    .reduce((acc: any, curr: any) => acc + curr.lost, 0)
}

function getSwap(deals: any) {
  if (deals?.length > 0) {
    return deals
      .map(({ swap }: { swap: number }) => {
        return swap
      })
      .reduce(function (prev: number, cur: number) {
        return prev + cur
      }, 0)
  }
}

async function handleMonthChange(month: Date) {
  "use server"
  console.log("page month: ", month)
}

export default async function RiskPlanPage() {
  const accountInfo = await fetchAccountInfo()
  const deals = await fetchDeals()
  const monthlyProfit = getMonthlyProfit(deals)
  const monthlyLoss = getMonthlyLosses(deals)
  const allSwap = await getSwap(deals).toFixed(2)
  const netProfit = monthlyProfit + monthlyLoss - -allSwap

  // const { fetchAccountInfo, accountData } = useAppStore()

  return (
    <div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Gestión de Riesgo
          </h2>
          <div className="flex items-center space-x-2">
            <MonthPickerDemo handleMonthChange={handleMonthChange} />
          </div>
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
                Objetivo Mensual Alcanzado $ (ganancia neta)
              </TableHead>
              <TableHead className="text-center">
                Pérdida Total Mensual $
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Cuenta Real</TableCell>
              <TableCell className="text-center font-medium">
                {numberFormat(accountInfo?.equity)}
              </TableCell>
              <TableCell className="text-center">
                {(
                  (netProfit * 100) /
                  (accountInfo.balance - netProfit)
                ).toFixed(2)}
                %
              </TableCell>
              <TableCell className="text-center">
                {numberFormat(netProfit)}
              </TableCell>
              <TableCell className="text-center">
                {numberFormat(monthlyLoss)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
