import { Suspense } from "react"
import { Metadata } from "next"
import Image from "next/image"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { MainNav } from "@/components/main-nav"
import { OverviewProps } from "@/components/models/models"
import { Overview } from "@/components/overview"
import { OverviewLoading } from "@/components/overview-loading"
import { Results } from "@/components/results/results"
import { RiskManagement } from "@/components/risk-management"
import TeamSwitcher from "@/components/team-switcher"
import { Transactions } from "@/components/transactions/transactions"
import { UserNav } from "@/components/user-nav"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
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
      .map(({ id, symbol, profit, lost }: OverviewProps) => ({
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

export default async function DashboardPage() {
  const deals = await fetchDeals()
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
