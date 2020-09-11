/*这个request暂时没用上*/
//导入axios
import axios from 'axios'

//导出request
export function request(config){
  //创建axios实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 10000
  })
  return instance(config);
}