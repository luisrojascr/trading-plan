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

const defaultData = {
  balance: 0,
  broker: "",
  credit: 0,
  currency: "",
  equity: 0,
  freeMargin: 0,
  investorMode: false,
  leverage: 0,
  login: "",
  margin: 0,
  marginMode: "",
  name: "",
  platform: "",
  server: "",
  tradeAllowed: false,
  type: "",
}

export interface AccountInfoSlice {
  accountData: AccountData
  fetchAccountInfo: () => void
}

export const createAccountInfoSlice: StateCreator<AccountInfoSlice> = (
  set
) => ({
  accountData: defaultData,
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
