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

async function fetchDeals(fromDate: string, toDate: string) {
  const region = "singapore" // DEMO london
  const accountId = "51bffb5a-1c6f-4ede-92fa-e06df7d82b07" // DEMO "877a9b2c-81e0-4f50-91c8-5390b8e41cff"
  const parsedFromDate = new Date(fromDate)
  const parsedtoDate = new Date(toDate)
  // Ultimos 2 dias
  // const startTime = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  var today = new Date()
  const startTime = fromDate
    ? new Date(parsedFromDate)
    : new Date(today.getFullYear(), today.getMonth(), 1)
  const endTime = toDate ? parsedtoDate : today // today
  console.log("==========")
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
  const selectedFromDate = searchParams?.from ?? ""
  const selectedFrom: string = Array.isArray(selectedFromDate)
    ? selectedFromDate[0]
    : selectedFromDate
  const selectedToDate = searchParams?.to ?? ""
  const selectedTo: string = Array.isArray(selectedToDate)
    ? selectedToDate[0]
    : selectedToDate
  const deals = await fetchDeals(selectedFrom, selectedTo)
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
        {/* <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div> */}
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Plan de Trading
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
