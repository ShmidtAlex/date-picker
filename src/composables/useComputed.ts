import { computed, type ComputedRef, type Ref } from 'vue'
import { formatX2 } from '@/helpers'
import type { Item } from "@/types";

interface ComputedParams {
  previousMonthDays: Ref<number[]>
  lastPreviousMonthWeekDay: ComputedRef<number>
  restOfWeekDays: ComputedRef<number>
  getDaysInPreviousMonth: ComputedRef<number>
  nextMonthDays: Ref<number[]>
  compCurrentYear: ComputedRef<number>
  compCurrentMonth: ComputedRef<number>
}
export default function useComputed(params: ComputedParams) {
  const previousMonthItems = computed((): Item[] => {
    return params.previousMonthDays.value
      .map((day: number) => {
        const weekDay = new Date(
          params.compCurrentYear.value,
          params.compCurrentMonth.value,
          day
        ).getDay()
        return {
          disabled: true,
          weekDay: weekDay,
          display: day,
          inRange: false,
          key: `${params.compCurrentYear.value}-${formatX2(
            params.compCurrentMonth.value
          )}-${formatX2(day)}`,
          value: new Date(params.compCurrentYear.value, params.compCurrentMonth.value, day)
        }
      })
      .slice(params.getDaysInPreviousMonth.value - params.lastPreviousMonthWeekDay.value)
  })
  const nextMonthItems = computed((): Item[] => {
    return params.nextMonthDays.value
      .map((day: number) => {
        const weekDay = new Date(
          params.compCurrentYear.value,
          params.compCurrentMonth.value,
          day
        ).getDay()
        return {
          disabled: true,
          weekDay: weekDay,
          display: day,
          inRange: false,
          key: `${params.compCurrentYear.value}-${formatX2(
            params.compCurrentMonth.value + 2
          )}-${formatX2(day)}`,
          value: new Date(params.compCurrentYear.value, params.compCurrentMonth.value + 2, day)
        }
      })
      .slice(0, params.restOfWeekDays.value)
  })
  return [previousMonthItems, nextMonthItems]
}
