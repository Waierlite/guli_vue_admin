import request from '@/utils/request'

export default {

    // 增加课时
    addVideoInfo(video) {
        return request({
            url: `/eduservice/video/addVideo`,
            method: 'post',
            data: video
        })
    },
    // 删除课时
    delVideoInfo(videoId) {
        return request({
            url: `/eduservice/video/delVideo/${videoId}`,
            method: 'delete'
        })
    },
    // 修改课时
    updateVideoInfo(video) {
        return request({
            url: `/eduservice/video/updateVideo`,
            method: 'post',
            data: video
        })
    },
    // 查询课时ById
    getVideoInfoById(videoId) {
        return request({
            url: `/eduservice/video/getVideoInfo/${videoId}`,
            method: 'get'
        })
    },
    // 删除服务器视频
    delVideoById(videoSourceId) {
        return request({
            url: `/eduvod/video/removeVideo/${videoSourceId}`,
            method: 'delete'
        })
    },
}


