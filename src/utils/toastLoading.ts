import { toast } from 'react-toastify'

export const toastLoading = () => {
  // const [id, setID] = useState<number | string>(0)
  let id: string | number = 0

  const loading = (msg: string) => {
    id = toast.loading(msg)
    // setID(id)
  }

  const success = (msg: string) => {
    toast.update(id, { render: msg, type: 'success', isLoading: false, autoClose: 3000, closeButton: true })
  }

  const error = (msg: string) => {
    toast.update(id, { render: msg, type: 'error', isLoading: false, autoClose: 5000, closeButton: true })
  }

  return { loading, success, error }
}
