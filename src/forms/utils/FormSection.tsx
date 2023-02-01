import React from 'react'
import { FormSectionContexProvider, useFullName } from '../../context/FormSectionContext'

interface iSection {
  name: string
  children: React.ReactNode
}

const FormSection = ({ name, children }: iSection) => {
  const fullName = useFullName(name)
  return <FormSectionContexProvider value={fullName}>{children}</FormSectionContexProvider>
}

export default FormSection
