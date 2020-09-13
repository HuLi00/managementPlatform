<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/rights' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="roleList" stripe border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="['bdbottom', index1 === 0 ? 'bdtop' : '','vcenter']">
<!--             渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
<!--              渲染二三级权限-->
              <el-col :span="19">
                <el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="[index2 ===0 ? '':'bdtop', 'vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                      <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="primary" size="mini">编辑</el-button>
            <el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button>
            <el-button icon="el-icon-setting" type="warning" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%" @close="setRightDialogClosed">
      <el-tree :data="rightsTree" :props="TreeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        roleList: [],
        setRightDialogVisible: false,
        rightsTree: [],
        TreeProps: {
          label: 'authName',
          children: 'children',
        },
        defKeys: [],
        roleId: [],
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      async getRolesList() {
        const {data:res} = await this.$http.get('roles');
        if(res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败')
        }else {
          this.roleList = res.data;
          // console.log(res.data);
        }
      },
      async removeRightById(role,rightId) {
        const confirmResult = await this.$confirm('是否删除该权限?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmResult !== 'confirm') {
          return this.$message.info('未取消权限')
        }
        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
        if(res.meta.status !== 200) {
          return this.$message.error('取消权限失败')
        }else {
          this.$message.success('权限已取消');
          role.children = res.data;
        }
      },
      async showSetRightDialog(role) {
        this.roleId = role.id;
        const {data:res} = await this.$http.get('rights/tree');
        if(res.meta.status !== 200) {
          return this.$message.error('获取权限树失败')
        }
        this.rightsTree = res.data;
        this.getLeafKeys(role,this.defKeys)
        this.setRightDialogVisible = true;
      },
      getLeafKeys(node,arr) {
        if(!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item => this.getLeafKeys(item,arr))
      },
      setRightDialogClosed() {
        this.defKeys = [];
      },
      async allotRights() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ];
        const idStr = keys.join(',');
        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{
          rids: idStr
        })
        if(res.meta.status !== 200) {
          return this.$message.error('分配权限失败')
        }else {
          this.$message.success('分配权限成功')
          this.getRolesList();
        }
        this.setRightDialogVisible = false;
      },
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>