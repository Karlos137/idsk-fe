import React from 'react'
import { Link } from 'react-router-dom'
import { LINKS } from '../../components/App/LINKS'
import ButtonGovConfirm from '../../components/Btns/ButtonGovConfirm'
import InputSelectGov from '../../components/Inputs/InputSelectGov'
import { iSubmissionDataContract } from '../../interfaces/ISubmissionData'

export const CONTRACTS_STATES = {
  schvaleno: 'schvaleno',
  prepracovat: 'prepracovat',
  revokovat: 'revokovat',
  stornovat: 'stornovat',
}

const contractStatesOptions = [
  { label: 'Schválená', value: CONTRACTS_STATES.schvaleno },
  { label: 'Přepracovat', value: CONTRACTS_STATES.prepracovat },
  { label: 'Revokovat', value: CONTRACTS_STATES.revokovat },
  { label: 'Stornovat', value: CONTRACTS_STATES.stornovat },
]

interface iContractsListBlock {
  contracts: iSubmissionDataContract[]
  setContracts: (contracts: iSubmissionDataContract[]) => void
  constractsStates: { [contractId: string]: string }
  setContractsStates: (states: any) => void
  disabled?: boolean
  selectMode?: boolean
}

const ContractsListBlock = ({
  contracts,
  setContracts,
  disabled,
  selectMode,
  constractsStates,
  setContractsStates,
}: iContractsListBlock) => {
  const deleteCon = (id: string) => {
    setContracts(contracts.filter((con) => con.id !== id))
  }

  const changeContractState = (contractId: string, state: string) => {
    setContractsStates((constractsStates: any) => ({ ...constractsStates, [contractId]: state }))
  }

  const disabledSelect = disabled && !selectMode

  return (
    <table>
      <tbody>
        {contracts.map((c) => (
          <tr key={c.id}>
            <td>
              <Link to={LINKS.prehledSmluv + '/' + c.id}>{c.data.smlouvaInfo?.nazev}</Link>
            </td>
            <td>{c.data.subjektStranyA?.cisloSmlouvyStranyA}</td>
            <td width={350}>
              {!disabled && (
                <ButtonGovConfirm
                  confirmText='Opravdu odebrat smlouvu?'
                  variant='primary-outlined'
                  onClick={() => deleteCon(c.id)}
                >
                  Odebrat
                </ButtonGovConfirm>
              )}
              {(selectMode || disabledSelect) && (
                <div>
                  <InputSelectGov
                    label='Výsledek usnesení'
                    name={'smlouva' + c.id}
                    options={contractStatesOptions}
                    value={constractsStates[c.id] || CONTRACTS_STATES.schvaleno}
                    onChange={(e) => changeContractState(c.id, e.target.value)}
                    disabled={disabledSelect}
                  />
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ContractsListBlock
