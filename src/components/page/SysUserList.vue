<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="addUser">添加用户</el-button>
                <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="userName" label="用户名" sortable width="150">
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="220">
                </el-table-column>
                <el-table-column prop="address" label="地址" :formatter="formatter">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total"  
                :pager-count="11"  :page-size="pageNum">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="operate ? '添加' : '编辑'" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="60px">
                <el-form-item label="用户名">
                   <el-input v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item v-if="operate" label="密码">
                    <el-input v-model="form.passWord"></el-input>
                </el-form-item>
                
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button  v-if="!operate" type="primary" @click="saveEdit">确 定</el-button>
                 <el-button v-if="operate" type="primary" @click="saveUserInfo">保 存</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button  type="primary" @click="deleteRow">确 定</el-button>
               
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { sysUserList,updatesUserById,addSysUser,delSysUser,batchDelSysUser } from '../../api/index';
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                pageNum:5,
                total:0,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    userName: '',
                    email: '',
                    address: ''
                },
                idx: -1,
                id: -1,
                operate:false //编辑为false ，添加为true
            }
        },
        created() {
           
            this.getData();
            
        },
         computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 调用接口获取系统用户列表
            getData() {
                var query = {'currentSize':this.cur_page,'pageNum':this.pageNum,'username':this.select_word}
                sysUserList(
                  query
                ).then((res) => {
                    //异步获取后台值
                    let pageData = res.data;
                    this.tableData = pageData.records;
                    this.total = pageData.total;
                })
            },
            search() {
                this.is_search = true;
                this.getData();
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                this.id = row.id;
                this.form = {
                    id: row.id,
                    userName: row.userName,
                    email: row.email,
                    address: row.address
                }
                this.editVisible = true;
                this.operate = false;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.id = row.id;
                this.delVisible = true;
             
            },
            delAll() {
               
                const length = this.multipleSelection.length;
                if(length > 0){
                    let str = '';
                    let ids = [];
                    this.del_list = this.del_list.concat(this.multipleSelection);
                    for (let i = 0; i < length; i++) {
                        str += this.multipleSelection[i].userName + ' ';
                        ids[i] = this.multipleSelection[i].id;
                    }
                    
                    batchDelSysUser(ids).then((res) =>{
                        if(res.code == 200){
                            this.$message.success(`删除 ${str} 成功`);
                            this.tableData = res.data.records;
                        }else{
                            this.$message.error(`删除 ${str} 失败`);
                        }
                    });
                    
                    //删除已经选中的元素
                   /*  for(let i = 0;i<this.tableData.length;i++){
                        for(let j = 0;j<ids.length;j++){
                            if(this.tableData[i].id == ids[j] ){
                                this.tableData.splice(i,1);
                            }
                        }
                        
                    }*/
                }
               
                
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
              
               
                if(this.tableData[this.idx].id === this.id){
                    this.$set(this.tableData, this.idx, this.form);
                }else{
                    for(let i = 0; i < this.tableData.length; i++){
                        if(this.tableData[i].id === this.id){
                            this.$set(this.tableData, i, this.form);
                            return ;
                        }
                    }
                }
                  //发起更新请求
                updatesUserById(this.form).then((res) =>{
                      console.info(JSON.stringify(res))
                    if(res.code == 200){
                         this.$message.success(`修改第 ${this.idx+1} 行成功`);
                    }else{
                         this.$message.error(`修改第 ${this.idx+1} 行失败`);
                    }
                  
                });
            },
            //添加用户提示弹框
            addUser(){
                this.editVisible = true;
                this.operate=true;
                this.form = {};
            },
            //添加用户发起请求
            saveUserInfo(){
                 this.editVisible = false;
                 addSysUser(this.form).then((res) =>{
                     if(res.code == 200){
                         this.tableData.splice(0, 0, this.form);
                         this.$message.success(`添加 ${this.form.userName} 用户成功`);
                     }else{
                         this.$message.error(`添加 ${this.form.userName} 用户失败`);
                     }
                 });
            },
            // 确定删除
            deleteRow(){
                this.$message.success('删除成功');
                this.delVisible = false;
                if(this.tableData[this.idx].id === this.id){
                    this.tableData.splice(this.idx, 1);
                }else{
                    for(let i = 0; i < this.tableData.length; i++){
                        if(this.tableData[i].id === this.id){
                            this.tableData.splice(i, 1);
                            return ;
                        }
                    }
                }
                delSysUser({id:this.id}).then((res) =>{
                    if(res.code == 200){
                            this.$message.success(`删除成功`);
                            this.tableData = res.data.records;
                        }else{
                            this.$message.error(`删除失败`);
                        }
                });
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
