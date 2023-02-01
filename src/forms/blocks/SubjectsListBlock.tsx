import React from 'react'
import ButtonGovConfirm from '../../components/Btns/ButtonGovConfirm'
import { iOrgData } from '../../interfaces/IOrgData'

interface iContractsListBlock {
  orgs: iOrgData[]
  setOrgs: (orgs: iOrgData[]) => void
}

const SubjectsListBlock = ({ orgs, setOrgs }: iContractsListBlock) => {
  const deleteOrg = (id: string) => {
    setOrgs(orgs.filter((org) => org.id !== id))
  }

  return (
    <table>
      <tbody>
        {orgs.map((org) => (
          <tr key={org.id}>
            <td>{org.name}</td>
            <td>{org.identifications?.ic}</td>
            <td width={300}>
              <ButtonGovConfirm
                confirmText='Opravdu odebrat obec?'
                variant='primary-outlined'
                onClick={() => deleteOrg(org.id)}
              >
                Odebrat
              </ButtonGovConfirm>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default SubjectsListBlock
