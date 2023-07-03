import { DollarSign, TrendingDown, TrendingUp, Users } from "lucide-react"

import { numberFormat } from "./helpers/number_format"
import { OverviewProps } from "./models/models"
import { OverviewChart } from "./overview-chart"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
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
    })

    return await response.json()
  } catch (err) {
    console.error(err)
  }
}

export async function Overview({ deals, symbols }: any) {
  const accountInfo = await fetchAccountInfo()
  const overviewChart = symbols?.map((symbol: OverviewProps) => ({
    ...symbol,
    ganancia: symbol.profit.toFixed(2),
    perdida: symbol.lost.toFixed(2),
  }))
  const winsAndLostData = [
    {
      name: "Operaciones Ganadas",
      value: +deals
        .filter((deal: any) => deal.status === "win")
        .reduce((acc: any, curr: any) => acc + curr.profit, 0)
        .toFixed(2),
    },
    {
      name: "Operaciones Perdidas",
      value: Math.abs(
        +deals
          .filter((deal: any) => deal.status === "lost")
          .reduce((acc: any, curr: any) => acc + curr.profit, 0)
          .toFixed(2)
      ),
    },
  ]

  const getMonthlyProfit = () => {
    const positiveEntries = deals
      .filter((deal: any) => deal.status === "win")
      .reduce((acc: any, curr: any) => acc + curr.profit, 0)
    return numberFormat(positiveEntries)
  }

  const getMonthlyLosses = () => {
    const negativeEntries = deals
      .map((deal: any) => ({
        ...deal,
        lost: deal.profit < 0 ? deal.profit : 0,
      }))
      .reduce((acc: any, curr: any) => acc + curr.lost, 0)
    return numberFormat(negativeEntries)
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {numberFormat(accountInfo.balance)}
            </div>
            {/* <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Operaciones en el mes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deals?.length}</div>
            {/* <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Operaciones Ganadas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getMonthlyProfit()}</div>
            {/* <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Operaciones Perdidas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getMonthlyLosses()}</div>
            {/* <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p> */}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Rendimiento por Indice </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={overviewChart} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Operaciones Ganadas vs Perdidas</CardTitle>
            {/* <CardDescription>
          You made 265 sales this month.
        </CardDescription> */}
          </CardHeader>
          <CardContent>
            <WinsVsLost data={winsAndLostData} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
