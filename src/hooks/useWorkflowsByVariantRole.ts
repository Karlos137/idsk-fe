import { useFilterContext } from '../context/FilterContext'
import { VARIANTS_TABLE_CONTRACTBATCHES, VARIANTS_TABLE_CONTRACTS } from '../enums/enumTablesVariants'
import { WORKFLOW_PLACES as WP, WORKFLOW_PLACES_BATCH as WPB } from '../enums/enumWorkflowPlaces'
import { useUserAuth } from './useUserAuth'

export const useWorkflowsByVariantRole = (isBatch?: boolean) => {
  const { variant } = useFilterContext()
  const { isReferent, isOrgAdmin, isKlient, isUserIdsk, isUserRopid } = useUserAuth()

  if (isBatch) {
    if (variant === VARIANTS_TABLE_CONTRACTBATCHES.vsechny) {
      return []
    }
    if (variant === VARIANTS_TABLE_CONTRACTBATCHES.vysporadane) {
      return [WPB.VYRIZENO]
    }
    if (variant === VARIANTS_TABLE_CONTRACTBATCHES.kvyrizeni) {
      return [WPB.PRIPRAVA, WPB.ODESLANO]
    }
  }

  if (variant === VARIANTS_TABLE_CONTRACTS.kvyrizeni) {
    if (isReferent) {
      // admin + referent
      return [
        WP.KONCEPT,
        WP.PRIPRAVA_DAVKY,
        WP.KE_SCHVALENI_KRAJ_DAVKA,
        WP.PRIPRAVA_K_PODPISU_DAVKA,
        WP.KE_KONTROLE_GINIS,
        WP.K_PREPRACOVANI,
        WP.KE_SCHVALENI_KRAJ,
        WP.PRIPRAVA_K_PODPISU,
        WP.KONTROLA_PRED_VYRIZENIM,
      ]
    } else if (isOrgAdmin || isKlient) {
      if (isUserIdsk) {
        // idsk podepis
        return [WP.K_PODPISU_A, WP.NEVALIDNI_PODPIS_A]
      } else if (isUserRopid) {
        //ropid - klient + podepisujici
        return [WP.KE_KONTROLE_ROPID, WP.K_PODPISU_ROPID, WP.NEVALIDNI_PODPIS_ROPID]
      } else {
        // klient + podepisujici
        return [WP.KE_SCHVALENI_B, WP.K_PODPISU_B, WP.NEVALIDNI_PODPIS_B]
      }
    } else {
      // idsk nahliz, nahlizejici, ropid - nahlizejici
      return []
    }
  }

  if (variant === VARIANTS_TABLE_CONTRACTS.uzavirane) {
    if (isReferent) {
      return [
        WP.KONCEPT,
        WP.KE_SCHVALENI_B,
        WP.PRIPRAVA_DAVKY,
        WP.KE_SCHVALENI_KRAJ_DAVKA,
        WP.PRIPRAVA_K_PODPISU_DAVKA,
        WP.K_PODPISU_B,
        WP.KE_KONTROLE_GINIS,
        WP.K_PODPISU_ROPID,
        WP.KE_KONTROLE_ROPID,
        WP.K_PODPISU_A,
        WP.K_PREPRACOVANI,
        WP.K_VALIDACI_PODPISU_A,
        WP.K_VALIDACI_PODPISU_B,
        WP.K_VALIDACI_PODPISU_ROPID,
        WP.NEVALIDNI_PODPIS_A,
        WP.NEVALIDNI_PODPIS_B,
        WP.NEVALIDNI_PODPIS_ROPID,
        WP.KONEC_PODEPISOVANI_SMLOUVY,
        WP.KE_SCHVALENI_KRAJ,
        WP.PRIPRAVA_K_PODPISU,
        WP.KONTROLA_PRED_VYRIZENIM,
      ]
    } else {
      //idsk podpis + nahlizejici, klidet + podepisujici + nahlizejici, ropid -
      return [
        WP.KE_SCHVALENI_B,
        WP.PRIPRAVA_DAVKY,
        WP.KE_SCHVALENI_KRAJ_DAVKA,
        WP.PRIPRAVA_K_PODPISU_DAVKA,
        WP.K_PODPISU_B,
        WP.KE_KONTROLE_GINIS,
        WP.K_PODPISU_ROPID,
        WP.KE_KONTROLE_ROPID,
        WP.K_PODPISU_A,
        WP.K_VALIDACI_PODPISU_A,
        WP.K_VALIDACI_PODPISU_B,
        WP.K_VALIDACI_PODPISU_ROPID,
        WP.NEVALIDNI_PODPIS_A,
        WP.NEVALIDNI_PODPIS_B,
        WP.NEVALIDNI_PODPIS_ROPID,
        WP.KONEC_PODEPISOVANI_SMLOUVY,
        WP.KE_SCHVALENI_KRAJ,
        WP.PRIPRAVA_K_PODPISU,
        WP.KONTROLA_PRED_VYRIZENIM,
      ]
    }
  }

  if (variant === VARIANTS_TABLE_CONTRACTS.archivovane) {
    return [WP.STORNO, WP.VYRIZENO]
  }

  return []
}
