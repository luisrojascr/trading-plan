import { StateCreator } from "zustand"

export interface AccountData {
  balance: number
  broker: string
  credit: number
  currency: string
  equity: number
  freeMargin: number
  investorMode: boolean
  leverage: number
  login: string
  margin: number
  marginMode: string
  name: string
  platform: string
  server: string
  tradeAllowed: boolean
  type: string
}

export interface AccountInfoSlice {
  accountData: AccountData
  fetchAccountInfo: () => void
}

export const createAccountInfoSlice: StateCreator<AccountInfoSlice> = (
  set
) => ({
  accountData: {},
  fetchAccountInfo: async () => {
    const region = "london"
    const accountId = "877a9b2c-81e0-4f50-91c8-5390b8e41cff"
    const URL = `https://mt-client-api-v1.${region}.agiliumtrade.ai/users/current/accounts/${accountId}/account-information`

    try {
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          "auth-token": `${process.env.META_API_TOKEN}`,
        },
        referrerPolicy: "no-referrer",
      })

      set({ accountData: await response.json() })
    } catch (err) {
      console.error(err)
    }
  },
})
