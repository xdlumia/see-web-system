<!-- "/**",
"* 类目管理",
"* @author web-徐贺",
"* @params ////",
"* @date 2018年8月15日",
"**/",
"-->
<template>
<!-- 类目管理 -->
   <div v-loading='loading'>
       <div class="cate" style="min-width:1256px;">
           <div class="cate-top">
               <el-button  v-if="buttonsCode.includes('decorate_goods_classmgr_1001')" @click="fcateadd" type="primary" icon="el-icon-plus" size="medium ">新增</el-button>
           </div>
           <div class="jianTree" style="overflow-x:auto;">
            <div class="custom-tree-node mt20">
              <span class="b">分类名称</span>
              <div class="tree-node">
                <!--<span class="d-inline b">地市(2位)</span>-->
                <span class="b" style="display:inline-block;width:300px;">创建时间</span>
                <span v-if="buttonsCode.includes('decorate_goods_classmgr_1006')" class="b" style="display:inline-block;width:200px;">是否有效</span>
                <span class="b ac" style="display:inline-block;width:400px;">操作</span>
              </div>
            </div>

            <div class="custom-tree-container cate-main" style="overflow-y:auto;max-height:600px;">
                                  <!-- lazy
                    :load = "lazyTreeData" -->
                <el-tree
                    class="mt10"
                    node-key="id"
                    :data="treeData"
                    lazy
                    :default-expanded-keys="defalutOpenArr"
                    :load = "lazyTreeData"
                    :indent="30"
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <div class="tree-node">
                            <span class="d-elip" style="width:300px;display:inline-block;">
                               <span>{{node.data.createTime | timeToStr('YYYY-MM-DD HH:MM:SS')}}</span>
                            </span>
                            <span v-if="buttonsCode.includes('decorate_goods_classmgr_1006')" class="d-elip" style="width:200px;display:inline-block;">
                                <el-switch
                                    v-model="node.data.isEnable"
                                    active-value="1"
                                    inactive-value="0"
                                    active-color="#13ce66"
                                    @change = "() => fcateChange(node, data)"
                                    inactive-color="#ff4949">
                                </el-switch>
                            </span>
                            <span class="d-elip" style="width:400px;display:inline-block;">
                                <el-button v-if="buttonsCode.includes('decorate_goods_classmgr_1002')" :disabled="(node.data.parentId == null ? false : true) || (node.data.isEnable != 1)" class="ml40" type="text" size="mini" icon="el-icon-plus" @click="() => faddchild(data,'child',node)">新增子类</el-button>
                                <el-button v-if="buttonsCode.includes('decorate_goods_classmgr_1003')" class="ml40" type="text" size="mini" icon="el-icon-edit" @click="() => fcatehandel(data,'itself',node)"> 修改 </el-button>
                                <el-button v-if="buttonsCode.includes('decorate_goods_classmgr_1005')" :disabled="node.data.isEnable != 1" class="ml40" type="text" size="mini" icon="el-icon-upload2" @click="() => fcatetop(data,node)"> 置顶 </el-button>
                                <el-button v-if="buttonsCode.includes('decorate_goods_classmgr_1004')" class="ml40" type="text" size="mini" icon="el-icon-delete" @click="() => fcatedelete(node, data)"> 删除</el-button>
                            </span>
                        </div>
                    </span>
                </el-tree>
            </div>
          </div>

        <div class="">
            <div class="block mt30">
                <el-pagination @current-change="curChangeHandle" :current-page.sync="firstForm.page" :page-size="firstForm.limit" layout="total, prev, pager, next" :total="tableCount">
                </el-pagination>
            </div>
        </div>

        <el-dialog
        :title="titleHandel"
        :visible.sync="dialogVisible"
        width="519px"
        :before-close="handleClose">
        <div class="p10">
        	<div class="b ml30" style="height:30px;line-height:30px;"><span class="el-icon-warning f30 fl" style="color:#e6a23c;"></span><span class="ml10 fl">分类新增成功后，不可更改及删除，请仔细核实分类信息！</span></div>
            <el-form ref="form" :model="form" label-width="80px" :rules="rules" class="mt20">
                <el-form-item size="small" label="分类名称" prop="handelClassName">
                    <el-input placeholder="请输入分类名称" v-model="form.handelClassName"></el-input>
                </el-form-item>
                 <!-- <el-form-item label="上级分类" prop="parentid" v-if="handel">
                    <el-select size="small" style="width:100%;" v-model="form.parentid" placeholder="请选择">
                        <el-option v-for="(item,index) of treeData" :label="item.className" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item> -->
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
        </span>
        </el-dialog>

       </div>

   </div>
</template>

<script>
/* eslint-disable eqeqeq */
export default {
  data () {
    return {
      isEnable: false,
      defaultProps: {
        children: 'children',
        label: 'className',
        isLeaf: 'leaf'
      },
      tableCount: 1000,
      tableLimit: 5,
      tableCur: 1,
      buttonsCode: [],
      dialogVisible: false,
      form: {
        handelClassName: '',
        parentid: ''
      },
      buttonsCode: this.$local.fetch('authorityBtn').asystem_assist_goodsclass || [],
      rules: {
        handelClassName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        parentid: [
          { required: true, message: '请选择上级分类', trigger: 'change' }
        ]
      },
      handel: false, // 点击的是新增还是编辑
      istype: '', // 区分点击的是添加子类还是编辑
      firstForm: { // 一级类目的参数
        page: 1,
        limit: 5
      },
      addchild: true,
      titleHandel: '新增子类',
      treeData: [],
      defalutOpenArr:[],
      dadnode: {},
      loading:false,
      resovle: '',
      treeId: '',
      treeClickData: [],
      treeClickNode: {}
    }
  },
  components: {

  },
  computed: {
  },
  created () {
    this.fgoodsFirstClassList()
  },
  watch: {
  },
  methods: {
    fgoodsFirstClassList () {
	  this.defalutOpenArr = []
      this.$api.seeGoodsService.fgoodsFirstClassList(this.firstForm) // 获取物品一级类目
        .then(res => {
          this.loading = true
          let data = res.data || []
          this.treeData = data.map(item => {
            item.children = []
            return item
          })
          for (let i = 0; i < this.treeData.length; i++) {
            this.treeData[i].isEnable = this.treeData[i].isEnable.toString()
          }
          this.tableCount = res.count || ''
        }).finally(ero => {
        	this.loading = false
        })
    },
    lazyTreeData (node, resovle) {
      this.dadnode = node
      this.resovle = resovle
      // console.log(resovle)
      this.$api.seeGoodsService.fgetChildClassList({id: node.data.id}) // 获取物品子类类目
        .then(res => {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].isEnable = res.data[i].isEnable.toString()
            res.data[i].leaf = true
          }
          return resovle(res.data)
        }).finally(() => {})
    },
    fcateadd (data) { // 新增
      this.titleHandel = '新增'
      this.handel = true
      this.dialogVisible = true
      this.form.handelClassName = ''// 清空
      this.form.parentid = ''// 清空
    },
    fcateChange (node, data) { // 是否有效开关
      this.treeClickNode = node
      this.treeClickData = data
      if (data.isEnable == 1) { // 如果从无效改成有效
      	this.loading = true
      	this.$api.seeGoodsService.handelGoodsChild({id: data.id, isEnable: data.isEnable}) //
        .then(res => {
		  this.loading = true
          if (this.treeClickData.parentId) {
          	this.fgoodsFirstClassList()
            this.$api.seeGoodsService.fgetChildClassList({id: this.treeClickData.parentId}) // 获取物品子类类目
              .then(res => {
              	this.defalutOpenArr = [this.treeClickData.parentId]
                node.parent.childNodes = []
                node.parent.data.children = res.data.map(item => {
                  item.leaf = true
                  item.isEnable = item.isEnable.toString()
                  return item
                })
              }).finally(() => {})
            // this.lazyTreeData(this.dadnode, this.resovle)
          } else {
            this.fgoodsFirstClassList()
          }
        }).finally(() => {this.loading = false})
      }else{
      	this.$confirm('分类设为无效后，选择或查询物品时，将不会再看到无效分类，您确认要把 ' + data.className + ' 分类设为无效么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      	this.loading = true
	      this.$api.seeGoodsService.handelGoodsChild({id: data.id, isEnable: data.isEnable}) //
	        .then(res => {
    		  this.loading = true
	          if (this.treeClickData.parentId) {
	          	this.fgoodsFirstClassList()
	            this.$api.seeGoodsService.fgetChildClassList({id: this.treeClickData.parentId}) // 获取物品子类类目
	              .then(res => {
	              	this.defalutOpenArr = [this.treeClickData.parentId]
	                node.parent.childNodes = []
	                node.parent.data.children = res.data.map(item => {
	                  item.leaf = true
	                  item.isEnable = item.isEnable.toString()
	                  return item
	                })
	              }).finally(() => {})
	            // this.lazyTreeData(this.dadnode, this.resovle)
	          } else {
	            this.fgoodsFirstClassList()
	          }
	        }).finally(() => {this.loading = false})
        }).catch(() => {
        	if (this.treeClickData.parentId) {
	            this.$api.seeGoodsService.fgetChildClassList({id: this.treeClickData.parentId}) // 获取物品子类类目
	              .then(res => {
	                node.parent.childNodes = []
	                node.parent.data.children = res.data.map(item => {
	                  item.leaf = true
	                  item.isEnable = item.isEnable.toString()
	                  return item
	                })
	              }).finally(() => {})
	            // this.lazyTreeData(this.dadnode, this.resovle)
	          } else {
	            this.fgoodsFirstClassList()
	          }
	        this.$message({
	          type: 'info',
	          message: '已取消'
	        })
	      })
      }
    },
    faddchild (data, type, node) { // 新增子类
      this.titleHandel = '新增子类'
      this.treeClickNode = node
      this.treeClickData = data
      this.istype = type
      this.handel = false
      this.addchild = false
      this.dialogVisible = true
      this.form.handelClassName = ''// 清空
      this.treeId = data.id
    },
    fcatehandel (data, type, node) { // 修改
      this.titleHandel = '修改'
      this.treeClickNode = node
      this.treeClickData = data
      this.istype = type
      this.handel = false
      this.addchild = false
      this.dialogVisible = true
      this.treeId = data.id
      this.form.handelClassName = data.className
    },
    fcatetop (data, node) { // 置顶
      this.treeClickData = data
      this.$api.seeGoodsService.handelGoodsChild({id: data.id, isTop: 1}) //
        .then(res => {
        	this.loading = true
          if (this.treeClickData.parentId) {
            this.$api.seeGoodsService.fgetChildClassList({id: this.treeClickData.parentId}) // 获取物品子类类目
              .then(res => {
              	this.loading = true
                for (let i = 0; i < res.data.length; i++) {
                  res.data[i].isEnable = res.data[i].isEnable.toString()
                  res.data[i].leaf = true
                }
                node.parent.childNodes = []
                node.parent.data.children = res.data || []
              }).finally(() => {this.loading = false})
          } else {
            this.fgoodsFirstClassList()
          }
        })
        .finally(()=>{
        	this.loading = false
        })
    },
    fcatedelete (node, data) { // 删除
      this.treeClickNode = node
      this.treeClickData = data
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.seeGoodsService.deleteGoodsInfo({id: data.id}) //
          .then(res => {
          	this.loading = true
            if (this.treeClickData.parentId) {
              this.$api.seeGoodsService.fgetChildClassList({id: this.treeClickData.parentId}) // 获取物品子类类目
                .then(res => {
                  for (let i = 0; i < res.data.length; i++) {
                    res.data[i].isEnable = res.data[i].isEnable.toString()
                    res.data[i].leaf = true
                  }
                  // this.lazyTreeData(this.dadnode, this.resovle)
                  node.parent.childNodes = []
                  node.parent.data.children = res.data
                }).finally(() => {})
            } else {
              this.fgoodsFirstClassList()
            }
          }).finally(() => {this.loading = false})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    curChangeHandle (val) { // 分页
      this.fgoodsFirstClassList()
    },
    handleClose (done) { // 关闭弹框
      done()
    },
    submitForm (formName) { // 新增和编辑类目的弹框确定
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false

          if (!this.handel) { // 编辑模式下，走修改接口
            if (this.istype === 'itself') { // 点击的是编辑n
              this.$api.seeGoodsService.handelGoodsChild({className: this.form.handelClassName, id: this.treeId}) //
                .then(res => {
                	this.loading = true
                  if (this.treeClickData.parentId) {
                    this.$api.seeGoodsService.fgetChildClassList({id: this.treeClickData.parentId}) // 获取物品子类类目
                      .then(res => {
                        // this.treeClickNode.parent.data.children = [] //
                        for (let i = 0; i < res.data.length; i++) {
                          res.data[i].isEnable = res.data[i].isEnable.toString()
                          res.data[i].leaf = true
                        }
                        // this.lazyTreeData(this.dadnode, this.resovle)
                        this.treeClickNode.parent.childNodes = []
                        this.treeClickNode.parent.data.children = res.data
                      }).finally(() => {})
                  } else {
                    this.fgoodsFirstClassList()
                  }
                }).finally(ero => {this.loading = false})
            } else if (this.istype === 'child') { // 点击的是新增子类
              this.handel = false
              this.addchild = true
              this.$confirm('分类新增成功后，不可更改及删除，请仔细核实分类信息！您新增的子类名称为 ' + this.form.handelClassName + ' ,所属分类为 ' + this.treeClickData.className + ' ，是否确认无误？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
          		}).then(() => {
	              this.$api.seeGoodsService.saveGoodsChild({className: this.form.handelClassName, parentId: this.treeId}) //
	                .then(res => {
	                	this.loading = true
	                  this.$api.seeGoodsService.fgetChildClassList({id: this.treeClickData.id}) // 获取物品子类类目
	                    .then(res => {
	                    	this.loading = true
	                      for (let i = 0; i < res.data.length; i++) {
	                        res.data[i].isEnable = res.data[i].isEnable.toString()
	                        res.data[i].leaf = true
	                      }
	                      this.treeClickNode.childNodes = []
	                      this.treeClickNode.data.children = res.data
	                    }).finally(() => {this.loading = false})
	                }).finally(() => {this.loading = false})
                }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                })
              })
            }
          } else if (this.handel) { // 新增
          	this.$confirm('分类新增成功后，不可更改及删除，请仔细核实分类信息！您新增的分类名称为 ' + this.form.handelClassName + ' ，是否确认无误？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
	            this.$api.seeGoodsService.saveGoodsChild({className: this.form.handelClassName, parentId: null}) //
	              .then(res => {
	              	this.loading = true
	                this.fgoodsFirstClassList()
	              })
	              .finally(()=>{
	              	this.loading = false
	              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
    .cate{
        padding: 10px;
        background: #fff;
        box-shadow: 0 0 5px rgba(0,0,0,.1);
        border-radius: 3px;
        box-sizing: border-box;
        height: 100%;
    }
    .cate-top{
        height: 40px;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .custom-tree-node .tree-node{width: 950px;}
    .custom-tree-node .tree-node .d-inline{font-size: 14px;}

</style>
<style>
    .jianTree .el-tree-node__content{padding-top: 5px;padding-bottom: 5px;}
</style>
