import request from '@/utils/request'

export default {
    // 生成注册人数数据
    createStaData(date) {
        return request({
            url: `/staservice/sta/countRegister/${date}`,
            method: 'get'
        })
    },
    // 获取统计数据
    getDataSta(searchObj){
        return request({
            url: `/staservice/sta/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
            method: 'get'
        })
    }
}


