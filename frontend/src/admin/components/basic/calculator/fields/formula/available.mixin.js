export default {
  data: () => ({
    errorMessage: [],
  }),

  methods: {
    numHash(num) {
      let alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';

      while (num >= 0) {
        result = alpha[num % 26] + result;
        num = Math.floor(num / 26) - 1;
      }
      return result;
    },

    prepareAvailable(available, currentId = 999) {
      const data = [];
      const exceptions = ['text', 'html', 'line'];
      let fields = available;

      available?.forEach((field) => {
        if (field.alias && field.alias.includes('group')) {
          if (field.groupElements.length) {
            fields = [...fields, ...field.groupElements];
          }
        }
      });

      fields?.forEach((av) => {
        // eslint-disable-next-line no-useless-escape
        const fieldName = av.alias?.replace(/\_field_id.*/, '');
        const fieldId = av.alias?.replace(/[^0-9]/g, '');

        if (
          av.alias &&
          !exceptions.includes(fieldName) &&
          parseInt(fieldId) >= 0
        ) {
          av.letter = this.numHash(av._id);
          data.push(av);
        } else if (
          fieldName !== 'total' ||
          (av.alias &&
            av.alias !== 'total' &&
            +fieldId >= 0 &&
            +fieldId < +currentId)
        ) {
          av.letter = this.numHash(av._id);
          data.push(av);
        }
      });

      const inCalculable = ['html', 'line', 'text', 'group', null];
      return data
        .filter((f) => {
          const fieldName = f.alias ? f.alias.replace(/\_field_id.*/, '') : '';
          return (
            typeof f._id !== 'undefined' && !inCalculable.includes(fieldName)
          );
        })
        .filter((f) => f.alias !== this.alias);
    },

    saveWithValidation(field, id, index, alias) {
      this.errorMessage = [];
      if (!field.formulaView) {
        field.costCalcFormula = this.costCalcLetterFormula;
      }

      let checked = this.checkEvalFunction(field.costCalcFormula);
      this.$emit('error', this.errorMessage);
      if (checked && this.errorMessage.length === 0) {
        this.$emit('save', field, id, index, alias);
      }
    },

    checkEvalFunction(evalValue) {
      try {
        let fieldsWithValues = this.initializeFieldsWithValues(evalValue);
        let checkNonExistLetter = this.checkNonExistLetter(fieldsWithValues);
        if (checkNonExistLetter) {
          throw new Error('Non exist letter');
        }
        eval(fieldsWithValues);
        return true;
      } catch (error) {
        if (
          !this.errorMessage.some((item) => item.error_type === 'eval-function')
        ) {
          let errorMessage = 'Wrong formula input';
          this.errorMessage.push({
            message: errorMessage,
            error_type: 'eval-function',
          });
        }
        return false;
      }
    },

    initializeFieldsWithValues(inputString) {
      const fieldPattern = /\w+_field_id_\d+/g;
      const fields = inputString.match(fieldPattern);

      if (fields) {
        const uniqueFields = [...new Set(fields)]; // Remove duplicates

        for (const field of uniqueFields) {
          inputString = inputString.replace(
            new RegExp(`\\b${field}\\b`, 'g'),
            `1`
          ); //Initialize all field values with 1
        }
      }

      return inputString;
    },

    checkNonExistLetter(fieldWithValues) {
      const regex = /Math\.[A-Z]+\([^)]*\)|\b[A-Z]+\b/g;
      const matches = fieldWithValues.match(regex);
      return !!matches;
    },
  },
};
