<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <!-- 添加章节按钮 -->
    <el-button type="text" @click="dialogChapterFormVisible = true"
      >添加章节</el-button
    >

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 上传视频组件 -->
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="VUE_APP_BASE_API + '/eduvod/video/uploadVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，<br />
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br />
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br />
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br />
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
        >
          确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button style="" type="text" @click="openVideoInfo(chapter.id)"
              >添加课时</el-button
            >
            <el-button style="" type="text" @click="openChapterInfo(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="delChapterInfo(chapter.id)"
              >删除</el-button
            >
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text" @click="editVideoInfo(video.id)"
                  >编辑</el-button
                >
                <el-button type="text" @click="delVideo(video.id)"
                  >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      saveVideoBtnDisabled: false, // 保存按钮是否禁用
      courseId: "",
      chapterList: [],
      dialogChapterFormVisible: false, // 是否显示章节表单
      dialogVideoFormVisible: false, // 是否显示课时表单
      chapter: {
        // 章节对象
        title: "",
        sort: 0,
        courseId: "",
      },
      video: {},
      fileList: [],
      VUE_APP_BASE_API: process.env.VUE_APP_BASE_API, // 接口API地址
    };
  },
  created() {
    // 获取courseId
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.chapter.courseId = this.$route.params.id;
    }
    this.getChapterInfo();
  },
  methods: {
    //==============================课时上传视频=========================================
    // 确定删除视频
    handleVodRemove() {
      // 调用接口的删除视频方法
      video.delVideoById(this.video.videoSourceId).then((res) => {
        this.$message({
          type: "success",
          message: "删除视频成功！",
        });
        // 将文件列表清空
        this.fileList = [];
        // 清空赋值
        this.video.videoSourceId = "";
        this.video.videoOriginalName = "";
      });
    },
    // 是否删除确认框
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name} ?`);
    },
    // 上传成功回调方法
    handleVodUploadSuccess(response, file, fileList) {
      // 获取上传视频id值
      this.video.videoSourceId = response.data.videoId;
      // 获取上传视频名称
      this.video.videoOriginalName = file.name;
    },
    // 上传最大数量限制
    handleUploadExceed() {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },

    //==============================课时操作=========================================
    openVideoInfo(chapterId) {
      this.video.chapterId = chapterId;
      this.video.courseId = this.courseId;
      this.dialogVideoFormVisible = true;
    },
    addVideo() {
      video.addVideoInfo(this.video).then((res) => {
        // 关闭弹框
        this.dialogVideoFormVisible = false;
        // 提示信息
        this.$message({
          type: "success",
          message: "添加课时成功!",
        });
        // 清除输入框数据
        this.video = {};
        this.fileList = [];
        // 刷新页面
        this.getChapterInfo();
      });
    },
    delVideo(videoId) {
      this.$confirm("此操作将永久删除该课时信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        video.delVideoInfo(videoId).then((res) => {
          // 提示信息
          this.$message({
            type: "success",
            message: "删除课时成功!",
          });
          // 刷新页面
          this.getChapterInfo();
        });
      });
    },
    editVideoInfo(videoId) {
      this.dialogVideoFormVisible = true;
      video.getVideoInfoById(videoId).then((response) => {
        this.video = response.data.item;
      });
    },
    updateVideo() {
      video.updateVideoInfo(this.video).then((res) => {
        // 关闭弹框
        this.dialogVideoFormVisible = false;
        // 提示信息
        this.$message({
          type: "success",
          message: "修改课时成功!",
        });
        // 清除输入框数据
        this.video = {};
        // 刷新页面
        this.getChapterInfo();
      });
    },
    saveOrUpdateVideo() {
      if (!this.video.id) {
        this.addVideo();
      } else {
        this.updateVideo();
      }
    },
    //==============================课程基本信息=========================================
    // 根据id查询course信息
    getChapterInfo() {
      chapter.getChapterInfo(this.courseId).then((res) => {
        this.chapterList = res.data.chapterList;
      });
    },
    previous() {
      this.$router.push({ path: `/course/info/${this.courseId}` });
    },
    next() {
      this.$router.push({ path: `/course/publish/${this.courseId}` });
    },
    //==============================章节操作=========================================
    // 添加章节
    saveOrUpdate() {
      if (!this.chapter.id) {
        this.addChapter();
      } else {
        this.updateChapter();
      }
    },
    addChapter() {
      chapter.addChapterInfo(this.chapter).then((res) => {
        // 关闭弹框
        this.dialogChapterFormVisible = false;
        // 提示信息
        this.$message({
          type: "success",
          message: "添加章节成功!",
        });
        // 清除输入框数据
        this.chapter = {};
        // 刷新页面
        this.getChapterInfo();
      });
    },
    delChapterInfo(chapterId) {
      this.$confirm("此操作将永久删除该章节信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        chapter.delChapterInfo(chapterId).then((res) => {
          // 提示信息
          this.$message({
            type: "success",
            message: "删除章节成功!",
          });
          // 刷新页面
          this.getChapterInfo();
        });
      });
    },
    updateChapter() {
      chapter.updateChapterInfo(this.chapter).then((res) => {
        // 关闭弹框
        this.dialogChapterFormVisible = false;
        // 提示信息
        this.$message({
          type: "success",
          message: "修改章节成功!",
        });
        // 清除输入框数据
        this.chapter = {};
        // 刷新页面
        this.getChapterInfo();
      });
    },
    // 回显章节信息
    openChapterInfo(chapterId) {
      // 弹框
      this.dialogChapterFormVisible = true;
      // 获取单个章节信息并回显
      chapter.getChapterInfoById(chapterId).then((res) => {
        this.chapter = res.data.chapter;
      });
    },
  },
};
</script>

