import { get, useFormContext } from 'react-hook-form'
import { useFullName } from '../context/FormSectionContext'

// export const useFormHooks = (name: string) => {
//   const {
//     formState: { errors },
//   } = useFormContext()
//   return get(errors, name)
// }

export const useFormInput = (name: string) => {
  const fullName = useFullName(name)
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const error = get(errors, fullName)
  const registerInput = () => register(fullName)

  return { fullName, error, registerInput }
}

export const useFormInputValue = (name: string) => {
  const fullName = useFullName(name)
  const { setValue, getValues, watch } = useFormContext()

  const setInputValue = (value: any) => setValue(fullName, value)
  const getInputValue = () => getValues(fullName)
  const watchInput = () => watch(fullName)
  return { setInputValue, getInputValue, watchInput }
}

export const useWatchFullName = (name: string) => {
  const { watch } = useFormContext()
  const fullWatchName = useFullName(name)
  return watch(fullWatchName)
}
