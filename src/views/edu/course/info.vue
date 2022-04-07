<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectChange"
        >
          <el-option
            v-for="subject in oneSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in twoSubjectList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程总课时 -->
      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 -->
      <el-form-item label="课程简介">
        <el-input type="textarea" :rows="8" v-model="courseInfo.description" placeholder=" " />
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="VUE_APP_BASE_API + '/eduoss/fileoss'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: {
        title: "",
        subjectId: "", // 二级分类
        subjectParentId: "", // 一级分类
        teacherId: "",
        lessonNum: 0,
        description: "",
        // cover: "https://guli-object.oss-cn-guangzhou.aliyuncs.com/avatar/b6045b55-6651-44e5-be10-a81181bffe13.jpg",
        cover: "cover.gif",
        price: 0,
        courseId: "",
      },
      teacherList: [],
      oneSubjectList: [],
      twoSubjectList: [],
      VUE_APP_BASE_API: process.env.VUE_APP_BASE_API,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // 初始化所有讲师
      this.getTeacherList();
      // 初始化分类信息
      this.getOneSubjectList();
      // 判断Url是否含有courseId
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id;
        // 根据id查询课程信息
        this.getCourseInfo();
      }
    },
    getCourseInfo() {
      course.getCourseInfoById(this.courseId).then((res) => {
        this.courseInfo = res.data.courseInfo;
        // 查询所有一级分类
        subject.getSubjectList().then((response) => {
          this.oneSubjectList = response.data.list;
          // 查询对应的二级分类
          this.oneSubjectList.forEach((element) => {
            if (this.courseInfo.subjectParentId === element.id) {
              this.twoSubjectList = element.children;
            }
          });
        });
      });
    },
    // 上传文件方法
    handleAvatarSuccess(response, file) {
      console.log(response); // 上传响应
      console.log(URL.createObjectURL(file.raw)); // base64编码
      this.courseInfo.cover = response.data.url;
    },
    // 数据校验（上传前）
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    addCourse() {
      course.addCourseInfo(this.courseInfo).then((response) => {
        // 提示信息
        this.$message({
          type: "success",
          message: "添加课程成功!",
        });
        // 跳转到下一步
        this.$router.push({ path: `/course/chapter/${response.data.courseId}` });
      });
    },
    updateCourse() {
      course.updateCourseInfo(this.courseInfo).then((res) => {
        // 提示信息
        this.$message({
          type: "success",
          message: "修改课程成功!",
        });
        // 跳转到下一步
        this.$router.push({ path: `/course/chapter/${this.courseId}` });
      });
    },
    next() {
      if (!this.courseInfo.id) {
        // 没有id则执行新增
        this.addCourse();
      } else {
        // 有id则执行修改
        this.updateCourse();
      }
    },
    // 查询所有教师
    getTeacherList() {
      course.getTeacherList().then((response) => {
        this.teacherList = response.data.items;
      });
    },
    // 查询所有一级分类
    getOneSubjectList() {
      subject.getSubjectList().then((response) => {
        this.oneSubjectList = response.data.list;
      });
    },
    // 修改一级分类，触发change加载二级分类（二级分类懒加载）
    subjectChange(oneSubjectId) {
      this.oneSubjectList.forEach((element) => {
        if (element.id === oneSubjectId) {
          this.twoSubjectList = element.children;
        }
      });
      this.courseInfo.subjectId = "";
    },
  },
};
</script>