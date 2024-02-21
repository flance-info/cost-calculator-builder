export default function save({ attributes }) {
	return `[stm-calc id='${attributes.calculator ? attributes.calculator.id : ''}']`;
}
