import { CustomHelpers } from 'joi'

// a zároveň minimálně jeden znak je číslice
// a zároveň minimálně jeden znak je velké písmeno
export const validPassword = (str: string) => /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(str)
export const validPasswordErrorMsg =
  'Heslo musí mít minimálně 8 znaků bez diakritiky, jedno velké a malé písmeno, jednu číslici'

export const startsWithCapital = (str: string) => str.charAt(0).toUpperCase() === str.charAt(0)

export const validPhone = (str: string) => /\+?[0-9]{9,}/.test(str.replaceAll(' ', ''))

export const joiCustomValidPhone = (value: any, helper: CustomHelpers) => {
  if (!validPhone(value)) {
    return helper.error('string.phone')
  }
  return value
}

export const joiCustomValidFirstCapital = (value: any, helper: CustomHelpers) => {
  if (!startsWithCapital(value)) {
    return helper.error('string.firstCapital')
  }
  return value
}
