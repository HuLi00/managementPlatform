<template>
  <div>
<!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
<!--      button区域-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
<!--      渲染表单区域-->
      <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border class="treeTable">
<!--        是否有效-->
        <template slot="isOK" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted ===false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
<!--        排序-->
        <template slot="order" slot-scope="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini"v-else>三级</el-tag>
        </template>
        <template slot="option" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
<!--      数据分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.pagenum"
                :page-size="queryInfo.pagesize"
                layout="prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </el-card>
<!--    添加分类对话框-->
    <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%" @close="addCateDialogClosed">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
<!--          级联选择器-->
          <el-cascader
                  v-model="selectedKeys"
                  :options="parentsCateList"
                  :props="{ expandTrigger: 'hover',value: 'cat_id', label: 'cat_name',children: 'children', checkStrictly:true}"
                  @change="parentsCateChanged" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Cate",
    data() {
      return {
        cateList: [],
        queryInfo:{
          type:3,
          pagenum:1,
          pagesize:5
        },
        total:0,
        columns:[
          {
          label:'分类名称',
          prop: 'cat_name'
          },
          {
          label:'是否有效',
          type:'template',
          template:'isOK'
          },
          {
            label:'排序',
            type:'template',
            template:'order'
          },
          {
            label:'操作',
            type:'template',
            template:'option'
          }
        ],
        addCateDialogVisible: false,
        addCateForm: {
          //添加分类名称
          cat_name:'',
          //父级分类的Id
          cat_pid:0,
          //分类的等级
          cat_level:0
        },
        //添加分类表单的验证规则
        addCateFormRules: {
          cat_name: [
            { required:true, message:'请输入分类名称', trigger:'blur'}
          ]
        },
        parentsCateList:[],
        selectedKeys:[],
      }
    },
    methods: {
      async getCateList() {
        const {data:res} = await this.$http.get('categories',{params:this.queryInfo});
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品列表失败')
        }else{
          this.cateList = res.data.result;
          this.total = res.data.total;
        }
      },
      handleSizeChange(newsize) {
        this.queryInfo.pagesize = newsize;
        this.getCateList();
      },
      handleCurrentChange(newpage) {
        this.queryInfo.pagenum = newpage;
        this.getCateList();
      },
      showAddCateDialog() {
        this.getParentsCateList();
        this.addCateDialogVisible = true;
      },
      async getParentsCateList() {
        const {data: res} = await this.$http.get('categories', { params:
              {type: 2}});
        if(res.meta.status !== 200) {
          return this.$message.error('父级分类获取失败')
        }else {
          this.parentsCateList = res.data;
        }
      },
      //在级联选择器中选择项发生变化就触发此函数
      parentsCateChanged() {
        // console.log(this.selectedKeys);
      //  如果selectedKeys数组中的length大于0，证明选中了父级分类，反之，就说明没有选中任何父级分类
        if (this.selectedKeys.length > 0) {
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
          this.addCateForm.cat_level = this.selectedKeys.length;
          return
        }else {
          this.addCateForm.cat_pid = 0;
          this.addCateForm.cat_level = 0;
        }
      },
      addCateDialogClosed() {
        this.$refs.addCateFormRef.resetFields();
        this.selectedKeys = [];
        this.addCateForm.cat_level = 0;
        this.addCateForm.cat_pid = 0;
      },
      addCate() {
        this.$refs.addCateFormRef.validate(async valid => {
          if(!valid) return
          const {data:res} = await this.$http.post('categories',this.addCateForm)
          if(res.meta.status !== 201) {
            return this.$message.error('添加分类失败')
          }
          this.$message.success('添加分类成功');
          this.getCateList();
          this.addCateDialogVisible = false
        })
      }
    },
    created() {
      this.getCateList()
    }
  }
</script>

<style scoped>
  .treeTable {
    margin-top: 15px;
  }
</style>