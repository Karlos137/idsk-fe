import { useSelector } from 'react-redux'
import { selectUserRolesTypes } from '../redux/enums/selectors'

export const useUserRolesTypes = () => {
  const userRolesTypesFull = useSelector(selectUserRolesTypes)

  const userRolesTypesOptions = userRolesTypesFull.map((d) => ({ label: d.name, value: d.identifier }))
  const userRolesTypesOptionsId = userRolesTypesFull.map((d) => ({ label: d.name, value: d.id }))

  // const findUserRoleById = (id: string) =>
  //   userRolesTypesFull.find(d => d.id === id)

  const findUserRoleByName = (name: string) => userRolesTypesFull.find((d) => d.identifier === name)

  return { userRolesTypesOptions, userRolesTypesFull, userRolesTypesOptionsId, findUserRoleByName }
}
