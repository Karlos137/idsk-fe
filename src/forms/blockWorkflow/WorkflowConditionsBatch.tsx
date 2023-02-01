import React from 'react'
import { WORKFLOW_PLACES_BATCH as WPB } from '../../enums/enumWorkflowPlaces'
import WorkflowCheckboxes from './WorkflowCheckboxes'

const SOFT_CONDITIONS = {
  [WPB.PRIPRAVA]: ['V dávce jsou všechny potřebné smlouvy.'],
  [WPB.ODESLANO]: [
    'Byla vygenerována soupiska smluv.',
    'Byl odeslán email na RK s potřebnými přílohami.',
    'Přišel email z RK s dokumentem usnesení.',
    'Byl přiložen dokument usnesení z RK k dávce.',
    'Byly zapsány údaje z usnesení RK (číslo a datum) do formuláře smlouvy.',
    'Byly na základě usnesení označeny neschválené smlouvy.',
  ],
}

interface iWorkflowConditionsBatch {
  place: string
  setAllChecked: (allChecked: boolean) => void
}

const WorkflowConditionsBatch = ({ place, setAllChecked }: iWorkflowConditionsBatch) => {
  const checkboxesActive = SOFT_CONDITIONS[place] || []

  return (
    <WorkflowCheckboxes
      title='Podmínky pro přechod dávky do dalšího stavu'
      checkboxes={checkboxesActive}
      setAllChecked={setAllChecked}
    />
  )
}

export default WorkflowConditionsBatch
