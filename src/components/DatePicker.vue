<template>
  <div class="picker" @mousedown.prevent>
    <div class="picker__heading">
      <button
        id="left-arrow"
        class="picker__heading-button"
        @click.stop.prevent="decreaseMonth"
      ></button>
      <h3>{{ currentMonthName }} {{ currentYear }}</h3>
      <button
        id="right-arrow"
        class="picker__heading-button"
        @click.stop.prevent="increaseMonth"
      ></button>
    </div>
    <div class="picker__body">
      <div class="picker__body-subheading">
        <span class="picker__body-subheading--elements" v-for="day in WEEK_DAYS" :key="day">
          {{ day }}
        </span>
      </div>
      <hr class="picker__body-divider" />
      <div class="picker__body-elements">
        <input
          type="button"
          v-for="item in items"
          :key="item.key"
          :disabled="item.disabled"
          class="picker__body-elements--button"
          :class="{
            'in-range': item.inRange,
            'non-in-range': !item.inRange,
            enabled: !item.disabled,
            selected: item.selected
          }"
          @click="updateCurrentData(item)"
          :value="item.display"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'
import type { Item } from '@/types'
import { MONTHS, WEEK_DAYS } from '@/constants'
import { compareDay, formatX2, compareMonth } from '@/helpers'
import useCountRests from '@/composables/useCountRests'
import useComputed from '@/composables/useComputed'

const props = defineProps({
  selected: {
    type: Date as PropType<Date>,
    required: true
  },
  currentMonth: {
    type: Number as PropType<number>,
    required: true
  },
  currentYear: {
    type: Number as PropType<number>,
    required: true
  },
  currentDate: {
    type: Date as PropType<Date>,
    required: true
  }
})
const emit = defineEmits(['monthForward', 'monthBack', 'update'])
const decreaseMonth = () => {
  resetMainOptions()
  emit('monthBack', props.currentMonth - 1)
}
const increaseMonth = () => {
  resetMainOptions()
  emit('monthForward', props.currentMonth + 1)
}
const resetMainOptions = (): void => {
  currentMonthDays.value = []
  previousMonthDays.value = []
  nextMonthDays.value = []
}

const currentMonthName = computed(() => {
  return MONTHS[props.currentMonth]
})

const currentMonthDays = ref<number[]>([])
const previousMonthDays = ref<number[]>([])
const nextMonthDays = ref<number[]>([])

const getDaysInMonth = computed((): number => {
  return new Date(props.currentYear, props.currentMonth + 1, 0).getDate()
})
const getDaysInPreviousMonth = computed(() => {
  return new Date(props.currentYear, props.currentMonth, 0).getDate()
})
const getDaysInNextMonth = computed((): number => {
  return new Date(props.currentYear, props.currentMonth + 2, 0).getDate()
})

watch(
  currentMonthName,
  () => {
    for (let i = 0; i < getDaysInMonth.value; i++) {
      currentMonthDays.value.push(i + 1)
    }
    for (let i = 0; i < getDaysInPreviousMonth.value; i++) {
      previousMonthDays.value.push(i + 1)
    }
    for (let i = 0; i < getDaysInNextMonth.value; i++) {
      nextMonthDays.value.push(i + 1)
    }
  },
  { immediate: true }
)
const compCurrentYear = computed(() => {
  return props.currentYear
})
const compCurrentMonth = computed(() => {
  return props.currentMonth
})
const compareDayOptions = {
  year: compCurrentYear,
  month: compCurrentMonth,
  current: props.currentDate
}
const currentMonthItems = computed(() => {
  return currentMonthDays.value.map((day) => {
    return {
      disabled: compareMonth(props.currentMonth, props.currentDate) === 'equal'
        ? compareDay({ day: day, ...compareDayOptions }) === 'disabled'
        : compareMonth(props.currentMonth, props.currentDate) !== 'more',
      weekDay: new Date(props.currentYear, props.currentMonth, day).getDay(),
      display: day,
      inRange: true,
      selected: compareMonth(props.currentMonth, props.currentDate)
        ? compareDay({ day: day, ...compareDayOptions }) === 'selected'
        : false,
      key: `${props.currentYear}-${formatX2(props.currentMonth + 1)}-${formatX2(day)}`,
      value: new Date(props.currentYear, props.currentMonth, day)
    }
  })
})
// todo: check disableability of previous dates - they shouldn't be available

const [lastPreviousMonthWeekDay, restOfWeekDays] = useCountRests(currentMonthItems)
const computedOptions = {
  previousMonthDays,
  lastPreviousMonthWeekDay,
  getDaysInPreviousMonth,
  nextMonthDays,
  restOfWeekDays,
  compCurrentYear,
  compCurrentMonth
}
const [previousMonthItems, nextMonthItems] = useComputed(computedOptions)

const items = computed(() => {
  return [...previousMonthItems.value, ...currentMonthItems.value, ...nextMonthItems.value]
})

const updateCurrentData = (item: Item) => {
  emit('update', item)
}
</script>

<style lang="scss" scoped>
.picker {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  top: 25px;
  width: 300px;
  height: 300px;
  border: 1px solid lightgray;
  border-radius: 4px;
  box-shadow: 3px 3px 3px 0 rgba(0, 0, 0, 0.3);
  &__heading {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 15%;
    padding: 0 8px;
    &-button {
      width: 30px;
      height: 30px;
      border: 1px solid lightgray;
      background-color: white;
      outline: none;
      border-radius: 4px;
      &:hover {
        background-color: lightgray;
      }
    }
    #left-arrow {
      background-image: url('../assets/left-arrow.svg');
    }
    #right-arrow {
      background-image: url('../assets/right-arrow.svg');
    }
  }
  &__body {
    @extend .picker__heading;
    height: 85%;
    flex-direction: column;
    &-subheading {
      width: 100%;
      height: 10%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      &--elements {
        display: flex;
        justify-content: center;
        width: 30px;
      }
    }
    &-divider {
      width: 100%;
      height: 1px;
      border: 1px solid lightgray;
      border-radius: 3px;
    }
    &-elements {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      height: 90%;
      width: 100%;
      padding: 0 8px;
      &--button {
        height: 30px;
        width: 30px;
        margin: 4px;
        border: none;
        outline: none;
        border-radius: 4px;
        color: gainsboro;
      }
      .in-range {
        color: dimgrey;
        &:hover {
          color: seagreen;
          border: 1px solid seagreen;
        }
      }
      .non-in-range {
        color: darkgray;
        background-color: white;
      }
      .enabled {
        color: #282828;
      }
      .selected {
        color: seagreen;
        border: 1px solid seagreen;
      }
    }
  }
}
</style>
