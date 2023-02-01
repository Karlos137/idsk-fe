import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import ButtonGov from '../../components/Btns/ButtonGov'
import { useEffectStart } from '../../hooks/useEffectStart'
import FormSection from './FormSection'

interface iRepeater {
  sectionName: string
  min?: number
  max?: number
  children: React.ReactNode
}

const Repeater = ({ sectionName, min = 1, max, children }: iRepeater) => {
  const { control } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: sectionName,
  })

  const addRow = (): void => {
    append({})
  }

  const removeRow = (index: number): void => {
    remove(index)
  }

  useEffectStart(() => {
    // TODO min max
    if (fields.length === 0 && min) {
      append({}, { shouldFocus: false })
    }
  })

  return (
    <div>
      {fields.map((item, index) => (
        <fieldset key={item.id}>
          <legend>{index + 1}. Osoba</legend>
          <FormSection name={sectionName + '.' + index}>{children}</FormSection>
          {index >= min && (
            <ButtonGov variant='primary-outlined' onClick={() => removeRow(index)}>
              Smazat osobu
            </ButtonGov>
          )}
        </fieldset>
      ))}
      <ButtonGov variant='primary' onClick={addRow}>
        Přidat osobu
      </ButtonGov>
    </div>
  )
}

export default Repeater
