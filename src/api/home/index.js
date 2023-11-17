/*
 * @Author: 杨道博
 * @Date: 2023-07-13 10:59:29
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-15 13:49:31
 * @FilePath: \three-project\src\api\home\index.js
 * @Description: 后端接口配置
 */
import request from "../request"

//得到各断面以及相应渗压计的各参数
export function getSYParams(res_cd) {
    return request.get('/api/list', {
        params: {
            res_cd,
        }
    })
}

//得到各渗压计的数值
export function getPressVal(res_cd, start_tm, end_tm) {
    return request.get('/api/press', {
        params: {
            res_cd,
            start_tm,
            end_tm
        }
    })
}