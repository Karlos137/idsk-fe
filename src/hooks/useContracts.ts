import { useState } from 'react'
import EformsApi, { SLUG_FORM_SMLOUVA } from '../api/EformsApi'
import { iSubmissionDataContract } from '../interfaces/ISubmissionData'
import { useFetch } from './useFetch'

export const useContracts = (id?: string) => {
  const [contractsList, setContracts] = useState<{ [id: string]: iSubmissionDataContract }>({})

  const contractOption = (contract: iSubmissionDataContract) => ({
    label: `${contract.data.smlouvaInfo?.nazev} - ${contract.data.subjektStranyA?.cisloSmlouvyStranyA}`,
    value: contract.id,
  })

  const searchContracts = (orgId?: string, workflowPlace?: string, dataOtherFilter?: any) => (query?: string) => {
    const dataFilter = dataOtherFilter ? dataOtherFilter : {}
    if (query) {
      dataFilter['data.smlouvaInfo.nazev'] = query
    }

    //TODO jen typ P01 nebo je to pokryto ve stavu workflow?
    const params = {
      ...(workflowPlace ? { workflowPlace: workflowPlace } : undefined),
      ...dataFilter,
      ...(orgId ? { organization: orgId } : undefined),
    }

    return EformsApi.getSubmissionsSearch(SLUG_FORM_SMLOUVA, 1, 20, params).then((res) => {
      const data = res.data as iSubmissionDataContract[]
      const newCons = data.reduce((p: any, c) => ({ ...p, [c.id]: c }), {})
      setContracts((cons) => ({ ...cons, ...newCons }))
      return data.map(contractOption)
    })
  }

  const defContract = useFetch<iSubmissionDataContract>(
    id
      ? () =>
          EformsApi.getSubmission(id).then((data) => {
            setContracts((contractsList) => ({ ...contractsList, [data.id]: data }))
            return data
          })
      : undefined,
  )

  const defContractOptions = defContract.data ? [contractOption(defContract.data)] : undefined

  return { searchContracts, contractsList, defContract, defContractOptions }
}
