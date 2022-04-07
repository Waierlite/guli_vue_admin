<template>
  <div class="app-container">
    课程列表
    <hr />
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称" />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="courseQuery.status"
          clearable
          placeholder="课程状态"
        >
          <el-option :value="'Normal'" label="已发布" />
          <el-option :value="'Draft'" label="未发布" />
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="courseQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="courseQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()"
        >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程名称" width="200" />
      <el-table-column prop="subjectParentId" label="一级分类" />
      <el-table-column prop="subjectId" label="二级分类" />
      <el-table-column prop="price" label="课程价格" />
      <el-table-column prop="lessonNum" label="课时数" width="100" />
      <el-table-column prop="gmtCreate" label="创建时间" width="160" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === "Normal" ? "已发布" : "未发布" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >修改</el-button
            >
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page="page"
      :page-size="limit"
      :total="total"
      @current-change="getList"
    >
    </el-pagination>
  </div>
</template>

<script>
// 引入course.js的文件
import course from "@/api/edu/course";

export default {
  // 写核心代码位置
  data() {
    // 定义变量和初始值(组件里的data必须是 data() { return {} } 函数式，而不能用 data: {})
    return {
      list: null, // 查询之后接口返回集合
      page: 1, // 当前页
      limit: 10, // 每页记录数
      total: 0, // 总记录数
      courseQuery: {}, // 条件封装对象
    };
  },
  created() {
    // 页面渲染之前执行，一般调用methods定义方法
    // 调用方法
    this.getList();
  },
  methods: {
    // 创建具体方法，调用course.js定义的方法
    // 课程列表的方法
    getList(page = 1) {
      this.page = page;
      course
        .getCourseListPage(this.page, this.limit, this.courseQuery)
        .then((response) => {
          // 请求成功
          // console.log(response)
          this.list = response.data.pageObject.records;
          this.total = response.data.pageObject.total;
          console.log(this.list);
          console.log(this.total);
        })
        .catch((error) => {
          // 请求失败
          console.log(error);
        });
    },
    // 清空查询条件方法
    resetData() {
      // 清空查询条件courseQuery
      this.courseQuery = {};
      // 重新查询全部课程信息
      this.getList();
    },
    // 删除课程方法
    removeDataById(id) {
      this.$confirm("此操作将永久删除该课程信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用删除的方法
          course.deleteCourseById(id).then((response) => {
            // 提示信息
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 刷新页面信息
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

