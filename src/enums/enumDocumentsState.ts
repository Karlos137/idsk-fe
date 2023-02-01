import { WORKFLOW_PLACES as WP } from './enumWorkflowPlaces'

const DOCUMENT_STATE = {
  koncept: 'koncept',
  cistopis: 'čistopis',
  castecnePodepsany: 'částečně podepsaný',
  kompletnePodepsany: 'kompletně podepsaný',
  opatrenyCasovymRazitkem: 'podepsaný a opatřený časovým razítkem',
  zneplatneny: 'zneplatněný',
}
export const documentStateByWorkflow = (workflowCode: string, pocetPodpisu?: number) => {
  if ([WP.KONCEPT].includes(workflowCode)) {
    return DOCUMENT_STATE.koncept
  }
  if (
    [
      WP.KE_SCHVALENI_B,
      WP.KE_SCHVALENI_KRAJ,
      WP.K_PODPISU_B,
      WP.PRIPRAVA_K_PODPISU,
      WP.PRIPRAVA_DAVKY,
      WP.KE_SCHVALENI_KRAJ_DAVKA,
      WP.PRIPRAVA_K_PODPISU_DAVKA,
    ].includes(workflowCode)
  ) {
    if (pocetPodpisu) {
      return DOCUMENT_STATE.castecnePodepsany
    }
    return DOCUMENT_STATE.cistopis
  }
  if (
    [
      WP.K_VALIDACI_PODPISU_B,
      WP.NEVALIDNI_PODPIS_B,
      WP.KE_KONTROLE_GINIS,
      WP.KE_KONTROLE_ROPID,
      WP.K_PODPISU_ROPID,
      WP.K_VALIDACI_PODPISU_ROPID,
      WP.NEVALIDNI_PODPIS_ROPID,
      WP.K_PODPISU_A,
      WP.K_VALIDACI_PODPISU_A,
      WP.NEVALIDNI_PODPIS_A,
    ].includes(workflowCode)
  ) {
    return DOCUMENT_STATE.castecnePodepsany
  }
  if ([WP.KONEC_PODEPISOVANI_SMLOUVY].includes(workflowCode)) {
    return DOCUMENT_STATE.kompletnePodepsany
  }
  if ([WP.VYRIZENO, WP.KONTROLA_PRED_VYRIZENIM].includes(workflowCode)) {
    return DOCUMENT_STATE.opatrenyCasovymRazitkem
  }
  if ([WP.STORNO, WP.K_PREPRACOVANI].includes(workflowCode)) {
    return DOCUMENT_STATE.zneplatneny
  }

  return undefined
}
