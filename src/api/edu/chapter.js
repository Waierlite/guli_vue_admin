import request from '@/utils/request'

export default {
    /**
     * 查询章节大纲
     * @returns 
     */
    getChapterInfo(courseId) {
        return request({
            url: `/eduservice/chapter/getChapterVideo/${courseId}`,
            method: 'get'
        })
    },
    // 增加章节
    addChapterInfo(chapter) {
        return request({
            url: `/eduservice/chapter/addChapter`,
            method: 'post',
            data: chapter
        })
    },
    // 删除章节
    delChapterInfo(chapterId) {
        return request({
            url: `/eduservice/chapter/delChapter/${chapterId}`,
            method: 'delete'
        })
    },
    // 修改章节
    updateChapterInfo(chapter) {
        return request({
            url: `/eduservice/chapter/updateChapter`,
            method: 'post',
            data: chapter
        })
    },
    // 查询章节ById
    getChapterInfoById(chapterId) {
        return request({
            url: `/eduservice/chapter/getChapterInfo/${chapterId}`,
            method: 'get'
        })
    },
}


