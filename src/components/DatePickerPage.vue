<template>
  <div class="datepicker">
    <input
        type="text"
        ref="inputRef"
        readonly
        v-model="inputValue"
        placeholder="click to opt date"
        @focus="showCalendar"
        @blur="hideCalendar"
    />
    <DatePicker
        v-show="isDatePicker"
        :currentMonth="currentMonth"
        :current-year="currentYear"
        :selected="currentDate"
        :current-date="currentDate"
        @monthBack="monthBack"
        @monthForward="monthForward"
        @update="updateCurrentData"
    />
  </div>

</template>

<script setup lang="ts">
  import DatePicker from './DatePicker.vue'
  import type { Item } from '@/types'
  import {computed, ref} from "vue";

  const inputRef = ref(null)
  const isDatePicker = ref(false)
  const inputValue = ref('')
  const currentDate = ref<Date>(new Date())

  const newCurrentYear = ref<number | null>(null);
  const newCurrentMonth = ref<number | null>(null);
  const currentYear = computed(() => {
    return newCurrentYear.value !== null ? newCurrentYear.value : currentDate.value.getFullYear();
  })
  const currentMonth = computed(() => {
    return newCurrentMonth.value !== null ? newCurrentMonth.value : currentDate.value.getMonth();
  });

  const showCalendar = (): void => {
    isDatePicker.value = true;
  };

  const hideCalendar = (): void => {
    isDatePicker.value = false;
  }

  const monthBack = (month: number): void => {
    if (month >= 0) {
      newCurrentMonth.value = month
    } else {
      newCurrentMonth.value = 11
      newCurrentYear.value = newCurrentYear.value !== null ? newCurrentYear.value -1 : currentDate.value.getFullYear() - 1
    }
  }
  const monthForward = (month: number): void => {
    if (month < 12) {
      newCurrentMonth.value = month

    } else {
      newCurrentMonth.value = 0
      newCurrentYear.value = newCurrentYear.value !== null ? newCurrentYear.value +1 : currentDate.value.getFullYear() + 1
    }
  }
  const updateCurrentData = (item: Item) => {
    inputValue.value = item.key
    if (inputRef.value !== null) {
      hideCalendar()
    }

  }
</script>

<style lang="scss">
  .datepicker {
    position: relative;
  }
</style>