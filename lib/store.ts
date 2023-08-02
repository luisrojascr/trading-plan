import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
  HistoricalTradesSlice,
  getHistoricalTradesSlice,
} from "./slices/fetchHistoricalTrades"
import { SelectPeriodSlice, selectPeriodSlice } from "./slices/selectPeriod"

type StoreState = SelectPeriodSlice & HistoricalTradesSlice

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...getHistoricalTradesSlice(...a),
      ...selectPeriodSlice(...a),
    }),
    {
      name: "period-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
