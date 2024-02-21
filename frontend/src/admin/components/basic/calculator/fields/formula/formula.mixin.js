export default {
  methods: {
    insertAtCursor(myValue) {
      const myField = document.querySelector(`#ccb-formula-${this.id}`);
      if (myField?.selectionStart || myField?.selectionStart === 0) {
        const startPos = myField.selectionStart;
        const endPos = myField.selectionEnd;
        myField.value = `${myField.value.substring(
          0,
          startPos
        )} ${myValue} ${myField.value.substring(endPos, myField.value.length)}`;
      } else {
        myField.value += `${myField.value} ${myValue}`;
      }
      myField.focus();
      this.$emit('change', myField.value);
    },
  },
};
