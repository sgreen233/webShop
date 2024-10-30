<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    goBack() {
      console.log('go back');
    }
  },
  mounted() {

  }



}
</script>

<template>
  <el-page-header @back="goBack" content="在线会议室列表" class="roommassage"></el-page-header>
  <div class="roomlist">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.roommassage {
  font-size: 30px;
  margin-bottom: 30px;
  background-color: powderblue;
  border-bottom: 1px solid #eee;
}

.roomlist {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  gap: 60px;
  width: 100%;
  height: 70vh;
}

.el-row {
  margin-top: 30px;
  width: 90%;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
