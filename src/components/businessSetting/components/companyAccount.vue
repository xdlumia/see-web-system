<!-- /**
 * @description 多个对公账户
 * @author 赵伦 2019-06-13
 * @link 原型地址 http://file.515md.com:8888/产品/OP9-SAAS平台&公共业务/SaaS_1.15.1.20190611_gfp
 */ -->
<template>
    <div>
        <el-form class="" size="small" label-width="190px">
            <div class="d-relative">
                <el-row class="mb10 pt10 d-bg-gray br5" v-for="(item,index) of list" :key="index">
                    <el-col :span="12">
                        <el-form-item label="开户名称">
                            <el-input class="w200" v-model="item.accountName" placeholder="请填写开户名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="开户银行（到支行）">
                            <el-input class="w200" v-model="item.bankName" placeholder="请填写开户银行（到支行）" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-button size="mini" @click="add(index)">添加</el-button>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="银行预留手机号">
                            <el-input class="w200" v-model="item.phone" placeholder="请填写银行预留手机号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="开户账号">
                            <el-input class="w200" v-model="item.accountNumber" placeholder="请填写开户账号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-button size="mini" type="danger" @click="remove(index)" v-if="index">删除</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-form>
    </div>
</template>
<script>
/**
 * @description 多个对公账户
 * @author 赵伦 2019-06-13
 * @link 原型地址 http://file.515md.com:8888/产品/OP9-SAAS平台&公共业务/SaaS_1.15.1.20190611_gfp
 */
export default {
    props: ['value'],
    data() {
        return {
            list: []
        };
    },
    mounted() {
        this.init();
    },
    watch: {
        list: {
            deep: true,
            handler: function() {
                this.update();
            }
        }
    },
    methods: {
        init() {
            let list = [];
            if (typeof this.value == 'string' && this.value) {
                list = JSON.parse(this.value);
            }
            if (!list.length) list = [this.getDefault()];
            this.list = list;
        },
        getDefault() {
            return {
                accountName: '',
                bankName: '',
                phone: '',
                accountNumber: ''
            };
        },
        add(index) {
            this.list.splice(index + 1, 0, this.getDefault());
        },
        remove(index) {
            this.list.splice(index, 1);
        },
        update() {
            if (this.list.length) {
                this.$emit('input', JSON.stringify(this.list));
            }
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
