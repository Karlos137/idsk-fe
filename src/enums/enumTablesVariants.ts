import { IDSK_SUBJEKT_TYPES } from './enumSubjektTypes'

export const VARIANTS_TABLE_CONTRACTS = {
  kvyrizeni: 'kvyrizeni',
  uzavirane: 'uzavirane',
  archivovane: 'archivovane',
}

export const VARIANTS_TABLE_CONTRACTS_OPTIONS = [
  { label: 'Smlouvy k vyřízení', value: VARIANTS_TABLE_CONTRACTS.kvyrizeni },
  { label: 'Smlouvy uzavírané', value: VARIANTS_TABLE_CONTRACTS.uzavirane },
  { label: 'Smlouvy archivované', value: VARIANTS_TABLE_CONTRACTS.archivovane },
]

export const VARIANTS_TABLE_CONTRACTBATCHES = {
  vsechny: 'vsechny',
  kvyrizeni: 'kvyrizeni',
  vysporadane: 'vysporadane',
}

export const VARIANTS_TABLE_CONTRACTBATCHES_OPTIONS = [
  { label: 'K vyřízení', value: VARIANTS_TABLE_CONTRACTBATCHES.kvyrizeni },
  { label: 'Všechny', value: VARIANTS_TABLE_CONTRACTBATCHES.vsechny },
  { label: 'Jen vyspořádané', value: VARIANTS_TABLE_CONTRACTBATCHES.vysporadane },
]

export const VARIANTS_TABLE_SUBJECTS_OPTIONS = [
  { label: 'Vše', value: '' },
  { label: 'Obce', value: IDSK_SUBJEKT_TYPES.OBEC },
  { label: 'Dopravci', value: IDSK_SUBJEKT_TYPES.DOPRAVCE },
  { label: 'Železniční dopravci', value: IDSK_SUBJEKT_TYPES.ZELEZNICE },
  { label: 'Kraje', value: IDSK_SUBJEKT_TYPES.KRAJ },
  { label: 'IDSK', value: IDSK_SUBJEKT_TYPES.IDSK },
  { label: 'Ostatní', value: IDSK_SUBJEKT_TYPES.OSTATNI },
]
