export default {
  computed: {
    disableFieldHiddenByDefault() {
      return (field) => {
        const fields = this.$store.getters.getBuilder;
        const groupedElements = fields.filter((f) => f.groupElements);
        const aliases = [];
        for (const element of groupedElements) {
          aliases.push(...element.groupElements.map((f) => f.alias));
        }

        if (aliases.includes(field.alias)) {
          field.hidden = false;
          return true;
        }

        return false;
      };
    },
  },
};
