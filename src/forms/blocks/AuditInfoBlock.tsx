import React from 'react'
import UserLink from '../../components/UserLink/UserLink'
import { dateFormatFull } from '../../utils/dateFormat'

interface iAuditInfoBlock {
  updatedAt?: string
  createdAt?: string
  updatedBy?: string
  createdBy?: string
}

export const AuditInfoBlock = ({ updatedAt, createdAt, updatedBy, createdBy }: iAuditInfoBlock) => {
  return (
    <fieldset>
      <legend>Auditní informace a uložení</legend>
      <table>
        <tbody>
          <tr>
            <td>Založeno:</td>
            <td>{dateFormatFull(createdAt)}</td>
            <td>
              <UserLink user={createdBy} />
            </td>
          </tr>
          <tr>
            <td>Naposledy změněno:</td>
            <td>{dateFormatFull(updatedAt)}</td>
            <td>
              <UserLink user={updatedBy} />
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
  )
}
