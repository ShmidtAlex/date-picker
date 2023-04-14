import { computed, type ComputedRef } from 'vue'
import { WEEK_DAYS } from '@/constants'
import type { Item } from '@/types'

export default function useCountRests(currentMonthItems: ComputedRef<Item[]>) {
  const lastPreviousMonthWeekDay = computed(() => {
    if (currentMonthItems.value[0].weekDay > 0) {
      return currentMonthItems.value[0].weekDay - 1
    } else {
      return 6
    }
  })
  const restOfWeekDays = computed(() => {
    if (currentMonthItems.value[currentMonthItems.value.length - 1].weekDay > 0) {
      return WEEK_DAYS.length - currentMonthItems.value[currentMonthItems.value.length - 1].weekDay
    } else {
      return 0
    }
  })
  return [lastPreviousMonthWeekDay, restOfWeekDays]
}
