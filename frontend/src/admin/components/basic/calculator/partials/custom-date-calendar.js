import DateFormatter from 'php-date-formatter';
import moment from 'moment';

export default {
  props: {
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
      return this.$store.getters.getDateFormat
        ? this.$store.getters.getDateFormat
        : 'F j, Y';
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

        let dateFormat = this.dateFormat ? this.dateFormat : 'F j, Y';

        value = fmt.formatDate(this.selectedDate.start.toDate(), dateFormat);

        if (this.selectedDate.end) {
          value = value + ' - ';
          value += fmt.formatDate(this.selectedDate.end.toDate(), dateFormat);
        }
      }

      return value;
    },
  },
  created() {
    /** set active date to get correct month to appear **/
    this.activeDate = moment().startOf('day');
    this.dayList = this.calendarDays();

    /** set exist data **/
    this.setSelectDate();

    /** use wordpress language **/
    moment.updateLocale(this.language, {
      week: {
        dow: 1,
      },
    });
  },
  watch: {
    activeDate() {
      this.dayList = this.calendarDays();
    },
    openDate(isOpened) {
      this.errors = [];
      if (isOpened) {
        document.addEventListener('click', this.closeCustomSelect, true);
      } else {
        document.removeEventListener('click', this.closeCustomSelect, true);
      }
    },
  },
  methods: {
    setSelectDate() {
      if (!this.field.hasOwnProperty('not_allowed_dates')) {
        return;
      }
      if (!this.field.not_allowed_dates.hasOwnProperty('period')) {
        return;
      }

      if (
        this.field.not_allowed_dates.period.hasOwnProperty('start') &&
        this.field.not_allowed_dates.period.start !== null
      ) {
        this.selectedDate.start = moment(
          this.field.not_allowed_dates.period.start,
          'DD/MM/YYYY',
          true
        );
      }
      if (
        this.field.not_allowed_dates.period.hasOwnProperty('end') &&
        this.field.not_allowed_dates.period.end !== null
      ) {
        this.selectedDate.end = moment(
          this.field.not_allowed_dates.period.end,
          'DD/MM/YYYY',
          true
        );
      }
    },

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

    cleanDate() {
      this.selectedDate.start = null;
      this.selectedDate.end = null;
      this.selectedDate.viewValue = '';

      this.errors = [];
      this.setValueToField();
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

    /** set correct class for day element in calendar **/
    getDateClass(dayDate) {
      let dayDivCls = ['active'];
      if (this.isEqualDate(this.activeDate, dayDate.date)) {
        dayDivCls.push('active');
      }

      if (this.isEqualDate(this.today, dayDate.date)) {
        dayDivCls.push('today');
      }

      if (
        this.selectedDate.start &&
        this.isEqualDate(dayDate.date, this.selectedDate.start)
      ) {
        dayDivCls.push('selected');
      }

      if (
        this.selectedDate.end &&
        this.selectedDate.start &&
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

      return dayDivCls.join(' ');
    },

    /** compare dates **/
    isEqualDate(date1, date2) {
      return date1 && date2 && date1.format('D-M-Y') === date2.format('D-M-Y');
    },

    selectDate(selectedDate) {
      if (
        (this.selectedDate.end && this.selectedDate.start) ||
        !this.selectedDate.start ||
        (this.selectedDate.start &&
          this.selectedDate.start.isAfter(selectedDate))
      ) {
        this.selectedDate.start = selectedDate.startOf('date');
        this.selectedDate.end = null;
      } else if (this.selectedDate.start) {
        this.selectedDate.end = selectedDate;
      } else {
        this.selectedDate.start = selectedDate.startOf('date');
      }
      this.setValueToField();
      this.errors = [];
    },

    /** set field value **/
    setValueToField() {
      let fmt = new DateFormatter();
      let start =
        this.selectedDate.start !== null
          ? fmt.formatDate(this.selectedDate.start.toDate(), 'd/m/Y')
          : null;
      let end =
        this.selectedDate.end !== null
          ? fmt.formatDate(this.selectedDate.end.toDate(), 'd/m/Y')
          : null;
      let value = { start: start, end: end };
      this.$emit('set-not-allowed-dates', value, 'period');
    },

    slideMonth(next) {
      let currentDate = this.activeDate.clone();
      let newDate = next
        ? currentDate.add(1, 'month')
        : currentDate.subtract(1, 'month');

      if (moment().startOf('date').month() === newDate.month())
        newDate.set('date', moment().startOf('date').date());

      this.activeDate = newDate;
      this.dayList = this.calendarDays();
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
  },

  template: `
		<div class='ccb-custom-datetime col-8 px-lg-0'>
			<div class="date">
				<span :class="['calc-date-picker-select date', {'open': openDate}, {'error': ( errors.length > 0 ) }]" @click.prevent="showCalendar()">
					<span v-if="selectedDate.start">{{ viewValue }}</span>
					<span v-else>{{ translations.select_date }}</span>
					
					<i v-if="selectedDate.start" class="ccb-icon-close" @click="cleanDate"></i>
					<i v-else class="ccb-calendar-icon"></i>
				</span>
				<span class="error-tip" v-if="errors.length > 0">{{ errors.join('') }}</span>
				<div :class="['calendar-select', 'show-on-top',{'hidden': !openDate}]">
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
