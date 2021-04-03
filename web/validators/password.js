import { helpers } from 'vuelidate/lib/validators'

const passwordValidator = helpers.regex(
  'passwordValidator',
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@\\'$!%*#?&])[A-Za-z\d@\\'$!%*#?&]{8,}$/
)

export default passwordValidator
