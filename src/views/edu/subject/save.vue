<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a :href="'01.xlsx'">点击下载模版</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="VUE_APP_BASE_API + '/eduservice/subject/import'"
          name="file"
          accept=".xls, .xlsx"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >
          <el-button
            :loading="loading"
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >{{ fileUploadBtnText }}</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      VUE_APP_BASE_API: process.env.VUE_APP_BASE_API, // 接口API地址
      fileUploadBtnText: "上传到服务器", // 按钮文字
      importBtnDisabled: false, // 按钮是否禁用
      loading: false,
    };
  },
  methods: {
    // 点击按钮上传文件到服务器
    submitUpload() {
      if (this.$refs.upload.uploadFiles.length != 0) {
        this.fileUploadBtnText = "正在上传";
        this.importBtnDisabled = true;
        this.loading = true;
        this.$refs.upload.submit();
      }
    },
    // 上传成功
    fileUploadSuccess() {
      this.loading = false;
      this.$message({
        type: "success",
        message: "添加课程成功",
      });
      // 上传完进行路由跳转
      this.$router.push({ path: "/subject/list" });
    },
    // 上传失败
    fileUploadError() {
      this.loading = false;
      this.$message({
        type: "error",
        message: "添加课程失败",
      });
    },
  },
};
</script>