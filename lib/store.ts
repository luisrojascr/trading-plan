import { create } from "zustand"

import {
  AccountInfoSlice,
  createAccountInfoSlice,
} from "./slices/createAccountInfo"

type StoreState = AccountInfoSlice

export const useAppStore = create<StoreState>()((...a) => ({
  ...createAccountInfoSlice(...a),
}))
