import { useContextMenu } from 'react-contexify'
import { useSelector } from 'react-redux'
import { useFilterContext } from '../context/FilterContext'
import { setContextMenuData } from '../redux/global/globalSlice'
import { selectContextMenuData } from '../redux/global/selectors'
import { useAppDispatch } from '../redux/store'

export const useContextMenuApp = () => {
  const { contextName } = useFilterContext()

  const dispatch = useAppDispatch()
  const { show } = useContextMenu({
    id: contextName,
  })

  const showContextMenu = (data?: any, props?: any) => (event: any) => {
    dispatch(setContextMenuData(data))

    show(event, {
      props: props,
    })
  }

  const contextMenuData = useSelector(selectContextMenuData)

  return { showContextMenu, contextMenuData, contextName }
}
