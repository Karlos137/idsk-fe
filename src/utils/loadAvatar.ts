import { toast } from 'react-toastify'
import IamApi from '../api/IamApi'

interface iUserAvatarData {
  id: string
  contentUrl: string
  owner: string
  file: {
    name: string
    safeName: string
    extension: string
    mimeType: string
    mimeTypeExtension: string
    size: number
    hash: string
  }
  createdAt: string
  updatedAt: string
}

export interface AvatarData {
  avatarId: string
  base64: any
}

export const loadAvatar = (): Promise<AvatarData> =>
  IamApi.getAvatarMine().then((res) => {
    if (res?.id) {
      return IamApi.getAvatarContent(res.id).then((img) => {
        return loadBase64(img).then((base64) => {
          return {
            avatarId: res.id,
            base64: base64,
          }
        })
      })
    } else {
      return {
        avatarId: '',
        base64: '',
      }
    }
  })

const loadBase64 = (img: Blob) =>
  new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsDataURL(img)
    reader.onload = function () {
      resolve(reader.result)
    }
    reader.onerror = function (error) {
      console.log('Error: ', error)
      toast.error('Chyba převodu obrázku do base64')
      reject('Chyba převodu obrázku do base64')
    }
  })
