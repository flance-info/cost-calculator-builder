import DateFormatter from 'php-date-formatter';
import moment from 'moment';

export default {
  props: {
    index: {
      required: true,
    },
    field: {
      type: Object,
      required: true,
      default: {},
    },
  },
  data: () => ({
    dayList: [],
    errors: [],
    openDate: false,
    selectedDate: {
      start: null,
      end: null,
    },
  }),
  computed: {
    dateFormat() {
      let format = 'F j, Y';
      if (1 === parseInt(this.field.range)) {
        format = 'd/m/Y';
      }
      return format;
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
        this.field.hasOwnProperty('days_from_current') &&
        this.field.days_from_current !== 0
      ) {
        return moment()
          .startOf('date')
          .set(
            'date',
            moment().startOf('date').date() +
              parseInt(this.field.days_from_current)
          );
      }
      return null;
    },

    /** get unselectable date period,if is enabled **/
    periodDates() {
      if (
        this.field.hasOwnProperty('not_allowed_dates') &&
        this.field.not_allowed_dates.hasOwnProperty('period')
      ) {
        let start = null;
        let end = null;

        if (
          this.field.not_allowed_dates.period.hasOwnProperty('start') &&
          this.field.not_allowed_dates.period.start !== null
        ) {
          start = moment(
            this.field.not_allowed_dates.period.start,
            'DD/MM/YYYY',
            true
          );
        }
        if (
          this.field.not_allowed_dates.period.hasOwnProperty('end') &&
          this.field.not_allowed_dates.period.end !== null
        ) {
          end = moment(
            this.field.not_allowed_dates.period.end,
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

        value = fmt.formatDate(
          this.selectedDate.start.toDate(),
          this.dateFormat
        );
        if (parseInt(this.field.range) === 1) {
          value = value + ' - ';
          value +=
            this.selectedDate.end !== null
              ? fmt.formatDate(this.selectedDate.end.toDate(), this.dateFormat)
              : '';
        }
      }

      return value;
    },
  },
  created() {
    /** set active date to get correct month to appear **/
    this.activeDate = moment().startOf('day');
    this.dayList = this.calendarDays();

    /** use wordpress language **/
    moment.updateLocale(this.language, {
      week: {
        dow: 1,
      },
    });

    this.setSelectDate();
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
        parseInt(this.field.range) === 1 &&
        this.selectedDate.start !== null &&
        this.selectedDate.end === null
      ) {
        this.errors.push(this.translations.empty_end_date_error);
      }
    },
  },
  methods: {
    /** month day list, separated by weeks */
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

    /** week day list **/
    weekdays() {
      let weekdays = moment.weekdaysShort();
      weekdays.push(weekdays.shift());
      return weekdays;
    },

    showCalendar() {
      this.openDate = !this.openDate;
    },

    /** event listener to close custom date-field **/
    closeCustomSelect(e) {
      if (
        e.target.closest('.ccb-datetime') !== null &&
        !e.target.closest('.ccb-datetime').classList.contains(this.field.alias)
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

    slideMonth(next) {
      let currentDate = this.activeDate.clone();
      let newDate = next
        ? currentDate.add(1, 'month')
        : currentDate.subtract(1, 'month');
      newDate.startOf('month');
      if (moment().startOf('date').month() === newDate.month()) {
        newDate.set('date', moment().startOf('date').date());
      }

      this.activeDate = newDate;
      this.dayList = this.calendarDays();
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

    /** compare dates **/
    isEqualDate(date1, date2) {
      return date1 && date2 && date1.format('D-M-Y') === date2.format('D-M-Y');
    },

    cleanDate() {
      this.selectedDate.start = null;
      this.selectedDate.end = null;
      this.selectedDate.viewValue = '';

      this.errors = [];
      this.$emit('clean', this.index);
    },

    setSelectDate() {
      let conditionModel = this.$store.getters.getConditionModel.filter(
        (e, i) => i === this.index
      );
      if (conditionModel.length <= 0) {
        return;
      }

      if (
        parseInt(this.field.range) === 0 &&
        conditionModel[0].setVal.length > 0 &&
        null !== conditionModel[0].setVal
      ) {
        this.selectedDate.start = moment(
          conditionModel[0].setVal,
          'DD/MM/YYYY',
          true
        );
      }

      if (
        parseInt(this.field.range) === 1 &&
        conditionModel[0].setVal.length > 0
      ) {
        let rangeValue =
          conditionModel[0].setVal.length > 0
            ? JSON.parse(conditionModel[0].setVal)
            : { start: '', end: '' };
        if (rangeValue.hasOwnProperty('start') && null !== rangeValue.start) {
          this.selectedDate.start = moment(
            rangeValue.start,
            'DD/MM/YYYY',
            true
          );
        }
        if (rangeValue.hasOwnProperty('end') && null !== rangeValue.end) {
          this.selectedDate.end = moment(rangeValue.end, 'DD/MM/YYYY', true);
        }
      }

      if (
        null !== this.selectedDate.start &&
        moment().startOf('date').month() !== this.selectedDate.start.month()
      ) {
        this.slideToMonth(this.selectedDate.start.month());
      }
    },
    isValidRangeValues(fromDate, toDate) {
      for (
        let compareDate = fromDate.set('date', fromDate.date() + 1);
        compareDate.diff(toDate, 'days') <= 0;
        compareDate.add(1, 'days')
      ) {
        if (this.isUnselectable({ date: compareDate })) {
          return false;
        }
      }
      return true;
    },

    selectDate(selectedDate) {
      this.errors = [];
      if (this.isUnselectable(selectedDate)) {
        return;
      }
      /** with range; set end and start values logic **/
      if (parseInt(this.field.range) === 1) {
        if (
          (this.selectedDate.end !== null &&
            this.selectedDate.start !== null) ||
          this.selectedDate.start === null ||
          (this.selectedDate.start !== null &&
            this.selectedDate.start.isAfter(selectedDate))
        ) {
          this.selectedDate.start = selectedDate.date.startOf('date');
          this.selectedDate.end = null;
        } else if (this.selectedDate.start !== null) {
          let fromDate = this.selectedDate.start.clone();
          let toDate = selectedDate.date.clone();
          if (false === this.isValidRangeValues(fromDate, toDate)) {
            this.selectedDate.start = null;
            this.$emit('set-date', this.index, this.getValueForCondition());
            this.errors.push(this.translations.wrong_date_range_error);
            return;
          }
          this.selectedDate.end = selectedDate.date;
        } else {
          this.selectedDate.start = selectedDate.date.startOf('date');
        }
      }

      /** no range **/
      if (0 === parseInt(this.field.range)) {
        this.selectedDate.start = selectedDate.date.startOf('date');
      }

      this.$emit('set-date', this.index, this.getValueForCondition());
    },

    /** set field value **/
    getValueForCondition() {
      let fmt = new DateFormatter();
      let start =
        this.selectedDate.start !== null
          ? fmt.formatDate(this.selectedDate.start.toDate(), 'd/m/Y')
          : null;
      let end =
        this.selectedDate.end !== null
          ? fmt.formatDate(this.selectedDate.end.toDate(), 'd/m/Y')
          : null;

      if (0 === parseInt(this.field.range)) {
        return start;
      } else if (1 === parseInt(this.field.range)) {
        return { start: start, end: end };
      }
    },

    /** check dayDate by 'is_have_unselectable' data **/
    isUnselectable(dayDate) {
      /** if is_have_unselectable is enabled make choosen dates unactive **/
      if (
        this.field.hasOwnProperty('is_have_unselectable') &&
        this.field.is_have_unselectable
      ) {
        /** make unactive selected week days **/
        if (
          this.field.hasOwnProperty('not_allowed_week_days') &&
          this.field.not_allowed_week_days.includes(dayDate.date.weekday() + 1)
        ) {
          return true;
        }

        /** make unactive current if set **/
        if (
          this.field.hasOwnProperty('not_allowed_week_days') &&
          this.field.not_allowed_week_days.includes(dayDate.date.weekday() + 1)
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

        if (this.field.hasOwnProperty('not_allowed_dates')) {
          /** make unactive current if set **/
          if (
            this.field.not_allowed_dates.hasOwnProperty('current') &&
            this.field.not_allowed_dates.current &&
            this.isEqualDate(this.today, dayDate.date)
          ) {
            return true;
          }

          /** make unactive all past dates, if set **/
          if (
            this.field.not_allowed_dates.hasOwnProperty('all_past') &&
            this.field.not_allowed_dates.all_past &&
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
      }

      return dayDivCls.join(' ');
    },
  },

  template: `
		<div class="ccb-custom-datetime">
			<div class="date">
				<span :class="['calc-date-picker-select date', {'open': openDate}]" @click.prevent="showCalendar()">
					<span v-if="selectedDate.start">{{ viewValue }}</span>
					<span v-else-if="field.range === 1">{{ translations.select_date_range }}</span>
					<span v-else>{{ translations.select_date }}</span>
					
					<i v-if="selectedDate.start" class="ccb-icon-close" @click="cleanDate"></i>
					<i v-else class="ccb-icon-Union-19"></i>
				</span>
				<span :class="['error-tip', 'condition', {'ccb-calendar-error-tip': openDate}]" v-if="( errors.length > 0 )">
                  {{ errors.join('') }}
                </span>
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
                      <div v-for="day in week" :key="day.date.dayOfYear()" @click="selectDate( day )" :class="['day', getDateClass( day ) ]">
                        {{ day.date.date() }}
                      </div>
                    </div>
                  </div>
				</div>
			</div>
		</div>
	`,
};
