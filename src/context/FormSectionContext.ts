import React, { useContext } from 'react'

const FormSectionContext = React.createContext('')

export const FormSectionContexProvider = FormSectionContext.Provider

const useFormSectionContext = () => useContext(FormSectionContext)

export const useFullName = (name: string) => {
  const section = useFormSectionContext()
  return (section ? `${section}.` : '') + name
}
