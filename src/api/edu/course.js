import request from '@/utils/request'

export default {
    /**
     * 课程列表（分页查询）
     * @param {当前页} current 
     * @param {每页记录数} limit 
     * @param {条件对象 json} courseQuery 
     * @returns 
     */
     getCourseListPage(current, limit, courseQuery) {
        return request({
            url: `/eduservice/course/pageCourseCondition/${current}/${limit}`,
            method: 'post',
            // courseQuery 条件对象，后端使用@RequestBody获取数据，这里使用data将传送json数据
            data: courseQuery
        })
    },
    // 删除课程信息
    deleteCourseById(courseId){
        return request({
            url: `/eduservice/course/delCourseInfo/${courseId}`,
            method: 'delete'
        })
    },
    // 添加课程信息
    addCourseInfo(courseInfo) {
        return request({
            url: `/eduservice/course/addCourseInfo`,
            method: 'post',
            data: courseInfo
        })
    },
    // 查询所有讲师
    getTeacherList(){
        return request({
            url: `/eduservice/teacher/findAll`,
            method: 'get'
        })
    },
    // 查询课程信息
    getCourseInfoById(courseId){
        return request({
            url: `/eduservice/course/getCourseInfo/${courseId}`,
            method: 'get'
        })
    },
    // 修改课程信息
    updateCourseInfo(courseInfo){
        return request({
            url: `/eduservice/course/updateCourseInfo`,
            method: 'post',
            data: courseInfo
        })
    },
    // 查询课程发布信息
    getPubllshInfo(courseId){
        return request({
            url: `/eduservice/course/getCoursePublishInfo/${courseId}`,
            method: 'get'
        })
    },
    // 课程的最终发布
    publishCourseInfo(courseId){
        return request({
            url: `/eduservice/course/publishCourseInfo/${courseId}`,
            method: 'put'
        })
    }

}


