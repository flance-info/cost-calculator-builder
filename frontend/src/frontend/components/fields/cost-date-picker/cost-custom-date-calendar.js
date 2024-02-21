import DateFormatter from 'php-date-formatter';
import fieldsMixin from '../fieldsMixin';
import moment from 'moment';

export default {
  mixins: [fieldsMixin],
  props: {
    dateField: {
      type: Object,
      required: true,
      default: {},
    },
    index: [Number],
    is_preview: false,
    value: {
      default: '',
    },
  },
  data: () => ({
    calculatorId: 0,
    dayList: [],
    errors: [],
    openDate: false,
    selectedDate: {
      start: null,
      end: null,
      range: 0,
      value: 0,
    },
  }),
  computed: {
    dateFormat() {
      return this.$store.getters.getDateFormat
        ? this.$store.getters.getDateFormat
        : 'M j, Y';
    },

    language() {
      return this.$store.getters.getLanguage;
    },

    today() {
      return moment().startOf('date');
    },

    translations() {
      return this.$store.getters.getTranslations;
    },

    /** get unselectable days from current date (now) if is enabled **/
    daysFromCurrentDate() {
      if (
        this.dateField.hasOwnProperty('days_from_current') &&
        this.dateField.days_from_current !== 0
      ) {
        return moment()
          .startOf('date')
          .set(
            'date',
            moment().startOf('date').date() +
              parseInt(this.dateField.days_from_current)
          );
      }
      return null;
    },

    /** get unselectable date period,if is enabled **/
    periodDates() {
      if (
        this.dateField.hasOwnProperty('not_allowed_dates') &&
        this.dateField.not_allowed_dates.hasOwnProperty('period')
      ) {
        let start = null;
        let end = null;

        if (
          this.dateField.not_allowed_dates.period.hasOwnProperty('start') &&
          this.dateField.not_allowed_dates.period.start !== null
        ) {
          start = moment(
            this.dateField.not_allowed_dates.period.start,
            'DD/MM/YYYY',
            true
          );
        }
        if (
          this.dateField.not_allowed_dates.period.hasOwnProperty('end') &&
          this.dateField.not_allowed_dates.period.end !== null
        ) {
          end = moment(
            this.dateField.not_allowed_dates.period.end,
            'DD/MM/YYYY',
            true
          );
        }
        return { start: start, end: end };
      }

      return null;
    },

    /** Date as string, to show for user**/
    viewValue() {
      let value = '';

      if (moment.isMoment(this.selectedDate.start)) {
        let fmt = new DateFormatter({
          dateSettings: {
            months: moment.months(),
            monthsShort: moment.monthsShort(),
          },
        });

        let dateFormat = this.dateFormat ? this.dateFormat : 'M j, Y';

        value = fmt.formatDate(this.selectedDate.start.toDate(), dateFormat);

        if (parseInt(this.dateField.range) === 1) {
          value = value + ' - ';
          value +=
            this.selectedDate.end !== null
              ? fmt.formatDate(this.selectedDate.end.toDate(), dateFormat)
              : '';
        }
      }

      return value;
    },

    /** value to send for changes **/
    dateFieldValue: {
      get() {
        return this.selectedDate;
      },

      set(value) {
        if (
          !value ||
          (value.hasOwnProperty('start') &&
            value.hasOwnProperty('end') &&
            value.start === null &&
            value.end === null)
        ) {
          return;
        }

        value.viewValue = this.viewValue;
        value.value = this.getValue();

        this.$emit('setDatetimeField', value);
      },
    },
  },
  created() {
    /** set calculator id **/
    this.calculatorId =
      this.$store.getters.getSettings.calc_id || this.$store.getters.getId;

    /** set active date to get correct month to appear **/
    this.activeDate = moment().startOf('day');
    this.dayList = this.calendarDays();

    this.selectedDate.range = this.dateField.range;

    /** use wordpress language **/
    moment.updateLocale(this.language, {
      week: {
        dow: 1,
      },
    });

    if (this.value) {
      this.setValue(this.value);
    }
  },

  watch: {
    activeDate() {
      this.dayList = this.calendarDays();
    },

    openDate(isOpened) {
      this.errors = [];

      if (isOpened === true) {
        document.addEventListener('click', this.closeCustomSelect, true);
      } else {
        document.removeEventListener('click', this.closeCustomSelect, true);
      }

      /** show confirmation for with range field if no end date**/
      if (
        !isOpened &&
        parseInt(this.dateField.range) === 1 &&
        this.selectedDate.start !== null &&
        this.selectedDate.end === null
      ) {
        this.errors.push(this.translations.empty_end_date_error);
      }
    },

    /** set value from store **/
    calcStore: {
      handler: function (value) {
        this.setValue(value);
      },
      deep: true,
    },
  },
  methods: {
    /** month day list, separated by weeks */
    setValue(value) {
      let originalValue = 0;
      let converted =
        value && value[this.dateField.alias]
          ? value[this.dateField.alias].converted
          : '';

      // if field is not in repeater
      if (value[this.dateField.alias]) {
        originalValue = value[this.dateField.alias].value;
      } else {
        // else field is in repeater, get value from repeater
        const fields = Object.values(this.calcStore).filter((f) =>
          f.hasOwnProperty('resultGrouped')
        );
        for (const f of fields) {
          if (
            f.resultGrouped?.length &&
            f.resultGrouped[this.index] &&
            f.resultGrouped[this.index][this.dateField.alias]
          ) {
            const found = f.resultGrouped[this.index][this.dateField.alias];
            originalValue = found.value;
            converted = found.converted;
          }
        }
      }

      if (converted === this.selectedDate.viewValue) {
        if (converted.length > 0) {
          this.getValueFromConverted(converted);
        }
        return;
      }

      if (converted.length > 0) {
        /** if changed value by condition **/
        let dates = this.parseConvertedValueToDates(converted);
        this.selectedDate.start = dates.start;
        this.selectedDate.end = dates.end;
      } else if (originalValue === 0) {
        this.selectedDate.start = null;
        this.selectedDate.end = null;
      }

      if (
        null !== this.selectedDate.start &&
        moment().startOf('date').month() !== this.selectedDate.start.month()
      ) {
        this.slideToMonth(this.selectedDate.start.month());
      }

      this.dateFieldValue = this.selectedDate;
    },

    getValueFromConverted(converted) {
      let dates = this.parseConvertedValueToDates(converted);
      this.selectedDate.start = dates.start;
      this.selectedDate.end = dates.end;
    },

    calendarDays() {
      let startDate = this.activeDate.clone().startOf('month');
      let endDate = this.activeDate.clone().endOf('month');
      let firstWeek = startDate.clone().startOf('week');
      let lastWeek = endDate.clone().endOf('week');
      let daysArray = [],
        tempItem;

      while (firstWeek.isSameOrBefore(lastWeek)) {
        let weekArray = [];
        for (let i = 0; i < 7; i++) {
          let item = firstWeek.clone().startOf('week');
          item.set('date', item.date() + i).startOf('date');
          tempItem = {
            date: item,
            currentMonth: this.activeDate.month() === item.month(),
          };
          weekArray.push(tempItem);
        }
        daysArray.push(weekArray);
        firstWeek.add(1, 'week');
      }
      return daysArray;
    },

    cleanDate() {
      this.selectedDate.start = null;
      this.selectedDate.end = null;
      this.selectedDate.viewValue = '';
      this.selectedDate.value = 0;

      this.errors = [];
      this.$emit('setDatetimeField', this.selectedDate);
    },

    /** event listener to close custom date-field **/
    closeCustomSelect(e) {
      if (
        e.target.closest('.ccb-datetime') !== null &&
        !e.target
          .closest('.ccb-datetime')
          .classList.contains(this.dateField.alias)
      ) {
        this.openDate = false;
      }
      if (
        e.target.classList.contains('calc-date-picker-select') ||
        e.target.classList.contains('calc-date-picker-select') ||
        this.hasParentClass(e.target, [
          'calc-date-picker-select',
          'calendar-select',
          'time-select',
        ])
      ) {
        return;
      }
      this.openDate = false;
    },

    /** check dayDate by 'is_have_unselectable' data **/
    isUnselectable(dayDate) {
      /** if is_have_unselectable is enabled make choosen dates unactive **/
      if (
        this.dateField.hasOwnProperty('is_have_unselectable') &&
        this.dateField.is_have_unselectable
      ) {
        /** make unactive selected week days **/
        if (
          this.dateField.hasOwnProperty('not_allowed_week_days') &&
          this.dateField.not_allowed_week_days.includes(
            dayDate.date.weekday() + 1
          )
        ) {
          return true;
        }

        /** make unactive current if set **/
        if (
          this.dateField.hasOwnProperty('not_allowed_week_days') &&
          this.dateField.not_allowed_week_days.includes(
            dayDate.date.weekday() + 1
          )
        ) {
          return true;
        }

        /** make unactive days from current, if set **/
        if (
          this.daysFromCurrentDate !== null &&
          dayDate.date.isBetween(
            this.today,
            this.daysFromCurrentDate,
            undefined,
            '(]'
          )
        ) {
          return true;
        }

        if (this.dateField.hasOwnProperty('not_allowed_dates')) {
          /** make unactive current if set **/
          if (
            this.dateField.not_allowed_dates.hasOwnProperty('current') &&
            this.dateField.not_allowed_dates.current &&
            this.isEqualDate(this.today, dayDate.date)
          ) {
            return true;
          }

          /** make unactive all past dates, if set **/
          if (
            this.dateField.not_allowed_dates.hasOwnProperty('all_past') &&
            this.dateField.not_allowed_dates.all_past &&
            this.today.isAfter(dayDate.date)
          ) {
            return true;
          }

          /** make unactive period dates, if start and end is set **/
          if (
            this.periodDates !== null &&
            this.periodDates.start !== null &&
            this.periodDates.end !== null &&
            dayDate.date.isBetween(
              this.periodDates.start,
              this.periodDates.end,
              undefined,
              '[]'
            )
          ) {
            return true;
          }
          /** make unactive period dates, if start is set **/
          if (
            this.periodDates !== null &&
            this.periodDates.start !== null &&
            this.periodDates.end === null &&
            this.isEqualDate(this.periodDates.start, dayDate.date)
          ) {
            return true;
          }
        }
      }
      return false;
    },

    returnValidDays(fromDate, toDate) {
      let days = 1;
      for (
        let compareDate = fromDate.set('date', fromDate.date() + 1);
        compareDate.diff(toDate, 'days') <= 0;
        compareDate.add(1, 'days')
      ) {
        if (this.isUnselectable({ date: compareDate })) {
          if (this.dateField.calculate_unselectable_days) {
            days++;
          }
        } else {
          days++;
        }
      }
      return days;
    },

    /** set correct class for day element in calendar **/
    getDateClass(dayDate) {
      let dayDivCls = [];

      if (this.isEqualDate(this.activeDate, dayDate.date)) {
        dayDivCls.push('active');
      }

      if (this.isEqualDate(this.today, dayDate.date)) {
        dayDivCls.push('today');
      }

      if (
        this.selectedDate.start !== null &&
        this.isEqualDate(dayDate.date, this.selectedDate.start)
      ) {
        dayDivCls.push('selected');
      }

      if (
        this.selectedDate.end !== null &&
        this.selectedDate.start !== null &&
        dayDate.date.isBetween(
          this.selectedDate.start,
          this.selectedDate.end,
          null,
          '[]'
        )
      ) {
        dayDivCls.push('selected');
      }

      if (!dayDate.currentMonth) {
        dayDivCls.push('not-current-month');
      }

      /** if is_have_unselectable is enabled make choosen dates unactive **/
      if (this.isUnselectable(dayDate)) {
        dayDivCls.push('inactive');

        if (!this.dateField.calculate_unselectable_days) {
          dayDivCls.push('not-allowed');
        }
      }

      return dayDivCls.join(' ');
    },

    /** days count, used as value **/
    getValue() {
      let days = 0;

      /** always 1 for no range date field **/
      if (
        parseInt(this.dateField.range) === 0 &&
        this.selectedDate.hasOwnProperty('start') &&
        this.selectedDate.start !== null
      ) {
        days = 1;
      }

      /** count days between days for 'with range' date field **/
      if (parseInt(this.dateField.range) === 1) {
        days = 1;
        if (
          this.selectedDate.hasOwnProperty('start') &&
          this.selectedDate.hasOwnProperty('end') &&
          this.selectedDate.end !== null
        ) {
          /** clone and set end of date to include past day **/
          days = this.selectedDate.end
            .clone()
            .endOf('date')
            .diff(this.selectedDate.start, 'days', true);
          days = Math.round(days);
        }
      }

      let fromDate = this.selectedDate.start.clone();
      let toDate = this.selectedDate.end?.clone();
      const validDays = this.returnValidDays(fromDate, toDate);
      return days < validDays ? days : validDays;
    },

    /** compare dates **/
    isEqualDate(date1, date2) {
      return date1 && date2 && date1.format('D-M-Y') === date2.format('D-M-Y');
    },

    parseConvertedValueToDates(converted) {
      let datesArray = converted.split(' - ').map((item) => item.trim());
      let fmt = new DateFormatter();
      let start = fmt.parseDate(datesArray[0], this.dateFormat);
      let startDay = (start.getDate() < 10 ? '0' : '') + start.getDate();
      let startMonth =
        (start.getMonth() + 1 < 10 ? '0' : '') + (start.getMonth() + 1);
      let endDay, endMonth;

      if (datesArray[1]) {
        let end = fmt.parseDate(datesArray[1], this.dateFormat);
        endDay = (end.getDate() < 10 ? '0' : '') + end.getDate();
        endMonth = (end.getMonth() + 1 < 10 ? '0' : '') + (end.getMonth() + 1);
      }

      return {
        start: datesArray[0]
          ? moment(
              [startDay, startMonth, start.getFullYear()].join('/'),
              'DD/MM/YYYY',
              true
            )
          : null,
        end: datesArray[1]
          ? moment(
              [endDay, endMonth, start.getFullYear()].join('/'),
              'DD/MM/YYYY',
              true
            )
          : null,
      };
    },

    selectDate(selectedDate) {
      this.errors = [];
      /** with range; set end and start values logic **/
      if (parseInt(this.dateField.range) === 1) {
        if (
          (this.selectedDate.end !== null &&
            this.selectedDate.start !== null) ||
          this.selectedDate.start === null ||
          (this.selectedDate.start !== null &&
            this.selectedDate.start.isAfter(selectedDate))
        ) {
          this.selectedDate.start = selectedDate.startOf('date');
          this.selectedDate.end = null;
        } else if (this.selectedDate.start !== null) {
          this.selectedDate.end = selectedDate;
        } else {
          this.selectedDate.start = selectedDate.startOf('date');
        }
      }

      /** no range **/
      if (parseInt(this.dateField.range) === 0) {
        this.selectedDate.start = selectedDate.startOf('date');
      }

      this.errors = [];
      this.dateFieldValue = this.selectedDate;
    },

    slideToMonth(monthKey) {
      let newDate = this.activeDate.clone();
      newDate.set('month', monthKey);
      if (moment().startOf('date').month() === newDate.month()) {
        newDate.set('date', moment().startOf('date').date());
      }

      this.activeDate = newDate;
      this.dayList = this.calendarDays();
    },

    slideMonth(next) {
      let currentDate = this.activeDate.clone();
      let newDate = next
        ? currentDate.add(1, 'month')
        : currentDate.subtract(1, 'month');
      newDate.startOf('month');
      if (moment().startOf('date').month() === newDate.month())
        newDate.set('date', moment().startOf('date').date());

      this.activeDate = newDate;
      this.dayList = this.calendarDays();

      setTimeout(() => {
        this.updateTopPosition();
      });
    },

    /** week day list **/
    weekdays() {
      let weekdays = moment.weekdaysShort();
      weekdays.push(weekdays.shift());
      return weekdays;
    },

    showCalendar() {
      this.updateTopPosition();
      this.openDate = !this.openDate;
    },

    updateTopPosition() {
      let defaultCalendarHeight = 240;
      let fieldObj = this.$parent.$el.getElementsByClassName(
        this.dateField.alias + '_datetime'
      )[0];
      let calendarObj = this.$el.getElementsByClassName('calendar-select')[0];

      let diffFromBtm =
        document
          .getElementsByClassName('ccb-wrapper-' + this.calculatorId)[0]
          .getBoundingClientRect().bottom -
        fieldObj.getBoundingClientRect().bottom;

      let topPosition =
        fieldObj.getBoundingClientRect().bottom -
        fieldObj.getBoundingClientRect().top;
      if (diffFromBtm < defaultCalendarHeight)
        topPosition = (calendarObj.scrollHeight + 15) * -1;
      calendarObj.style.top = [topPosition, 'px'].join('');
    },
  },
  template: `
		<div :class="['ccb-datetime', 'datetime', dateField.alias, dateField.alias + '_datetime']">
			<div class="date">
				<span v-if="dateField.required" :class="{active: $store.getters.isUnused(dateField)}" class="ccb-error-tip front default">{{ $store.getters.getSettings.texts.required_msg }}</span>
				<span :class="['calc-date-picker-select date', {'open': openDate}, {'error': ( errors.length > 0 || $store.getters.isUnused(dateField) ) }, {'calc-field-disabled': getStep === 'finish'}]" @click.prevent="showCalendar()">
					<span v-if="selectedDate.start">{{ viewValue }}</span>
					<span v-else-if="dateField.placeholder">{{ dateField.placeholder }}</span>
					<span v-else-if="dateField.range === 1">{{ translations.select_date_range }}</span>
					<span v-else>{{ translations.select_date }}</span>
					
					<i v-if="selectedDate.start" class="ccb-icon-close" @click="cleanDate"></i>
					<i v-else class="ccb-icon-Union-19"></i>
				</span>
				<span class="error-tip" v-if="errors.length > 0">{{ errors.join('') }}</span>
				<div :class="['calendar-select', {'hidden': !openDate}]">
					<div class="month-slide-control">
						<div class="prev" @click.prevent="slideMonth(false)">
							<i class="ccb-icon-Path-3485"></i>
						</div>
						<div class="slider-title">{{ activeDate.format('MMMM YYYY') }}</div>
						<div class="next" @click.prevent="slideMonth(true)">
							<i class="ccb-icon-Path-3485"></i>
						</div>
					</div>
					<div class="day-list">
						<div class="week-titles">
							<div class="title" v-for="(weekTitle, weekDayIndex) in weekdays()" :key="weekDayIndex">
								{{ weekTitle }}
							</div>
						</div>
						<div v-for="(week, weekIndex) in dayList" class="week">
							<div v-for="day in week" :key="day.date.dayOfYear()" @click="selectDate( day.date )" :class="['day', getDateClass( day ) ]">
								{{ day.date.date() }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
};
