import request from '@/utils/request'

export default {
    /**
     * 课程列表（全部查询）
     * @returns 
     */
    getSubjectList() {
        return request({
            url: `/eduservice/subject/getAllSubject`,
            method: 'get'
        })
    }
}


