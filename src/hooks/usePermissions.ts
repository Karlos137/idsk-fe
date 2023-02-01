import { useFormContextBase } from '../context/FormContext'
import { WORKFLOW_PLACES as WP } from '../enums/enumWorkflowPlaces'
import { useUserAuth } from './useUserAuth'

//zalozit novou - jen referent

// editace  jen referent - KONCEPT, PRIPRAVA_DAVKY, PRIPRAVA_K_PODPISU_DAVKA, KE_KONTROLE_GINIS, K_PREPRACOVANI, KE_SCHVALENI_KRAJ, PRIPRAVA_K_PODPISU

//smazat jenn referent - KONCEPT

//cist
// referent vzdy
// ostatni korme  KONCEPT a K_PREPRACOVANI

// pridat poznamku uzivatele
// referenrt - vzdy
// ostatni - krome KONCEPT,  K_PREPRACOVANI - pokryto v omezenim ctenim

// upravit poznamku referenta
// jen referent - referent -  pokryto v editaci
// KONCEPT, PRIPRAVA_DAVKY, PRIPRAVA_K_PODPISU_DAVKA, KE_KONTROLE_GINIS, K_PREPRACOVANI, KE_SCHVALENI_KRAJ, PRIPRAVA_K_PODPISU

// docx 2 pdf
//referent  - KONCEPT, PRIPRAVA_K_PODPISU_DAVKA, K_PREPRACOVANI, KE_SCHVALENI_KRAJ, PRIPRAVA_K_PODPISU

// podepsat
// referent - NEVALIDNI_PODPIS_A  -- referent muze podepsat??????????,  v nevalidnim stavu?????
// podpis idsk - K_PODPISU_A, NEVALIDNI_PODPIS_A
// podpis subjekt - K_PODPISU_B
// podpis ropid - K_PODPISU_ROPID,

//propsat do docx
// referent - PRIPRAVA_DAVKY, PRIPRAVA_K_PODPISU_DAVKA, KE_SCHVALENI_KRAJ, PRIPRAVA_K_PODPISU

// SMLOUVA
// referent - pridat/smazat - KONCEPT, K_PREPRACOVANI
// idsk - podepisujici/nahlizejici & suvjekt -nahlizejici  - nic
// subjekt - klient/podepisujici - nic

// USNESENI
// referent - pridat KONCEPT, PRIPRAVA_DAVKY, PRIPRAVA_K_PODPISU_DAVKA, KE_KONTROLE_GINIS, K_PREPRACOVANI, KE_SCHVALENI_KRAJ, PRIPRAVA_K_PODPISU
//   smazat - KONCEPT, PRIPRAVA_DAVKY, K_PREPRACOVANI - stejne jako pridat????
// idsk - podepisujici/nahlizejici & suvjekt - nahlizejici  - nic
// subjekt - klient/podepisujici - pridat/smazat -  KE_SCHVALENI_B

// OSTATNI
// referent - pridat/smazat KONCEPT, PRIPRAVA_DAVKY,  PRIPRAVA_K_PODPISU_DAVKA, KE_KONTROLE_GINIS, K_PREPRACOVANI, KE_SCHVALENI_KRAJ, PRIPRAVA_K_PODPISU, KONTROLA_PRED_VYRIZENIM
// idsk - podepisujici/nahlizejici & suvjekt -nahlizejici  - nic
// subjekt - klient/podepisujici - jen pridat -  KE_SCHVALENI_B   -- taky smazat???

// --- stahnout - smlouva/usneseni/ostatni - vse!
// referent - vsechny stavy krome K_VALIDACI_PODPISU_A	K_VALIDACI_PODPISU_B	K_VALIDACI_PODPISU_ROPID
// ostatni - vse krome    KONCEPT, K_PREPRACOVANI,     K_VALIDACI_PODPISU_A	K_VALIDACI_PODPISU_B	K_VALIDACI_PODPISU_ROPID

export const usePermissions = () => {
  const { isReferent, isOrgAdmin, isUserIdsk, isUserRopid, isKlient } = useUserAuth()
  const { submissionData, isHistoryDetail } = useFormContextBase()
  const place = submissionData.workflowPlaceCode

  const isNormalOrgAdminKlient = (isOrgAdmin || isKlient) && !isUserIdsk && !isUserRopid
  const isHistory = isHistoryDetail

  return {
    // canCreateContract: isReferent,
    canReadHistory: isReferent,
    canReadContract: isReferent || ![WP.KONCEPT, WP.K_PREPRACOVANI, undefined].includes(place),
    canEditContract:
      isReferent &&
      [
        WP.KONCEPT,
        WP.PRIPRAVA_DAVKY,
        WP.PRIPRAVA_K_PODPISU_DAVKA,
        WP.KE_KONTROLE_GINIS,
        WP.K_PREPRACOVANI,
        WP.KE_SCHVALENI_KRAJ,
        WP.PRIPRAVA_K_PODPISU,
        undefined,
      ].includes(place) &&
      //TODO kdy muze podepisujici/klient neco pridavat do smlouvy?
      !isHistory,
    canDeleteContract: isReferent && [WP.KONCEPT].includes(place) && !isHistory,
    //akce
    canConvertToPdf:
      isReferent &&
      [WP.KONCEPT, WP.PRIPRAVA_K_PODPISU_DAVKA, WP.K_PREPRACOVANI, WP.PRIPRAVA_K_PODPISU].includes(place) &&
      !isHistory,
    canSign:
      isOrgAdmin &&
      !isHistory &&
      ((place === WP.K_PODPISU_A && isUserIdsk) ||
        (place === WP.K_PODPISU_B && !isUserIdsk && !isUserRopid) ||
        (place === WP.K_PODPISU_ROPID && isUserRopid)),
    canTemplateToDoc:
      isReferent && [WP.PRIPRAVA_DAVKY, WP.KE_SCHVALENI_KRAJ, WP.PRIPRAVA_K_PODPISU].includes(place) && !isHistory,
    //prilohy
    canEditAttachMain: isReferent && [WP.KONCEPT, WP.K_PREPRACOVANI, undefined].includes(place) && !isHistory,
    canEditAttachUsneseni:
      ((isReferent &&
        [
          WP.KONCEPT,
          WP.PRIPRAVA_DAVKY,
          WP.PRIPRAVA_K_PODPISU_DAVKA,
          WP.KE_KONTROLE_GINIS,
          WP.K_PREPRACOVANI,
          WP.KE_SCHVALENI_KRAJ,
          WP.PRIPRAVA_K_PODPISU,
          undefined,
        ].includes(place)) ||
        (isNormalOrgAdminKlient && [WP.KE_SCHVALENI_B].includes(place))) &&
      !isHistory,
    canEditAttachOther:
      ((isReferent &&
        [
          WP.KONCEPT,
          WP.PRIPRAVA_DAVKY,
          WP.PRIPRAVA_K_PODPISU_DAVKA,
          WP.KE_KONTROLE_GINIS,
          WP.K_PREPRACOVANI,
          WP.KE_SCHVALENI_KRAJ,
          WP.PRIPRAVA_K_PODPISU,
          WP.KONTROLA_PRED_VYRIZENIM,
          undefined,
        ].includes(place)) ||
        (isNormalOrgAdminKlient && [WP.KE_SCHVALENI_B].includes(place))) &&
      !isHistory,
  }
}
