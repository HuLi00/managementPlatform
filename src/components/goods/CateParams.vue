<template>
  <div>
<!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图-->
    <el-card>
<!--      提示框-->
      <el-alert
              title="注意！只允许为第三级分类设置相关参数！"
              type="warning" :closable="false" show-icon>
      </el-alert>
<!--      选择商品分类区域-->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
<!--          级联选择框-->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="{ expandTrigger: 'hover', value:'cat_id',label:'cat_name',children:'children',checkStrictly:true}"
            @change="selectedCateChange" clearable>
          </el-cascader>
        </el-col>
      </el-row>
<!--      标签页的选择-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
<!--        动态参数渲染-->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="btnDisabled" @click="addParamsDialogVisiable = true">添加参数</el-button>
          <el-table border stripe :data="manyTableData">
<!--            展开行-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals " :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
<!--                添加按钮与输入文本框之间的切换-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParamsShowDialog(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
<!--        静态属性渲染-->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="btnDisabled" @click="addParamsDialogVisiable = true">添加属性</el-button>
          <el-table border stripe :data="onlyTableData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals " :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                <!--                添加按钮与输入文本框之间的切换-->
                <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParamsShowDialog(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
<!--      添加参数弹出对话框-->
      <el-dialog
              :title="'添加' + DialogTitle"
              :visible.sync="addParamsDialogVisiable"
              width="50%" @close="addDialogClosed">
        <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef" label-width="100px">
          <el-form-item :label="DialogTitle" prop="attr_name">
            <el-input v-model="addParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addParamsDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
      </el-dialog>
<!--      修改参数弹出对话框-->
      <el-dialog
              :title="'修改' + DialogTitle"
              :visible.sync="editParamsDialogVisiable"
              width="50%" @close="editDialogClosed">
        <el-form :model="editParamsForm" :rules="editParamsFormRules" ref="editParamsFormRef" label-width="100px">
          <el-form-item :label="DialogTitle" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editParamsDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "CateParams",
    data() {
      return {
        cateList:[],
        selectedCateKeys:[],
        activeName:'many',
        manyTableData:[],
        onlyTableData:[],
        addParamsDialogVisiable: false,
        addParamsForm:{
          attr_name: ''
        },
        addParamsFormRules: {
          attr_name: [{
            required:true,
            message:'请输入参数名称',
            trigger:'blur'
          }]
        },
        //修改参数对话框配置
        editParamsDialogVisiable:false,
        editParamsForm:{
          attr_name:''
        },
        editParamsFormRules:{
          attr_name: [{
            required:true,
            message:'请输入参数名称',
            trigger:'blur'
          }]
        },
      }
    },
    methods: {
      async getCateList() {
        const {data:res} = await this.$http.get('categories',{params:{
          type:3
          }});
        if(res.meta.status !== 200) {
          return this.$message.error('获取商品参数列表失败！')
        }else {
          this.cateList = res.data;
        }
      },
      selectedCateChange() {
        this.getParamsData();
      },
      handleTabClick() {
        this.getParamsData();
      },
      //获取参数的列表数据
      async getParamsData() {
        if(this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = [];
          this.manyTableData = [];
          this.onlyTableData = [];
          return;
        }
        //根据所选分类的Id，和当前所处的面板，获取对应的参数
        const {data:res} =await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
        if(res.meta.status !== 200) {
          return this.$message.error('获取商品参数列表失败')
        }
        res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
        item.inputVisible = false;
        item.inputValue = '';
        })
        console.log(res);
        if(this.activeName === 'many') {
          this.manyTableData = res.data;
        }else {
          this.onlyTableData = res.data;
        }
      },
      addDialogClosed() {
        this.$refs.addParamsFormRef.resetFields()
      },
      addParams() {
        this.$refs.addParamsFormRef.validate(async valid => {
          if(!valid) return
          const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
            })
          if(res.meta.status !== 201) {
            return this.$message.error('添加参数失败')
          }
            this.$message.success('添加参数成功');
            this.addParamsDialogVisiable = false;
            this.getParamsData();
        })
      },
      //修改添加操作
      async editParamsShowDialog(attr_id) {
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{parmas:{
          attr_sel:this.activeName
          }});
        if(res.meta.status !== 200) {
          return this.$message.error('参数修改失败')
        }else {
          this.editParamsForm = res.data;
        }
        this.editParamsDialogVisiable = true;
      },
      editDialogClosed() {
        this.$refs.editParamsFormRef.resetFields()
      },
      editParams() {
        this.$refs.editParamsFormRef.validate(async valid => {
          if(!valid) return
          const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,{
            attr_name:this.editParamsForm.attr_name, attr_sel:this.activeName
          })
          if(res.meta.status !== 200) {
            return this.$message.error('修改参数失败')
          }
          this.$message.success('修改参数成功');
          this.getParamsData();
          this.editParamsDialogVisiable = false
        })
      },
      //删除操作
      async removeParams(attr_id) {
        const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmResult !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if(res.meta.status !== 200) {
          return this.$message.error('删除参数失败！');
        }
        this.$message.success('删除参数成功！');
        this.getParamsData();
      },
      showInput(row) {
        row.inputVisible = true;
      //  让文本框自动获得焦点
      //  $nextTick方法的作用，就是页面上的元素被重新渲染之后，才会指定回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        })
      },
     async handleInputConfirm(row) {
        if(row.inputValue.trim() === 0) {
          row.inputValue = '';
          row.inputVisible = false;
          return;
        }
        let arr = row.inputValue.trim()
        if(arr.length !== 0) {
          row.attr_vals.push(arr);
          row.inputValue = '';
          row.inputVisible = false;
        }
        //发起请求，保存此次操作
       if(arr.length !== 0) {
          this.saveAttrVals(row);
        }
       row.inputVisible = false;
       row.inputValue = '';
      },
      //删除对应参数可选项
      handleClose(index,row) {
        row.attr_vals.splice(index,1);
        this.saveAttrVals(row);
      },
      //将修改网络请求attr_vals保存成函数
      async saveAttrVals(row) {
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        });
        if(res.meta.status !== 200) {
          return this.$message.error('修改参数项失败')
        }
        this.$message.success('修改参数项成功')
      }
    },
    created() {
      this.getCateList()
    },
    computed: {
      btnDisabled() {
        if(this.selectedCateKeys.length !== 3){
          return true;
        }
        return false;
      },
      cateId() {
        if (this.selectedCateKeys.length === 3) {
          return this.selectedCateKeys[2];
        }
        return null;
      },
      DialogTitle() {
        if (this.activeName === 'many') {
          return '动态参数'
        }else {
          return '静态属性'
        }
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin: 15px 0px;
  }
  .el-tag {
    margin: 10px;
  }
  .input-new-tag {
    width: 150px;
  }
</style>