import { computed, type ComputedRef, type Ref } from 'vue'
import { formatX2 } from '@/helpers'

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
  const previousMonthItems = computed(() => {
    return params.previousMonthDays.value
      .map((day: number) => {
        return {
          disabled: true,
          weekDay: new Date(
            params.compCurrentYear.value,
            params.compCurrentMonth.value,
            day
          ).getDay(),
          display: day,
          inRange: false,
          key: `${params.compCurrentYear}-${formatX2(params.compCurrentMonth.value)}-${formatX2(
            day
          )}`,
          value: new Date(params.compCurrentYear.value, params.compCurrentMonth.value, day)
        }
      })
      .slice(params.getDaysInPreviousMonth.value - params.lastPreviousMonthWeekDay.value)
  })
  const nextMonthItems = computed(() => {
    return params.nextMonthDays.value
      .map((day: number) => {
        return {
          disabled: true,
          weekDay: new Date(
            params.compCurrentYear.value,
            params.compCurrentMonth.value + 2,
            day
          ).getDay(),
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
