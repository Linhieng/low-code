import axios from "axios"
import { SERVER_HOST } from '@/constants/index'

export default function () {
  return new Promise(async (res, rej) => {
    try {
      const resData = await axios.get(`${SERVER_HOST}api/getAllPages`)
      if (resData.status === 200) {
        res(resData.data)
      }
      rej(resData.data.msg)
    } catch (e) {
      console.error(e)
      rej(e.message)
    }
  })
}
