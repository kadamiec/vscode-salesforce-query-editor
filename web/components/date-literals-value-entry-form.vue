<template>
  <div class="d-flex flex-column">
    <div class="d-flex">
      <div
        class="d-flex flex-column w-100"
        :class="{ 'mr-2': dateLiteral && dateLiteral.includes(':n') }"
      >
        <label>Date Literal</label>
        <select v-model="$v.dateLiteral.$model" @change="onChange">
          <option
            v-for="dateLiteral in dateLiteralsOptions"
            :key="dateLiteral"
            :value="dateLiteral"
          >
            {{ dateLiteral }}
          </option>
        </select>
        <template v-if="$v.dateLiteral.$error">
          <div class="error form-text">Date Literal is Required</div>
        </template>
      </div>
      <div
        v-if="dateLiteral && dateLiteral.includes(':n')"
        class="d-flex flex-column w-100"
      >
        <label>n</label>
        <input v-model="$v.n.$model" type="number" min="0" @change="onChange" />
        <template v-if="$v.n.$error">
          <div class="error form-text">n is Required</div>
        </template>
      </div>
    </div>
    <div v-if="dateLiteral" class="mt-2">
      <p>{{ dateLiterals[dateLiteral].helpText }}</p>
      <br />
      <p>Example: <br />{{ dateLiterals[dateLiteral].example }}</p>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  data: () => {
    return {
      n: null,
      dateLiteral: null,
      dateLiterals: {
        YESTERDAY: {
          value: 'YESTERDAY',
          helpText:
            'Starts 00:00:00 the day before and continues for 24 hours.',
          example: 'SELECT Id FROM Account WHERE CreatedDate = YESTERDAY',
        },
        TODAY: {
          value: 'TODAY',
          helpText:
            'Starts 00:00:00 of the current day and continues for 24 hours.',
          example: 'SELECT Id FROM Account WHERE CreatedDate > TODAY',
        },
        TOMORROW: {
          value: 'TOMORROW',
          helpText:
            'Starts 00:00:00 after the current day and continues for 24 hours.',
          example: 'SELECT Id FROM Opportunity WHERE CloseDate = TOMORROW',
        },
        LAST_WEEK: {
          value: 'LAST_WEEK',
          helpText:
            'Starts 00:00:00 on the first day of the week before the most recent first day of the week and continues for seven full days. Your locale determines the first day of the week.',
          example: 'SELECT Id FROM Account WHERE CreatedDate > LAST_WEEK',
        },
        THIS_WEEK: {
          value: 'THIS_WEEK',
          helpText:
            'Starts 00:00:00 on the most recent first day of the week on or before the current day and continues for seven full days. Your locale determines the first day of the week.',
          example: 'SELECT Id FROM Account WHERE CreatedDate < THIS_WEEK',
        },
        NEXT_WEEK: {
          value: 'NEXT_WEEK',
          helpText:
            'Starts 00:00:00 on the most recent first day of the week after the current day and continues for seven full days. Your locale determines the first day of the week.',
          example: 'SELECT Id FROM Opportunity WHERE CloseDate = NEXT_WEEK',
        },
        LAST_MONTH: {
          value: 'LAST_MONTH',
          helpText:
            'Starts 00:00:00 on the first day of the month before the current day and continues for all the days of that month.',
          example: 'SELECT Id FROM Opportunity WHERE CloseDate > LAST_MONTH',
        },
        THIS_MONTH: {
          value: 'THIS_MONTH',
          helpText:
            'Starts 00:00:00 on the first day of the month that the current day is in and continues for all the days of that month.',
          example: 'SELECT Id FROM Account WHERE CreatedDate < THIS_MONTH',
        },
        NEXT_MONTH: {
          value: 'NEXT_MONTH',
          helpText:
            'Starts 00:00:00 on the first day of the month after the month that the current day is in and continues for all the days of that month.',
          example: 'SELECT Id FROM Opportunity WHERE CloseDate = NEXT_MONTH',
        },
        LAST_90_DAYS: {
          value: 'LAST_90_DAYS',
          helpText:
            'Starts with the current day and continues for the past 90 days.This includes the current day, not just previous days. So it includes 91 days in total.',
          example: 'SELECT Id FROM Account WHERE CreatedDate = LAST_90_DAYS',
        },
        NEXT_90_DAYS: {
          value: 'NEXT_90_DAYS',
          helpText:
            'Starts 00:00:00 of the next day and continues for the next 90 days.',
          example: 'SELECT Id FROM Opportunity WHERE CloseDate > NEXT_90_DAYS',
        },
        'LAST_N_DAYS:n': {
          value: 'LAST_N_DAYS:n',
          helpText:
            'For the number n provided, starts with the current day and continues for the past n days. This includes the current day, not just previous days. For example, LAST_N_DAYS:1 includes yesterday and today.',
          example: 'SELECT Id FROM Account WHERE CreatedDate = LAST_N_DAYS:365',
        },
        'NEXT_N_DAYS:n': {
          value: 'NEXT_N_DAYS:n',
          helpText:
            'For the number n provided, starts 00:00:00 of the next day and continues for the next n days. This does not include the current day. For example, NEXT_N_DAYS:1 is equivalent to TOMORROW.',
          example:
            'SELECT Id FROM Opportunity WHERE CloseDate > NEXT_N_DAYS:15',
        },
        'NEXT_N_WEEKS:n': {
          value: 'NEXT_N_WEEKS:n',
          helpText:
            'For the number n provided, starts 00:00:00 of the first day of the next week and continues for the next n weeks.',
          example:
            'SELECT Id FROM Opportunity WHERE CloseDate > NEXT_N_WEEKS:4',
        },
        'LAST_N_WEEKS:n': {
          value: 'LAST_N_WEEKS:n',
          helpText:
            'For the number n provided, starts 00:00:00 of the last day of the previous week and continues for the past n weeks.',
          example: 'SELECT Id FROM Account WHERE CreatedDate = LAST_N_WEEKS:52',
        },
        'NEXT_N_MONTHS:n': {
          value: 'NEXT_N_MONTHS:n',
          helpText:
            'For the number n provided, starts 00:00:00 of the first day of the next month and continues for the next n months.',
          example:
            'SELECT Id FROM Opportunity WHERE CloseDate > NEXT_N_MONTHS:2',
        },
        'LAST_N_MONTHS:n': {
          value: 'LAST_N_MONTHS:n',
          helpText:
            'For the number n provided, starts 00:00:00 of the last day of the previous month and continues for the past n months.',
          example:
            'SELECT Id FROM Account WHERE CreatedDate = LAST_N_MONTHS:12',
        },
        THIS_QUARTER: {
          value: 'THIS_QUARTER',
          helpText:
            'Starts 00:00:00 of the current quarter and continues to the end of the current quarter.',
          example: 'SELECT Id FROM Account WHERE CreatedDate = THIS_QUARTER',
        },
        LAST_QUARTER: {
          value: 'LAST_QUARTER',
          helpText:
            'Starts 00:00:00 of the previous quarter and continues to the end of that quarter.',
          example: 'SELECT Id FROM Account WHERE CreatedDate > LAST_QUARTER',
        },
        NEXT_QUARTER: {
          value: 'NEXT_QUARTER',
          helpText:
            'Starts 00:00:00 of the next quarter and continues to the end of that quarter.',
          example: 'SELECT Id FROM Account WHERE CreatedDate < NEXT_QUARTER',
        },
        'NEXT_N_QUARTERS:n': {
          value: 'NEXT_N_QUARTERS:n',
          helpText:
            'Starts 00:00:00 of the next quarter and continues to the end of the nth quarter.',
          example:
            'SELECT Id FROM Account WHERE CreatedDate < NEXT_N_QUARTERS:2',
        },
        'LAST_N_QUARTERS:n': {
          value: 'LAST_N_QUARTERS:n',
          helpText:
            'Starts 00:00:00 of the previous quarter and continues to the end of the previous nth quarter.',
          example:
            'SELECT Id FROM Account WHERE CreatedDate > LAST_N_QUARTERS:2',
        },
        THIS_YEAR: {
          value: 'THIS_YEAR',
          helpText:
            'Starts 00:00:00 on January 1 of the current year and continues through the end of December 31 of the current year.',
          example: 'SELECT Id FROM Opportunity WHERE CloseDate = THIS_YEAR',
        },
        LAST_YEAR: {
          value: 'LAST_YEAR',
          helpText:
            'Starts 00:00:00 on January 1 of the previous year and continues through the end of December 31 of that year.',
          example: 'SELECT Id FROM Opportunity WHERE CloseDate > LAST_YEAR',
        },
        NEXT_YEAR: {
          value: 'NEXT_YEAR',
          helpText:
            'Starts 00:00:00 on January 1 of the following year and continues through the end of December 31 of that year.',
          example: 'SELECT Id FROM Opportunity WHERE CloseDate < NEXT_YEAR',
        },
        'NEXT_N_YEARS:n': {
          value: 'NEXT_N_YEARS:n',
          helpText:
            'Starts 00:00:00 on January 1 of the following year and continues through the end of December 31 of the nth year.',
          example:
            'SELECT Id FROM Opportunity WHERE CloseDate < NEXT_N_YEARS:5',
        },
        'LAST_N_YEARS:n': {
          value: 'LAST_N_YEARS:n',
          helpText:
            'Starts 00:00:00 on January 1 of the previous year and continues through the end of December 31 of the previous nth year.',
          example:
            'SELECT Id FROM Opportunity WHERE CloseDate > LAST_N_YEARS:5',
        },
        THIS_FISCAL_QUARTER: {
          value: 'THIS_FISCAL_QUARTER',
          helpText:
            'Starts 00:00:00 on the first day of the current fiscal quarter and continues through the end of the last day of the fiscal quarter. The fiscal year is defined on the Fiscal Year page in Setup.',
          example:
            'SELECT Id FROM Account WHERE CreatedDate = THIS_FISCAL_QUARTER',
        },
        LAST_FISCAL_QUARTER: {
          value: 'LAST_FISCAL_QUARTER',
          helpText:
            'Starts 00:00:00 on the first day of the last fiscal quarter and continues through the end of the last day of that fiscal quarter. The fiscal year is defined on the Fiscal Year page in Setup.',
          example:
            'SELECT Id FROM Account WHERE CreatedDate > LAST_FISCAL_QUARTER',
        },
        NEXT_FISCAL_QUARTER: {
          value: 'NEXT_FISCAL_QUARTER',
          helpText:
            'Starts 00:00:00 on the first day of the next fiscal quarter and continues through the end of the last day of that fiscal quarter. The fiscal year is defined on the Fiscal Year page in Setup.',
          example:
            'SELECT Id FROM Account WHERE CreatedDate < NEXT_FISCAL_QUARTER',
        },
        'NEXT_N_FISCAL_​QUARTERS:n': {
          value: 'NEXT_N_FISCAL_​QUARTERS:n',
          helpText:
            'Starts 00:00:00 on the first day of the next fiscal quarter and continues through the end of the last day of the nth fiscal quarter. The fiscal year is defined on the Fiscal Year page in Setup.',
          example:
            'SELECT Id FROM Account WHERE CreatedDate < NEXT_N_FISCAL_QUARTERS:6',
        },
        'LAST_N_FISCAL_​QUARTERS:n': {
          value: 'LAST_N_FISCAL_​QUARTERS:n',
          helpText:
            'Starts 00:00:00 on the first day of the last fiscal quarter and continues through the end of the last day of the previous nth fiscal quarter. The fiscal year is defined on the Fiscal Year page in Setup.',
          example:
            'SELECT Id FROM Account WHERE CreatedDate > LAST_N_FISCAL_QUARTERS:6',
        },
        THIS_FISCAL_YEAR: {
          value: 'THIS_FISCAL_YEAR',
          helpText:
            'Starts 00:00:00 on the first day of the current fiscal year and continues through the end of the last day of the fiscal year. The fiscal year is defined on the Fiscal Year page in Setup.',
          example:
            'SELECT Id FROM Opportunity WHERE CloseDate = THIS_FISCAL_YEAR',
        },
        LAST_FISCAL_YEAR: {
          value: 'LAST_FISCAL_YEAR',
          helpText:
            'Starts 00:00:00 on the first day of the last fiscal year and continues through the end of the last day of that fiscal year. The fiscal year is defined on the Fiscal Year page in Setup.',
          example:
            'SELECT Id FROM Opportunity WHERE CloseDate > LAST_FISCAL_YEAR',
        },
        NEXT_FISCAL_YEAR: {
          value: 'NEXT_FISCAL_YEAR',
          helpText:
            'Starts 00:00:00 on the first day of the next fiscal year and continues through the end of the last day of that fiscal year. The fiscal year is defined on the Fiscal Year page in Setup.',
          example:
            'SELECT Id FROM Opportunity WHERE CloseDate < NEXT_FISCAL_YEAR',
        },
        'NEXT_N_FISCAL_​YEARS:n': {
          value: 'NEXT_N_FISCAL_​YEARS:n',
          helpText:
            'Starts 00:00:00 on the first day of the next fiscal year and continues through the end of the last day of the nth fiscal year. The fiscal year is defined on the Fiscal Year page in Setup.',
          example:
            'SELECT Id FROM Opportunity WHERE CloseDate < NEXT_N_FISCAL_YEARS:3',
        },
        'LAST_N_FISCAL_​YEARS:n': {
          value: 'LAST_N_FISCAL_​YEARS:n',
          helpText:
            'Starts 00:00:00 on the first day of the last fiscal year and continues through the end of the last day of the previous nth fiscal year. The fiscal year is defined on the Fiscal Year page in Setup.',
          example:
            'SELECT Id FROM Opportunity WHERE CloseDate > LAST_N_FISCAL_YEARS:3',
        },
      },
    }
  },
  validations() {
    if (this.dateLiteral && this.dateLiteral.includes(':n')) {
      return {
        dateLiteral: {
          required,
        },
        n: {
          required,
        },
      }
    } else {
      return {
        dateLiteral: {
          required,
        },
      }
    }
  },
  computed: {
    computedValue() {
      return this.dateLiteral.replace('n', this.n)
    },
    dateLiteralsOptions() {
      return Object.keys(this.dateLiterals)
    },
  },
  methods: {
    onClickClose() {
      this.$emit('close')
    },
    onChange() {
      this.$emit('input', this.computedValue)
    },
  },
}
</script>

<style scoped>
input,
select {
  height: 30px !important;
  width: 100%;
}
</style>
