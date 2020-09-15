<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path:'/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <!--      input输入框-->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table
              :data="goodsList"
              border
              stripe
              style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
                prop="goods_name"
                label="商品名称">
        </el-table-column>
        <el-table-column
                prop="goods_price"
                label="商品价格（元）" width="130px">
        </el-table-column>
        <el-table-column
                prop="goods_weight"
                label="商品重量" width="90px">
        </el-table-column>
        <el-table-column
                prop="add_time"
                label="创建时间"
                width="200px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
              @size-change="goodsHandleSizeChange"
              @current-change="goodsHandleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="this.total*1" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "GoodsList",
    data () {
      return {
        queryInfo: {
         query:'',
         pagenum: 1,
         pagesize: 10
        },
        addGoodsDialogVisible:false,
        goodsList:[],
        total:'',
      }
    },
    methods: {
      async getGoodsList() {
        const {data:res} = await this.$http.get('goods', {params:this.queryInfo})
        if(res.meta.status !== 200) {
          return this.$message.error('获取商品列表失败')
        }
        this.goodsList = res.data.goods;
        this.total = res.data.total;
        console.log(this.goodsList);
      },
      goodsHandleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getGoodsList();
      },
      goodsHandleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();
      },
      async removeById(goodsId) {
        const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if(confirmResult !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        const {data:res} = await this.$http.delete(`goods/${goodsId}`);
        if(res.meta.status !== 200) {
          return this.$message.error('删除失败！')
        }
        this.$message.success('删除成功')
        this.getGoodsList();
      },
      addGoodsPage() {
        this.$router.push('goods/add')
      }
    },
    created() {
      this.getGoodsList();
    },
    computed: {
      addtime() {
        return 1;
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin: 15px;
  }
</style>