import { StateCreator } from "zustand"

export interface SelectPeriodSlice {
  selectedMonth: string
  selectMonth: (month: string) => void
}

export const selectPeriodSlice: StateCreator<SelectPeriodSlice> = (set) => ({
  selectedMonth: "",
  selectMonth: (month: string) => {
    const updateState = (state: any) => {
      const updatedSelectedMonth = (state.selectedMonth = month)

      return {
        selectedMonth: updatedSelectedMonth,
      }
    }

    set((state: any) => updateState(state))
  },
})
