export interface Item {
  disabled: boolean
  weekDay: number
  isWeekend?: boolean
  selected?: boolean
  display: number
  inRange: boolean
  key: string
  value: Date
}
