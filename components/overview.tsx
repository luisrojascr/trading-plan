import { DollarSign, TrendingDown, TrendingUp, Users } from "lucide-react"

import { numberFormat } from "./helpers/number_format"
import { OverviewProps } from "./models/models"
import { OverviewChart } from "./overview-chart"
import { Portfolio } from "./portafolio"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { WinsVsLost } from "./wins-vs-lost"

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

export async function Overview({ deals, symbols, portfolio }: any) {
  const accountInfo = await fetchAccountInfo()
  const overviewChart = symbols?.map((symbol: OverviewProps) => ({
    ...symbol,
    ganancia: symbol.profit.toFixed(2),
    perdida: symbol.lost.toFixed(2),
  }))
  const winsAndLostData = [
    {
      name: "Trades Ganados",
      value: +deals
        .filter((deal: any) => deal.status === "win")
        .reduce((acc: any, curr: any) => acc + curr.profit, 0)
        .toFixed(2),
    },
    {
      name: "Trades Perdidos",
      value: Math.abs(
        +deals
          .filter((deal: any) => deal.status === "lost")
          .reduce((acc: any, curr: any) => acc + curr.profit, 0)
          .toFixed(2)
      ),
    },
  ]

  const portfolioChart = Object.entries(portfolio).map(([key, val]) => ({
    name: key,
    value: val,
  }))

  const monthlyProfit = getMonthlyProfit(deals)
  const monthlyLoss = getMonthlyLosses(deals)
  const allSwap = await getSwap(deals).toFixed(2)
  const netProfit = monthlyProfit + monthlyLoss - -allSwap

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Balance de la cuenta
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-center text-2xl font-bold">
              {numberFormat(accountInfo.balance)}
            </p>
            <p className="text-center text-xs text-muted-foreground">
              +$637.20 del capital inicial
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Número de Operaciones
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-center text-2xl font-bold">{deals?.length}</p>
            {/* <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Operaciones con Beneficio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-center text-2xl font-bold text-green-500">
              {deals.filter((deal: any) => deal.status === "win").length}
            </p>
            {/* <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Operaciones con Pérdida
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-center text-2xl font-bold text-red-500">
              {deals.filter((deal: any) => deal.status === "lost").length}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rentabilidad</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-center text-4xl font-bold text-green-500">
              {((netProfit * 100) / (accountInfo.balance - netProfit)).toFixed(
                2
              )}
              %
            </p>
            {/* <p className="text-center text-xs text-muted-foreground">
              +3% del mes anterior
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancia Neta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-center text-2xl font-bold text-green-500">
              {numberFormat(netProfit)}
            </p>
            <p className="text-center text-xs text-muted-foreground">
              Beneficio Bruto - Pérdidas - Swap
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-center text-2xl font-bold text-green-500">
              {numberFormat(monthlyProfit)}
            </p>
            {/* <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pérdida</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-center text-2xl font-bold text-red-500">
              {numberFormat(monthlyLoss)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Swap</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-center text-2xl font-bold text-red-500">
              {numberFormat(allSwap)}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Rendimiento por Indice </CardTitle>
            <CardDescription>
              Rendimiento en dólares por cada índice
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={overviewChart} />
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Portafolio</CardTitle>
            <CardDescription>
              Número de operaciones por cada índice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Portfolio data={portfolioChart} />
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Operaciones Ganadas vs Operaciones Perdidas </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <WinsVsLost data={winsAndLostData} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
