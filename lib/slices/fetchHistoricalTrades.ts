import { StateCreator } from "zustand"

export interface tradesModel {
  accountId: string
  closePrice: number
  closeTime: string
  durationInMinutes: number
  gain: number
  marketValue: number
  openPrice: number
  openTime: string
  pips: number
  positionId: string
  profit: number
  success: string
  symbol: string
  type: string
  volume: number
  _id: string
}

export interface HistoricalTradesSlice {
  trades: tradesModel | []
  fetchHistoricalTrades: () => void
}

export const getHistoricalTradesSlice: StateCreator<HistoricalTradesSlice> = (
  set
) => ({
  trades: [],
  fetchHistoricalTrades: async () => {
    const cuentaRealLis = "26b4718c-1a6d-42f6-8200-9060c890e638"
    const cuentaRealMia = "51bffb5a-1c6f-4ede-92fa-e06df7d82b07"
    const cuentaDemoMia = "877a9b2c-81e0-4f50-91c8-5390b8e41cff"
    const region = "london" // DEMO london
    const offset = 0
    const startTime = "2023-07-01%2023:00:00.000"
    const endTime = "2023-08-01%2023:00:00.000"
    const URL = `https://metastats-api-v1.${region}.agiliumtrade.ai/users/current/accounts/${cuentaRealLis}/historical-trades/${startTime}/${endTime}?offset=${offset}`

    let errorMessage = ""
    try {
      const res = await fetch(URL, {
        method: "GET",
        headers: {
          "auth-token":
            "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIzNDM1NDU5M2ViMTc4YjlkMzBkMmM5OTgzNmMzMjVhNSIsInBlcm1pc3Npb25zIjpbXSwiYWNjZXNzUnVsZXMiOlt7ImlkIjoidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpIiwibWV0aG9kcyI6WyJ0cmFkaW5nLWFjY291bnQtbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoibWV0YWFwaS1yZXN0LWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoibWV0YWFwaS1yZWFsLXRpbWUtc3RyZWFtaW5nLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6Im1ldGFzdGF0cy1hcGkiLCJtZXRob2RzIjpbIm1ldGFzdGF0cy1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoibXQtbWFuYWdlci1hcGkiLCJtZXRob2RzIjpbIm10LW1hbmFnZXItYXBpOnJlc3Q6ZGVhbGluZzoqOioiLCJtdC1tYW5hZ2VyLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19XSwidG9rZW5JZCI6IjIwMjEwMjEzIiwiaW1wZXJzb25hdGVkIjpmYWxzZSwicmVhbFVzZXJJZCI6IjM0MzU0NTkzZWIxNzhiOWQzMGQyYzk5ODM2YzMyNWE1IiwiaWF0IjoxNjkwNzczNzcwfQ.mwKmll8YNbL_YyywwKh82LszvTkHtTyMzAJqepbbFJBtHAuEktDf0OEFwRr_JXxFNgD24kiLFI5YsgtxyaNfz-bnxdb_AsHbakUlYFhEn8xjl_n9mBQbG6s9R5GUav40kDwKcliPlCm4qTjW1-QuCOkvvB81kSoMisX6r_Jl9VYP9GlhXp_RxZ41bly-k61Ku6Bqu_UFEA0FAUEOwL931rG89GcWut7n51nIxvRZTdBp9VzZqzHEEU9-zev0C0Mfeelq6i0cIN7b1aCNRdZFg8KIjNZ7Ntuo2volDaVoVq4oqUUrbKfr-cMcCCTXa8-CnCgX0ts7X6I5xJzIq7FRTed9k5ZZHje15_mTRtXtVqHx_3CgUbdczGyAp5ooaAfmQbeUsNDURRdGEcrOo8pOBE7VmvR7vMQAPmaE39A_uPwVAXVNg1r51Stkk6i3EILrZgx2uFVOMBlPlkBwZWScmIZXieY35qyWGTlLyqLkuMJWPiJtgOw2PI6RapDVCwwbqC1ageRGALQ58BSqBRC45SRgcxL0T1iqGy9RGZcWXl4PHk1BM1gmhoMZW7AsbALTsB-hqC0yEkbAGsVF3iRTCJGfdC6Ral5oVvN0UMCUOW0ay01tUEegJ60frh7JVP37kFhY-zrmF8Hdd2F44G_CbQbyvFc_CdnbJrM5fryxZjI", // process.env.META_API_TOKEN || "",
        },
        referrerPolicy: "no-referrer",
      })
      const response = await res.json()
      const { trades } = response

      console.log("slice trades: ", trades)
      set({ trades })
    } catch (error: any) {
      console.log("historical-trades fetch error: ", error.message)
      errorMessage = error.message
    }
  },
})
