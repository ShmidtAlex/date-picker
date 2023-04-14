import type { ComputedRef } from 'vue'

interface Params {
  day: number
  year: ComputedRef<number>
  month: ComputedRef<number>
  current: ComputedRef<Date>
  selected: ComputedRef<Date>
}
export const isSelected = (params: Params) => {
  return (
    new Date(params.year.value, params.month.value, params.day).toLocaleString() ===
    new Date(
      params.selected.value.getFullYear(),
      params.selected.value.getMonth(),
      params.selected.value.getDate()
    ).toLocaleString()
  )
}

export const formatX2 = (num: number) => {
  return num > 9 ? num : `0${num}`
}

export const compareMonth = (month: number, current: Date) => {
  return month > current.getMonth() ? 'more' : month === current.getMonth() ? 'equal' : 'less'
}

export const compareDates = (params: Params) => {
  return (
    new Date(params.year.value, params.month.value, params.day).valueOf() <
    new Date(
      params.current.value.getFullYear(),
      params.current.value.getMonth(),
      params.current.value.getDate()
    ).valueOf()
  )
}
