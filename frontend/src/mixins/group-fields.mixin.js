export default {
  methods: {
    getFieldResultGrouped(field) {
      const exceptions = ['html', 'line'];
      const grouped = field.resultGrouped || [];

      if (grouped.length) {
        grouped.forEach((field, idx) => {
          const fields = Object.values(field).filter((f) => {
            const fieldName = f.alias?.replace(/\_field_id.*/, '');
            return !exceptions.includes(fieldName);
          });

          grouped[idx] = {};
          for (const field of fields) {
            grouped[idx][field.alias] = field;
          }
        });
      }

      return grouped;
    },
  },
};
