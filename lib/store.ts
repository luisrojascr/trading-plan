import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
  AccountInfoSlice,
  createAccountInfoSlice,
} from "./slices/createAccountInfo"
import { SelectPeriodSlice, selectPeriodSlice } from "./slices/selectPeriod"

type StoreState = AccountInfoSlice & SelectPeriodSlice

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createAccountInfoSlice(...a),
      ...selectPeriodSlice(...a),
    }),
    {
      name: "period-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
