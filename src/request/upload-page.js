import axios from "axios"
import { SERVER_HOST } from '@/constants/index'

export default function (drawData) {
  return new Promise(async (res, rej) => {
    try {
      const resData = await axios.post(`${SERVER_HOST}api/uploadPage`, drawData)
      if (resData.status === 200) {
        res({status: 'success', data:resData.data})
      }
      res({ status: 'error', data: resData.data })
    } catch (error) {
      rej(error)
    }
  })
}
