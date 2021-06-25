const formatDateTime = (input) => {
  const inputChars = input.split('')
  for (let i = input.length - 1; i > 0; i--) {
    if (
      ['-', ':', '+'].includes(input[i]) &&
      input[i - 1] &&
      input[i - 1] === ' '
    ) {
      inputChars.splice(i - 1, 1)
    }
  }
  return inputChars.join('')
}
module.exports = {
  formatDateTime,
}
