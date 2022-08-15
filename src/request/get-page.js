import axios from "axios"
import { SERVER_HOST } from '@/constants/index'
import { getPath } from "@/utils/index"

export default function (data) {
  return new Promise(async (res, rej) => {
    try {
      const resData = await axios.get(`${SERVER_HOST}api/page/${getPath()}`, data)
      if (resData.status === 200) {
        res(resData.data)
      }
      console.log('debugger: ', resData)
      rej(resData.data.msg)
    } catch (e) {
      console.error(e)
      rej(e.message)
    }
  })
}
