import { useEffect, useRef } from 'react'

/*
  React 18: pokud je zapnuty StrictMode, tak se dvakrat vola useEffect(...,[])
  nebo odstranit komponentu StrictMode z indexu
  v produkcnim buildu by to melo fungovat spravne
  https://github.com/facebook/react/issues/24502
 */

export const useEffectStart = (fn: () => void) => {
  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) {
      return
    }
    fn()
    isMounted.current = true
  }, [fn])
}
