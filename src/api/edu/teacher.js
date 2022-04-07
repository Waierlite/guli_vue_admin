import request from '@/utils/request'

export default {
    /**
     * 讲师列表（分页查询）
     * @param {当前页} current 
     * @param {每页记录数} limit 
     * @param {条件对象 json} teacherQuery 
     * @returns 
     */
    getTeacherListPage(current, limit, teacherQuery) {
        return request({
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            // teacherQuery 条件对象，后端使用@RequestBody获取数据，这里使用data将传送json数据
            data: teacherQuery
        })
    },
    /**
     * 按ID删除讲师方法（逻辑删除）
     * @param {讲师ID} id 
     * @returns 
     */
    deleteTeacherById(id) {
        return request({
            url: `/eduservice/teacher/del/${id}`,
            method: 'delete'
        })
    },
    /**
     * 添加讲师方法
     * @param {讲师对象 json} teacher 
     * @returns 
     */
    addTeacher(teacher){
        return request({
            url: `/eduservice/teacher/add`,
            method: 'post',
            data: teacher
        })
    },
    /**
     * 按ID查找讲师信息
     * @param {讲师ID} id 
     * @returns 
     */
    getInfoById(id){
        return request({
            url: `/eduservice/teacher/get/${id}`,
            method: 'get',
        })
    },
    /**
     * 修改讲师
     * @param {讲师对象 json} teacher 
     * @returns 
     */
    updateTeacherById(teacher){
        return request({
            url: `/eduservice/teacher/update`,
            method: 'put',
            data: teacher
        })
    }

}


