import { Suspense } from "react"
import { Metadata } from "next"
import Image from "next/image"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { SymbolType } from "@/components/models/symbols"
import { Overview } from "@/components/overview"
import { Results } from "@/components/results/results"
import { Transactions } from "@/components/transactions/transactions"

// This part is important!
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
}

async function makeGETRequest(
  startTime: string,
  endTime: string,
  accountId: string,
  offset: number
) {
  const region = "london" // accountInfo.connections[0].region;
  // const URL = `https://mt-client-api-v1.${region}.agiliumtrade.ai/users/current/accounts/${accountId}/history-deals/time/${startTime}/${endTime}?offset=${offset}`
  const URL = `https://metastats-api-v1.${region}.agiliumtrade.ai/users/current/accounts/${accountId}/historical-trades/${startTime}/${endTime}?offset=${offset}`
  try {
    const res = await fetch(URL, {
      method: "GET",
      headers: {
        "auth-token": process.env.META_API_TOKEN || "",
      },
      referrerPolicy: "no-referrer",
    })

    const response = await res.json()
    const { trades } = response
    return trades
  } catch (error: any) {
    console.log("historical-trades fetch error: ", error.message)
  }
}

async function fetchDeals(accountId: string, fromDate: string, toDate: string) {
  const parsedFromDate = new Date(fromDate)
  const parsedtoDate = new Date(toDate)
  // Ultimos 2 dias
  // const startTime = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  parsedtoDate.setDate(parsedtoDate.getDate() + 1)
  // const startTime = fromDate
  //   ? new Date(parsedFromDate)
  //   : new Date(today.getFullYear(), today.getMonth(), 1)
  // const endTime = toDate ? parsedtoDate : tomorrow // today
  const startTime = "2023-07-01%2023:00:00.000"
  const endTime = "2023-07-31%2023:00:00.000"
  console.log("startTime: ", startTime)
  console.log("endTime: ", endTime)
  let offset = 0
  let data: any = []
  // let newReq: any = []

  let response = await makeGETRequest(startTime, endTime, accountId, offset)
  console.log("response length: ", response.length)
  if (response?.length < 1000) {
    data.push(...response)
  } else {
    do {
      offset += 1000
      const newReq = response
      response = await makeGETRequest(startTime, endTime, accountId, offset)
      data.push(...newReq)
      if (response.length < 1000) {
        data.push(...response)
      }
    } while (response.length === 1000)
  }

  const operations = data.map((deal: any) => {
    return {
      ...deal,
      profit2: deal.profit,
      status: deal.profit >= 0 ? "win" : "lost",
      // swap: deal.swap,
      // type: dealType,
      withdrawal: deal.type === "DEAL_TYPE_BALANCE" ? deal.profit : 0,
    }
  })

  // console.log("operations: ", operations)
  return operations
}

function getSymbols(deals: any) {
  if (deals?.length > 0) {
    return deals
      .map((deal: any) => ({
        ...deal,
        profit: deal.profit >= 0 ? deal.profit : 0,
        lost: deal.profit < 0 ? deal.profit : 0,
      }))
      .reduce(function (acc: any, cur: any) {
        var name = cur.symbol,
          found = acc.find(function (elem: any) {
            return elem.symbol == name
          })
        if (found) found.profit += cur.profit
        if (found) found.lost += cur.lost
        else acc.push(cur)
        return acc
      }, [])
      .map(({ id, symbol, profit, lost }: SymbolType) => ({
        id,
        symbol,
        profit,
        lost,
      }))
  } else {
    return []
  }
}

function getPortfolio(deals: any) {
  if (deals?.length > 0) {
    return deals
      .map(({ symbol }: { symbol: string }) => {
        return symbol
      })
      .reduce(function (prev: { [x: string]: any }, cur: string | number) {
        prev[cur] = (prev[cur] || 0) + 1
        return prev
      }, {})
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const cuentaRealLis = "26b4718c-1a6d-42f6-8200-9060c890e638"
  const cuentaRealMia = "51bffb5a-1c6f-4ede-92fa-e06df7d82b07"
  const cuentaDemoMia = "877a9b2c-81e0-4f50-91c8-5390b8e41cff"
  const selectedFromDate = searchParams?.from ?? ""
  const selectedFrom: string = Array.isArray(selectedFromDate)
    ? selectedFromDate[0]
    : selectedFromDate
  const selectedToDate = searchParams?.to ?? ""
  const selectedTo: string = Array.isArray(selectedToDate)
    ? selectedToDate[0]
    : selectedToDate
  const deals = await fetchDeals(cuentaRealLis, selectedFrom, selectedTo)
  const symbols = await getSymbols(deals)
  const portfolio = await getPortfolio(deals)

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Estadísticas de la cuenta
            </h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              {/* <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button> */}
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Panel Principal</TabsTrigger>
              <TabsTrigger value="transactions">Transacciones</TabsTrigger>
              <TabsTrigger value="results">Resultados</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Suspense fallback={<p>Loading overview...</p>}>
                <Overview
                  deals={deals}
                  symbols={symbols}
                  portfolio={portfolio}
                />
              </Suspense>
            </TabsContent>
            <TabsContent value="transactions" className="space-y-4">
              <h2>
                <strong> Historial</strong>{" "}
              </h2>
              <Transactions data={deals} symbols={symbols} />
            </TabsContent>
            <TabsContent value="results" className="space-y-4">
              <h2>
                <strong>Resultados</strong>{" "}
              </h2>
              <Results symbols={symbols} deals={deals} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
