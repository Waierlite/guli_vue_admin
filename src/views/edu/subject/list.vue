<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      placeholder="Filter keyword"
      style="margin-bottom: 30px"
    />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>

<script>
import subject from "@/api/edu/subject";

export default {
  data() {
    return {
      filterText: "",
      data2: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
  },
  created() {
    this.getSubjectInfo();
  },
  methods: {
    // 检索方法
    filterNode(value, data) {
      if (!value) return true;
      // 不区分大小写(统一 toLowerCase() 转为小写进行比较检索)
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    getSubjectInfo() {
      subject.getSubjectList().then((response) => {
        this.data2 = response.data.list;
      });
    },
  },
};
</script>

