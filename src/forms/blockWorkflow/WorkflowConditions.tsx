import React from 'react'
import { WORKFLOW_PLACES as WP } from '../../enums/enumWorkflowPlaces'
import WorkflowCheckboxes from './WorkflowCheckboxes'

const COND_CONVERT_PDF = [
  'Provedena konverze smlouvy z DOCX do PDF/A-2.',
  'Dokument smlouvy ve formátu PDF/A-2 prošel formální kontrolou.',
]

const SOFT_CONDITIONS_ADMIN = {
  [WP.KONCEPT]: [
    'Potřebné údaje ke smlouvě byly zaevidovány.',
    'Byly připojeny všechny potřebné přílohy.',
    'Dokument smlouvy ve formátu DOCX prošel obsahovou kontrolou.',
    // ...COND_CONVERT_PDF // jen pro P02, P04, P06
  ],
  [WP.PRIPRAVA_K_PODPISU]: [...COND_CONVERT_PDF],
  [WP.PRIPRAVA_K_PODPISU_DAVKA]: [...COND_CONVERT_PDF],
  [WP.KE_KONTROLE_GINIS]: ['Byl zapsán výsledek finanční kontroly s datem a případným komentářem.'],
  [WP.KONTROLA_PRED_VYRIZENIM]: [
    'Dokument smlouvy ve formátu PDF/A-2 prošel formální kontrolou před finální distribucí smluvním stranám.',
  ],
  [WP.K_PREPRACOVANI]: [
    'Potřebné údaje ke smlouvě byly upraveny.',
    'Byly zkontrolovány všechny potřebné přílohy.',
    'Opravený dokument smlouvy ve formátu DOCX prošel obsahovou kontrolou.',
    // ...COND_CONVERT_PDF // jen pro P02, P04, P06
  ],
  [WP.KE_SCHVALENI_KRAJ]: [
    'Byl odeslán na kraj email s žádostí o schválení.',
    'Přišel email z kraje s usnesením.',
    'Soubor s usnesením byl vložen k přílohám smlouvy.',
    'Údaje z usnesení byly zapsány do formuláře smlouvy.',
    'Byl proveden průpis údajů z usnesení do dokumentu smlouvy ve formátu DOCX.',
    'Byly zkontrolovány propsané údaje v dokumentu smlouvy ve formátu DOCX.',
  ],
}

const SOFT_CONDITIONS_B = {
  [WP.KE_SCHVALENI_B]: ['Byl přidán soubor s usnesením.', 'Byl zadán upřesňující text do poznámek uživatele.'],
}

const SOFT_CONDITIONS_ROPID = {
  [WP.KE_KONTROLE_ROPID]: ['Do poznámek pro uživatele byl zapsán výsledek kontroly.'],
}

interface iWorkflowConditions {
  place: string
  isP02P04P06: boolean
  setAllChecked: (allChecked: boolean) => void
  isReferent?: boolean
  isKlientRopid?: boolean
  isKlientB?: boolean
}

const WorkflowConditions = ({
  place,
  isP02P04P06,
  setAllChecked,
  isReferent,
  isKlientB,
  isKlientRopid,
}: iWorkflowConditions) => {
  let checkboxesActive: string[] = []
  if (isReferent) {
    checkboxesActive = SOFT_CONDITIONS_ADMIN[place] || []
    if ([WP.KONCEPT, WP.K_PREPRACOVANI].includes(place) && isP02P04P06) {
      checkboxesActive = [...checkboxesActive, ...COND_CONVERT_PDF]
    }
  } else if (isKlientB) {
    checkboxesActive = SOFT_CONDITIONS_B[place] || []
  } else if (isKlientRopid) {
    checkboxesActive = SOFT_CONDITIONS_ROPID[place] || []
  }

  return (
    <WorkflowCheckboxes
      title='Podmínky pro přechod smlouvy do dalšího stavu'
      checkboxes={checkboxesActive}
      setAllChecked={setAllChecked}
    />
  )
}

export default WorkflowConditions
