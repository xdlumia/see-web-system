<!--
 * @Author: 高大鹏
 * @Date: 2019-10-29 17:19:40
 * @LastEditors: 高大鹏
 * @LastEditTime: 2019-11-04 10:35:04
 * @Description: 业务设置-新增公司
 -->
<template>
  <div class v-loading="loading">
    <el-form :model="companyForm" :rules="companyFormRules" ref="companyForm" size="small">
      <form-card title="公司财务信息">
        <el-row :gutter="40">
          <el-col :span="8">
            <el-form-item label="公司名称" prop="corporationName">
              <el-input v-model.trim="companyForm.corporationName" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开户银行" prop="accountBank">
              <el-input v-model.trim="companyForm.accountBank" maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="银行账号" prop="account">
              <el-input v-model.trim="companyForm.account"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="纳税人识别号" prop="taxpayersNum">
              <el-input v-model.trim="companyForm.taxpayersNum" maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地址" prop="address">
              <el-input v-model.trim="companyForm.address" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话" prop="phone">
              <el-input v-model.trim="companyForm.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </form-card>
      <form-card title="发票设定">
        <el-row :gutter="40">
          <el-col :span="8">
            <el-form-item label="发票最大限额" prop="invoiceSum">
              <d-select class="wfull" dicCode="PSI_GSSZ_FPZDXE" v-model="companyForm.invoiceSum"></d-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票税率" prop="jinvoiceTaxRate">
              <el-input v-model.trim="companyForm.jinvoiceTaxRate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-switch :active-value="1" :inactive-value="0" class="limit-switch" v-model="companyForm.minLimitState"></el-switch>
            <el-form-item label="下限预警数量" prop="minLimitNum">
              <el-input v-model.trim="companyForm.minLimitNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </form-card>
      <form-card :title="true" v-if="!companyForm.commonCorporationAccountEntities.length">
        <div slot="title" style="display:flex;justify-content:space-between">
          <span>公司账户</span>
          <el-button @click="addAccount" style="padding:0" type="text">+新建</el-button>
        </div>
      </form-card>
      <form-card :key="index" :title="index < 1" class="mb10" v-for="(item, index) in companyForm.commonCorporationAccountEntities">
        <div slot="title" style="display:flex;justify-content:space-between" v-if="index < 1">
          <span>公司账户</span>
          <el-button @click="addAccount" style="padding:0" type="text">+新建</el-button>
        </div>
        <el-row :gutter="40" style="position: relative">
          <el-col :span="8">
            <el-form-item
              :prop="'commonCorporationAccountEntities.' + index + '.accountType'"
              :rules="commonCorporationAccountEntitiesRules.accountType"
              label="账户类型"
            >
              <el-select :disabled="index==0" class="wfull" dicCode="PSI_GSSZ_ZHLX" v-model="item.accountType">
                <el-option
                  :key="index"
                  :label="item.content"
                  :value="item.code"
                  v-for="(item,index) of (index==0?dictionaryOptions('PSI_GSSZ_ZHLX'):dictionaryOptions('PSI_GSSZ_ZHLX').filter(a=>a.code!='PSI_GSSZ_ZHLX-3'))"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="accountType(index) !== 3">
            <el-form-item
              :label="accountNameLabel(index)"
              :prop="'commonCorporationAccountEntities.' + index + '.accountName'"
              :rules="commonCorporationAccountEntitiesRules.accountName"
            >
              <el-input v-model.trim="item.accountName" maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="accountType(index) === 5">
            <el-form-item
              :prop="'commonCorporationAccountEntities.' + index + '.accountBank'"
              :rules="commonCorporationAccountEntitiesRules.accountBank"
              label="开户银行（到支行）"
            >
              <el-input v-model.trim="item.accountBank" maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="accountType(index) === 5">
            <el-form-item
              :prop="'commonCorporationAccountEntities.' + index + '.phone'"
              :rules="commonCorporationAccountEntitiesRules.phone"
              label="银行预留手机号"
            >
              <el-input v-model.trim="item.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="accountType(index) === 5">
            <el-form-item
              :prop="'commonCorporationAccountEntities.' + index + '.account'"
              :rules="commonCorporationAccountEntitiesRules.account"
              label="开户账号"
            >
              <el-input v-model.trim="item.account"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :prop="'commonCorporationAccountEntities.' + index + '.state'"
              :rules="commonCorporationAccountEntitiesRules.state"
              label="账户状态"
            >
              <el-select class="wfull" v-model.trim="item.state">
                <el-option :value="1" label="启用"></el-option>
                <el-option :value="0" label="停用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="期初余额"
              :prop="'commonCorporationAccountEntities.' + index + '.initAmount'"
              :rules="commonCorporationAccountEntitiesRules.initAmount"
            >
              <el-input v-model.trim="item.initAmount" min="0" :disabled="!canEditInitAmount">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="accountType(index) === 1 || accountType(index) === 2">
            <el-form-item
              :label="accountType(index) === 1 ? '支付宝收款二维码' : '微信收款二维码'"
              :prop="'commonCorporationAccountEntities.' + index + '.qrCode'"
              :ref="'qrCode'+index"
              :rules="commonCorporationAccountEntitiesRules.qrCode"
            >
              <div class="wfull" style="display:flex;">
                <upload-file
                  :limit="{type: ['jpg', 'jpeg', 'png']}"
                  :size="0.5"
                  @uploadSuccess="removeValidate(index)"
                  class="mr10"
                  v-if="!item.qrCode"
                  v-model.trim="item.qrCode"
                >
                  <slot>
                    <div class="ba upload-wrapper" style>
                      <span class="el-icon-plus" style="font-size:36px;color:#999;"></span>
                    </div>
                  </slot>
                </upload-file>
                <div class="ba upload-wrapper mr10" style v-else>
                  <img :src="item.qrCode" style="width:100%;height:100%;object-fit: cover;" />
                </div>
                <p class="d-text-qgray f12" style="display: flex; flex-direction: column">
                  <span>仅支持jpg、jpeg、png格式</span>
                  <span>图片大小500KB以下,推荐分辨率600*600</span>
                  <el-button @click="item.qrCode = ''" style="width: 65px;" type="text">清空图片</el-button>
                </p>
              </div>
            </el-form-item>
          </el-col>
          <el-button
            @click="deleteAccount(index)"
            style="position:absolute;padding:0;right:20px;top:-5px;border:none;"
            v-if="index>0"
          >
            <i class="el-icon-remove" style="font-size:20px;"></i>
          </el-button>
        </el-row>
      </form-card>
    </el-form>
  </div>
</template>

<script type='text/ecmascript-6'>
export default {
  data() {
    return {
      canEditInitAmount:true,
      loading: false,
      companyForm: {
        id: '',
        corporationName: '',
        accountBank: '',
        account: '',
        taxpayersNum: '',
        address: '',
        phone: '',
        invoiceSum: '',
        jinvoiceTaxRate: '',
        minLimitNum: '',
        minLimitState: 1,
        commonCorporationAccountEntities: [
          {
            accountType: 'PSI_GSSZ_ZHLX-3',
            accountName: '',
            accountBank: '',
            initAmount: 0,
            phone: '',
            account: '',
            state: 1,
            qrCode: ''
          }
        ]
      },
      companyFormRules: {
        corporationName: [
          { required: true, message: '请输入', trigger: 'blur' },
          { max: 20, message:'字数不超过20个字' }
        ],
        accountBank: [
          { required: true, message: '请输入', trigger: 'blur' },
          { max: 30, message:'字数不超过30个字' }
        ],
        account: [
          { required: true, message: '请输入', trigger: 'blur' },
          { type: 'bankCard', message: '请输入正确的银行账号', trigger: 'blur' }
        ],
        taxpayersNum: [
          { required: true, message: '请输入', trigger: 'blur' },
          { max: 30, message:'字数不超过30个字' }
        ],
        address: [
          { required: true, message: '请输入', trigger: 'blur' },
          { max: 100, message:'字数不超过100个字' }
        ],
        phone: [
          { required: true, message: '请输入', trigger: 'blur' },
          { type: 'phone', message: '请输入正确的手机号', trigger: 'blur' }
        ],
        invoiceSum: { required: true, message: '请选择', trigger: 'change' },
        jinvoiceTaxRate: { required: true, message: '请输入', trigger: 'blur' },
        minLimitNum: [
          { required: true, message: '请输入', trigger: 'blur' },
          { type: 'number', trigger: 'blur' },
          { type: 'positiveNum', trigger: 'blur' },
          {
            validator: (rule, value, cb) => {
              if (String(value).length > 3) {
                cb(new Error('最高999'));
              } else {
                cb();
              }
            },
            trigger: 'blur'
          }
        ]
      },
      commonCorporationAccountEntitiesRules: {
        accountType: { required: true, message: '请选择', trigger: 'change' },
        accountName: [
          { required: true, message: '请输入', trigger: 'blur' },
          { max: 30, message:'字数不超过30个字' }
        ],
        accountBank: [
          { required: true, message: '请输入', trigger: 'blur' },,
          { max: 30, message:'字数不超过30个字' }
        ],
        initAmount: [
          { type:'price' },
          {validator:(rule,value,cb)=>{
            if(value>=0){
              cb()
            }else cb(new Error('金额需大于0'))
          }}
        ],
        phone: [
          { required: true, message: '请输入', trigger: 'blur' },
          { type: 'phone', message: '请输入正确的手机号', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入', trigger: 'blur' },
          { type: 'bankCard', message: '请输入正确的银行账号', trigger: 'blur' }
        ],
        state: { required: true, message: '请选择', trigger: 'change' },
        qrCode: { required: true, message: '请上传', trigger: 'change' }
      }
    };
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    editId: {
      type: Number,
      default: null
    }
  },
  components: {},
  mounted() {
    if (this.editId && this.isEdit) {
      this.commoncorporationInfo(this.editId);
    }
    this.checkInitAmountEditable()
  },
  methods: {
    // 移除图片上传校验
    removeValidate(index) {
      this.$refs.companyForm.clearValidate(
        'commonCorporationAccountEntities.' + index + '.qrCode'
      );
    },
    // 获取详情
    commoncorporationInfo(id) {
      this.loading = true;
      this.$api.seeBaseinfoService
        .commoncorporationInfo(null, id)
        .then(res => {
          Object.keys(this.companyForm).forEach(key => {
            this.companyForm[key] = res.data[key];
            this.companyForm.account = this.companyForm.commonCorporationAccountEntities[0].account;
            this.companyForm.accountBank = this.companyForm.commonCorporationAccountEntities[0].accountBank;
            (this.companyForm.commonCorporationAccountEntities||[]).map(item=>item.initAmount=item.initAmount||0);
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 保存
    saveCompany() {
      this.$refs.companyForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const port = this.isEdit
            ? 'commoncorporationUpdate'
            : 'commoncorporationSave';
          this.companyForm.commonCorporationAccountEntities[0].account = this.companyForm.account;
          this.companyForm.commonCorporationAccountEntities[0].accountBank = this.companyForm.accountBank;
          this.$api.seeBaseinfoService[port](this.companyForm)
            .then(res => {
              this.$emit('refresh');
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    // 添加公司账户
    addAccount() {
      this.companyForm.commonCorporationAccountEntities.push({
        accountType: '',
        accountName: '',
        accountBank: '',
        phone: '',
        account: '',
        state: '',
        qrCode: '',
        initAmount: 0 
      });
    },
    // 获取账户类型
    accountType(index) {
      return parseFloat(
        this.companyForm.commonCorporationAccountEntities[
          index
        ].accountType.replace('PSI_GSSZ_ZHLX-', '')
      );
    },
    // 账户名称label
    accountNameLabel(index) {
      let name;
      switch (this.accountType(index)) {
        case 3:
          name = '开户';
          break;
        case 1:
          name = '支付宝账户';
          break;
        case 2:
          name = '微信账户';
          break;
        default:
          name = '账户';
          break;
      }
      return name + '名称';
    },
    async deleteAccount(i){
      let item = this.companyForm.commonCorporationAccountEntities[i]
      if(item.id){
        this.loading = true
        try {
          let {data} = await this.$api.seeBaseinfoService.accLogicDelete({id:item.id})
          this.companyForm.commonCorporationAccountEntities.splice(i, 1)
        } catch (error) { }
        this.loading = false
      }else{
        this.companyForm.commonCorporationAccountEntities.splice(i, 1)
      }
    },
    // 进销存这边加一个开账功能校验
    async checkInitAmountEditable(){
      try {
        if(JSON.parse(localStorage.userInfo).syscode=='psi'){
          let {data:{configJson}} = await this.$api.seePsiCommonService.commonsystemconfigInfo(null,4)
          configJson = JSON.parse(configJson)
          this.canEditInitAmount = (!(configJson.accountState||0))?true:false
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.upload-wrapper {
  width: 100px;
  height: 100px;
  background: #f6f6f6;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  overflow: hidden;
}
.limit-switch {
  position: absolute;
  right: 20px;
  top: 6px;
  z-index: 1;
}
</style>
