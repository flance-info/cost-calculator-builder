import fieldsMixin from './fieldsMixin';
import VueTimepicker from 'vue2-timepicker';
import 'vue2-timepicker/dist/VueTimepicker.css';

export default {
  mixins: [fieldsMixin],
  props: {
    field: [Object, String],
    index: [Number],
    value: {
      default: '',
    },
  },
  components: {
    VueTimepicker,
  },
  data: () => ({
    v: [],
    timePickerField: {},
    placeholderText: 'hh : mm',
    selectedTime: {
      start: '',
      end: '',
      basic: '',
    },
    basicFocusPicker: '',
    timeRangeSecond: false,
    openTime: false,
    errors: [],
    isHandled: false,
    isFirstClick: 0,
    format: 'hh : mm a',
    allowAccess: true,
    firstInit: true,
  }),

  created() {
    this.timePickerField = this.parseComponentData();
    this.timePickerField.range = parseInt(this.timePickerField.range);
    if (
      this.timePickerField.placeholderHours !== '' &&
      this.timePickerField.placeholderTime !== ''
    ) {
      this.placeholderText =
        this.timePickerField.placeholderHours +
        ' : ' +
        this.timePickerField.placeholderTime;
    }
    if (
      this.timePickerField.hasOwnProperty('format') &&
      this.timePickerField.format
    ) {
      this.format = '';
    } else {
      this.format = 'hh:mm a';
    }

    if (this.value) {
      this.setValue(this.value);
    }
  },

  watch: {
    calcStore: {
      handler(value) {
        this.setValue(value);
      },
      deep: true,
    },
  },

  computed: {
    manualInput() {
      return window.innerWidth >= 768;
    },

    getTimePickerClasses() {
      return {
        'ccb-time-picker-wrapper': '',
        'calc-field-disabled': this.getStep === 'finish',
        focused: this.basicFocusPicker.length > 0,
      };
    },

    getPickerControlBasic() {
      return {
        dropdownBasic: this.selectedTime.basic.length > 0,
      };
    },

    getPickerControlStart() {
      return {
        dropdownStart: this.selectedTime.start.length > 0,
      };
    },

    getPickerControlEnd() {
      return {
        dropdownEnd: this.selectedTime.end.length > 0,
      };
    },

    getTimePickerErrorClasses() {
      return {
        active: this.$store.getters.isUnused(this.timePickerField),
        'ccb-time-picker-no-range': !this.timePickerField.range,
        hidden: this.timeRangeSecond,
      };
    },

    additionalCss() {
      return this.$store.getters.getCalcStore.hasOwnProperty(
        this.timePickerField.alias
      ) &&
        this.$store.getters.getCalcStore[this.timePickerField.alias].hidden ===
          true
        ? 'display: none;'
        : '';
    },

    getStyles() {
      this.min = +this.min;
      this.max = +this.max;

      return {
        '--primary-color': this.getAccentColor,
      };
    },

    translations() {
      return this.$store.getters.getTranslations;
    },
  },

  mounted() {
    document.addEventListener('click', this.handleDocumentClick);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  },

  methods: {
    closeHandler() {
      this.basicFocusPicker = '';
    },

    setValue(value) {
      let aliasConverted = '';

      if (typeof value === 'string') {
        aliasConverted = value;
      } else {
        if (value[this.timePickerField.alias]) {
          aliasConverted = value.hasOwnProperty(this.timePickerField.alias)
            ? value[this.timePickerField.alias].converted
            : '';
        } else {
          const fields = Object.values(value).filter((f) =>
            f.hasOwnProperty('resultGrouped')
          );

          for (const f of fields) {
            if (
              f.resultGrouped?.length &&
              f.resultGrouped[this.index] &&
              f.resultGrouped[this.index][this.timePickerField.alias]
            ) {
              aliasConverted =
                f.resultGrouped[this.index][this.timePickerField.alias]
                  .converted;
            }
          }
        }
      }

      if (aliasConverted.length > 0) {
        this.isHandled = true;
        if (aliasConverted.includes(' - ')) {
          const [startTime, endTime] = aliasConverted.split(' - ');
          this.selectedTime.start = startTime;
          this.selectedTime.end = endTime;
        } else {
          this.selectedTime.basic = aliasConverted;
        }
      } else if (this.isHandled) {
        const timePickerRefs = [
          'timePickerBasic',
          'timePickerStart',
          'timePickerEnd',
        ];

        for (const ref of timePickerRefs) {
          if (this.$refs[ref]) {
            this.$refs[ref].clearTime();
          }
        }
        this.isHandled = false;
      }
    },

    handleDocumentClick() {
      if (
        (this.selectedTime.start !== '' && this.selectedTime.end === '') ||
        (this.selectedTime.start === '' && this.selectedTime.end !== '')
      ) {
        this.timeRangeSecond = true;
      }
    },

    setDatetimeField(dateValue, flag) {
      const [start, end] = dateValue.split('-');

      if (
        this.selectedTime.start &&
        this.selectedTime.end &&
        this.timePickerField.range
      ) {
        const diff = this.getTimeDifference(start, end);

        if (diff < this.timePickerField.min_interval_minutes) {
          if (flag === 'end') {
            this.updateStartFirst(end);
          } else {
            this.updateEndFirst();
          }

          dateValue = `${this.selectedTime.start} - ${this.selectedTime.end}`;
        }

        this.firstInit = false;
      }

      if (
        !this.selectedTime.start &&
        !this.selectedTime.end &&
        this.timePickerField.range
      ) {
        this.firstInit = this.timePickerField.use_interval;
      }

      if (
        this.timePickerField.range &&
        this.firstInit &&
        !start.trim() &&
        !this.selectedTime.start &&
        this.selectedTime.end
      ) {
        this.selectedTime.start = this.addMinutesToTime(
          this.selectedTime.end,
          this.timePickerField.min_interval_minutes,
          true
        );

        dateValue = `${this.selectedTime.start} - ${this.selectedTime.end}`;
      }

      if (
        this.timePickerField.range &&
        this.firstInit &&
        !end.trim() &&
        !this.selectedTime.end &&
        this.selectedTime.start
      ) {
        this.selectedTime.end = this.addMinutesToTime(
          this.selectedTime.start,
          this.timePickerField.min_interval_minutes
        );

        dateValue = `${this.selectedTime.start} - ${this.selectedTime.end}`;
      }

      this.allowAccess = true;

      if (
        !this.selectedTime.start ||
        (!this.selectedTime.end && this.timePickerField.range)
      ) {
        if (this.timePickerField.required) this.allowAccess = false;
      }

      if (
        (typeof dateValue !== 'undefined' && dateValue) ||
        this.timePickerField.range !== '1'
      ) {
        this.$emit(
          this.timePickerField._event,
          dateValue,
          this.timePickerField.alias,
          this.timePickerField.label,
          this.index
        );
        this.$emit('condition-apply', this.timePickerField.alias);
      }
    },

    updateSelectedTime(event, flag) {
      const { basic, start, end } = this.selectedTime;

      const handleFirstClick = (time) => {
        if (time === '') {
          this.isFirstClick = 0;
        }
        return this.renderFirstClick(time);
      };

      switch (flag) {
        case 'basic':
          this.selectedTime.basic = handleFirstClick(basic);
          this.setDatetimeField(this.selectedTime.basic, flag);
          break;

        case 'start':
          this.selectedTime.start = handleFirstClick(start);
          this.renderSummary = `${this.selectedTime.start} - ${this.selectedTime.end}`;
          this.setDatetimeField(this.renderSummary, flag);
          break;

        case 'end':
          this.selectedTime.end = handleFirstClick(end);
          this.renderSummary = `${this.selectedTime.start} - ${this.selectedTime.end}`;
          this.setDatetimeField(this.renderSummary, flag);
          break;
      }
    },

    getTimeFormat(value) {
      let timeFormat = value;
      timeFormat = timeFormat.replace('hh', '12');
      timeFormat = timeFormat.replace('mm', '00');
      let lastChar = timeFormat.charAt(timeFormat.length - 1);

      if (lastChar === 'a') {
        timeFormat = timeFormat.replace('a', 'am');
      } else if (lastChar === 'p') {
        timeFormat = timeFormat.replace('p', 'pm');
      }

      return timeFormat;
    },

    renderFirstClick(value) {
      return this.getTimeFormat(value).replace('HH', '12');
    },

    addMinutesToTime(timeString, minutesToAdd, previous = false) {
      return this.timePickerField.format
        ? this.addMinutesWithFormat(timeString, minutesToAdd, previous)
        : this.addMinutesWithOutFormat(timeString, minutesToAdd, previous);
    },

    addMinutesWithOutFormat(timeString, minutesToAdd, previous = false) {
      const match = timeString.match(/(\d+):(\d+)\s+(am|pm)/i);
      if (!match) {
        return '';
      }

      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const period = match[3].toLowerCase();

      if (
        isNaN(hours) ||
        isNaN(minutes) ||
        hours < 1 ||
        hours > 12 ||
        minutes < 0 ||
        minutes >= 60 ||
        (period !== 'am' && period !== 'pm')
      ) {
        return '';
      }

      let totalMinutes = (period === 'am' ? hours : hours + 12) * 60 + minutes;

      if (previous) {
        totalMinutes -= minutesToAdd;
      } else {
        totalMinutes += minutesToAdd;
      }

      totalMinutes = (totalMinutes + 1440) % 1440;

      const newHours = Math.floor(totalMinutes / 60) % 12 || 12;
      const newMinutes = totalMinutes % 60;
      const newPeriod = totalMinutes < 720 ? 'am' : 'pm';

      return `${newHours.toString().padStart(2, '0')}:${newMinutes
        .toString()
        .padStart(2, '0')} ${newPeriod}`;
    },

    addMinutesWithFormat(timeString, minutesToAdd, previous = false) {
      const [hours, minutes] = timeString.split(':').map(Number);

      const totalMinutes = hours * 60 + minutes;
      const adjustment = previous ? -minutesToAdd : minutesToAdd;
      const newTotalMinutes = (totalMinutes + adjustment + 24 * 60) % (24 * 60);

      const newHours = Math.floor(newTotalMinutes / 60);
      const newMinutes = newTotalMinutes % 60;

      return `${String(newHours).padStart(2, '0')}:${String(
        newMinutes
      ).padStart(2, '0')}`;
    },

    getTimeDifference(startTime, endTime) {
      const startDate = new Date(`01/01/2023 ${startTime}`);
      const endDate = new Date(`01/01/2023 ${endTime}`);

      const timeDifferenceMillis = endDate - startDate;

      return Math.abs(Math.floor(timeDifferenceMillis / 60000));
    },

    updateStartFirst(end) {
      this.selectedTime.start = this.addMinutesToTime(
        end,
        this.timePickerField.min_interval_minutes,
        true
      );

      this.selectedTime.end = this.addMinutesToTime(
        this.selectedTime.start,
        this.timePickerField.min_interval_minutes
      );
    },

    updateEndFirst() {
      this.selectedTime.end = this.addMinutesToTime(
        this.selectedTime.start,
        this.timePickerField.min_interval_minutes
      );

      this.selectedTime.start = this.addMinutesToTime(
        this.selectedTime.end,
        this.timePickerField.min_interval_minutes,
        true
      );
    },
  },
};
