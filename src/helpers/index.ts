import type { ComputedRef } from "vue";

interface Params {
  day: number;
  year: ComputedRef<number>;
  month: ComputedRef<number>;
  current: Date;
}
export const compareDay = (params: Params) => {
  return new Date(params.year.value, params.month.value, params.day).getDate() < params.current.getDate()
    ? 'disabled'
    : new Date(params.year.value, params.month.value, params.day).getDate() > params.current.getDate()
    ? 'enabled'
    : params.month.value === params.current.getMonth() ? 'selected' : 'enabled'
}

export const formatX2 = (num: number) => {
  return num > 9 ? num : `0${num}`
}

export const compareMonth = (month: number, current: Date) => {
  return month > current.getMonth() ? 'more' : month === current.getMonth() ? 'equal' : 'less'
}
