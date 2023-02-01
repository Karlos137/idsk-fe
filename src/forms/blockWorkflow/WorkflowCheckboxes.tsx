import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'

interface iWorkflowCheckboxes {
  title: string
  checkboxes: string[]
  setAllChecked: (allChecked: boolean) => void
}

const WorkflowCheckboxes = ({ title, checkboxes, setAllChecked }: iWorkflowCheckboxes) => {
  const [checked, setChecked] = useState<boolean[]>(Array.from({ length: checkboxes.length }))

  useEffect(() => {
    const allChecked = checked.length === 0 || checked.every((c) => c)
    setAllChecked(allChecked)
  }, [checked])

  if (checkboxes.length === 0) {
    return null
  }

  return (
    <fieldset>
      <legend>{title}</legend>
      {checkboxes.map((label, index) => (
        <Form.Group className='mb-3' key={index} controlId={'check_' + index}>
          <Form.Check
            name={'check' + index}
            type='checkbox'
            checked={checked[index] || false}
            onChange={(e) => setChecked(checked.map((c, i) => (index === i ? e.target.checked : c)))}
            label={label}
          />
        </Form.Group>
      ))}
    </fieldset>
  )
}

export default WorkflowCheckboxes
