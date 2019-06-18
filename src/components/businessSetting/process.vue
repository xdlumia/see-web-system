<!--：流程组件
/**
* 辅助管理-业务设置-流程
* @/components/asistant/businessSetting 组件存放位置
* @author web-吴宇枫
* @date 2018年9月5日
**/
-->
<template>
	<div class="process ml20" v-loading="showLoading">
		<!-- 图例标题 -->
		<el-row class="h60 pl20 title" type="flex" justify="space-between" align="middle">
			<el-col :span="4">
				图例
			</el-col>
			<el-col :span="18" class="ar">
				<div class="d-inline d-text-gray" style="font-weight:400">[自定义]审核流程节点责任人
					<el-tooltip class="item" effect="dark" placement="top">
						<div slot="content" v-html="userProcessAuditor.tips"></div>
						<i class="d-inline el-icon-info"></i>
					</el-tooltip>
					<el-switch
						class="mr20"
						@change="updateProcessSet"
						v-model="userProcessAuditor.switch">
					</el-switch>
				</div>
				<el-button type="danger" size="small" @click="resetProcessDefinitionList">重置本次更改</el-button>
				<el-button type="primary" size="small" @click="saveProcessDefinition">保存修改</el-button>
			</el-col>
		</el-row>
		<!-- 图例显示框 -->
		<el-row style="border: 1px solid #d3dce6;border-radius: 2px;" class="h60 lh60 pl20">
			<el-col v-for="(item, index) in legendList" :key="index" :span="7" :gutter="2">
				{{item.content}}
				<i class="iconfont f14" :class="item.iconCode" :style="{
						color: item.color
					}">
				</i>
			</el-col>
		</el-row>
		<!-- 循环渲染流程列表 -->
		<div class="mb20">
			<el-row v-for="(mainItem, mainIndex) in dataList" :key="mainIndex" style="position: relative;">
				<el-row class="h40 mt20 pl20 title">
					{{mainItem.processName}}
				</el-row>
				<div class="line" style="width: 94%;height: 3px;background-color: #BCBCBC;position: absolute;top: 57%;left: 3%;">

				</div>
				<el-row style="border: 1px solid #d3dce6;border-radius: 2px;" type="flex" >
					<draggable @update="dragUpdate(mainItem.content.mainTask.subTasks)" :options="{ animation:150,draggable:'.dragHandle', scroll:true,scrollSensitivity:200}" class="d-flex wfull" v-model="mainItem.content.mainTask.subTasks">
						<el-col :class="{dragHandle:subItem.taskCode!='START'&&subItem.taskCode!='END'}" v-for="(subItem, subIndex) in mainItem.content.mainTask.subTasks" :key="subIndex" style="display: flex;height: 200px;justify-content: center;align-items: center;flex-direction: column;user-select: none;">
							<div style="background-color: #fff;"><i class="iconfont" :class="[iconList[subItem.taskCode], subItem.taskStatus === 'default' ?  'default' : ( subItem.taskStatus === 'enable' ? 'enable' : 'disable' )]" style="font-size: 60px;cursor: pointer;" @click="changeTaskStatus(subIndex, mainIndex)"></i></div>
							<div>{{subItem.taskName}}</div>
						</el-col>
					</draggable>
				</el-row>
			</el-row>
		</div>
	</div>
</template>
<script>
	import draggable from 'vuedraggable'
	export default {
		components:{draggable},
		data() {
			return {
				showLoading: false,		// 显隐Loading动画
				userProcessAuditor:{},
				userProcessForm:{},
				legendList: [
					//	图例数据
					{
						content: '内置节点不允许调整',
						iconCode: 'icon-yuan',
						color: '#66ccff'
					},
					{
						content: '已启用节点',
						iconCode: 'icon-circle',
						color: '#66ccff'
					},
					{
						content: '已禁用节点',
						iconCode: 'icon-circle',
						color: '#7E7E7E'
					}
				],
				dataList: [],	//	流程数据
				iconList: {
					'START': 'icon-hetong',												// 提交合同
					'END': 'icon-hezuo',												// 完成
					'asystem_house_tenement_1012': 'icon-anquan',						// 收房-风控审核
					'asystem_house_tenement_1013': 'icon-jine', 						// 收房-财务审核
					'asystem_house_tenement_1014': 'icon-falv',							// 收房-法务审核
					'asystem_house_collect_1010': 'icon-anquan',						// 出房-风控审核
					'asystem_house_collect_1011': 'icon-jine', 							// 出房-财务审核
					'asystem_house_collect_1012': 'icon-falv',							// 出房-法务审核
					'asystem_house_collect_1013': 'icon-ren',							// 收房续约-房源责任人审核
					'asystem_house_collect_1014': 'icon-anquan',						// 收房续约-风控审核
					'asystem_house_collect_1015': 'icon-jine', 							// 收房续约-财务审核
					'asystem_house_collect_1016': 'icon-falv',							// 收房续约-法务审核
					'asystem_house_collect_1017': 'icon-xingzheng',						// 收房续约-行政审核
					'asystem_house_tenement_1015': 'icon-ren',							// 出房续约-房源责任人审核
					'asystem_house_tenement_1016': 'icon-anquan',						// 出房续约-风控审核
					'asystem_house_tenement_1017': 'icon-jine', 						// 出房续约-财务审核
					'asystem_house_tenement_1018': 'icon-falv',							// 出房续约-法务审核
					'asystem_house_tenement_1019': 'icon-xingzheng',					// 出房续约-行政审核
					'asystem_business_tenement_approve_3002' : 'icon-ren',				// 商业集中-租房签约审核-房源责任人审核
					'asystem_business_tenement_approve_3003' : 'icon-anquan',			// 商业集中-租房签约审核-风控审核
					'asystem_business_tenement_approve_3004' : 'icon-falv',				// 商业集中-租房签约审核-法务审核
					'asystem_business_tenement_approve_3005' : 'icon-jine',				// 商业集中-租房签约审核-财务审核
					'asystem_business_tenement_approve_3006' : 'icon-xingzheng',		// 商业集中-租房签约审核-行政审核
					'asystem_business_receive_approve_3002': 'icon-ren',				// 商业集中-收房签约审核-房源责任人审核
					'asystem_business_receive_approve_3003' : 'icon-anquan',			// 商业集中-收房签约审核-风控审核
					'asystem_business_receive_approve_3004' : 'icon-falv',				// 商业集中-收房签约审核-法务审核
					'asystem_business_receive_approve_3005' : 'icon-jine',				// 商业集中-收房签约审核-财务审核
					'asystem_business_receive_approve_3006' : 'icon-xingzheng',			// 商业集中-收房签约审核-行政审核
					'asystem_business_receive_approve_3008': 'icon-ren',				// 商业集中-收房续约审核-房源责任人审核
					'asystem_business_receive_approve_3009': 'icon-anquan',				// 商业集中-收房续约审核-风控审核
					'asystem_business_receive_approve_3010': 'icon-falv',				// 商业集中-收房续约审核-法务审核
					'asystem_business_receive_approve_3011': 'icon-jine',				// 商业集中-收房续约审核-财务审核
					'asystem_business_receive_approve_3012': 'icon-xingzheng',			// 商业集中-收房续约审核-行政审核
					'asystem_business_tenement_approve_3008': 'icon-ren',				// 商业集中-租房续约审核-房源责任人审核
					'asystem_business_tenement_approve_3009': 'icon-anquan',			// 商业集中-租房续约审核-风控审核
					'asystem_business_tenement_approve_3010': 'icon-falv',				// 商业集中-租房续约审核-法务审核
					'asystem_business_tenement_approve_3011': 'icon-jine',				// 商业集中-租房续约审核-财务审核
					'asystem_business_tenement_approve_3012': 'icon-xingzheng',			// 商业集中-租房续约审核-行政审核
					'asystem_finance_1015': 'icon-jine',								// 集中式-收据作废审核流程-财务审核
					'asystem_finance_1016': 'icon-ren',									// 集中式-收据作废审核流程-财务责任人审核
					'asystem_contract_retire_approve_1002': 'icon-ren',					// 商业退租审核-房源责任人审核
					'asystem_contract_retire_approve_1003': 'icon-anquan',				// 商业退租审核-风控审核
					'asystem_contract_retire_approve_1004': 'icon-falv',				// 商业退租审核-法务审核
					'asystem_contract_retire_approve_1005': 'icon-jine',				// 商业退租审核-财务审核
					'asystem_contract_retire_approve_1006': 'icon-xingzheng',			// 商业退租审核-行政审核
					'asystem_contract_bargain_1017': 'icon-ren',						// 合同变更审核流程-房源责任人审核
					'asystem_contract_bargain_1018': 'icon-anquan',						// 合同变更审核流程-风控审核
					'asystem_contract_bargain_1019': 'icon-falv',						// 合同变更审核流程-法务审核
					'asystem_contract_bargain_1020': 'icon-jine',						// 合同变更审核流程-财务审核
					'asystem_contract_bargain_1021': 'icon-xingzheng',					// 合同变更审核流程-行政审核
					'asystem_business_tenement_approve_3013': 'icon-zhang',				// 商业集中-收房签约审核 行政专员审核
					'asystem_business_tenement_approve_3014': 'icon-caiwudaodan',		// 商业集中-收房签约审核 财务主管审核
					'asystem_business_tenement_approve_3015': 'icon-baohu',				// 商业集中-收房签约审核 运营总监审核
					'asystem_business_receive_approve_3014': 'icon-caiwudaodan',		// 商业集中-收房签约审核 财务主管审核
					'asystem_business_receive_approve_3015': 'icon-baohu',				// 商业集中-收房签约审核 运营总监审核
					'asystem_business_receive_approve_3013': 'icon-zhang',				// 商业集中-收房签约审核 行政专业审核

					'asystem_business_receive_approve_3017': 'icon-caiwudaodan',		// 商业集中-收房续约审核 财务主管审核
					'asystem_business_receive_approve_3018': 'icon-baohu',				// 商业集中-收房续约审核 运营总监审核
					'asystem_business_receive_approve_3016': 'icon-zhang',				// 商业集中-收房续约审核 行政专业审核
					
					'asystem_business_tenement_approve_3017': 'icon-caiwudaodan',		// 商业集中-退租审核 财务主管审核
					'asystem_business_tenement_approve_3018': 'icon-baohu',				// 商业集中-退租审核 运营总监审核
					'asystem_business_tenement_approve_3016': 'icon-zhang',				// 商业集中-退租审核 行政专业审核

					'asystem_contract_retire_approve_1008': 'icon-caiwudaodan',		// 商业集中-退租审核 财务主管审核
					'asystem_contract_retire_approve_1007': 'icon-baohu',				// 商业集中-退租审核 运营总监审核
					'asystem_contract_retire_approve_1009': 'icon-zhang',				// 商业集中-退租审核 行政专业审核

					'asystem_contract_bargain_1031': 'icon-caiwudaodan',		// 商业集中-合同变更审核流程 财务主管审核
					'asystem_contract_bargain_1022': 'icon-baohu',				// 商业集中-合同变更审核流程 运营总监审核
					'asystem_contract_bargain_1030': 'icon-baohu',				// 商业集中-合同变更审核流程 运营总监审核
					'asystem_contract_bargain_1032': 'icon-zhang',				// 商业集中-合同变更审核流程 行政专业审核

					'asyshotel_rates_1001': 'icon-ren', // 酒店-房价设置审核-项目总经理审核
					'asyshotel_house_long_rent_1001': 'icon-jine', // 酒店-长租签约审核流程-财务审核
					'asyshotel_house_long_rent_1002': 'icon-ren', // 酒店-长租签约审核流程-项目总经理审核
					'asyshotel_house_long_extension_1001': 'icon-jine', // 酒店-长租续约审核流程-财务审核
					'asyshotel_house_long_extension_1002': 'icon-ren', // 酒店-长租续约审核流程-项目总经理审核
					'asyshotel_house_long_change_1001': 'icon-jine', // 酒店-长租变更审核流程-财务审核
					'asyshotel_house_long_change_1002': 'icon-ren', // 酒店-酒店-长租变更审核流程-项目总经理审核
					'asyshotel_house_long_surrender_1001': 'icon-jine', // 酒店-长租退租审核流程-财务审核
					'asyshotel_house_long_surrender_1002': 'icon-ren', // -酒店-长租退租审核流程-项目总经理审核
					'asyshotel_house_long_cancellation_1001': 'icon-jine', // 酒店-酒店-长租作废审核流程-财务审核
					'asyshotel_house_long_cancellation_1002': 'icon-ren'// -酒店-酒店-长租作废审核流程-项目总经理审核
					
				}
			}
		},
		mounted() {
			let syscode = this.$local.fetch('userInfo').syscode
			this.getProcessDefinitionList({syscode:syscode})
			// 获取当前流程设置
			this.queryProcessSet()
		},
		methods: {
			// 拖动完成保存
			dragUpdate(item){
				// console.log('拖动完成')
			},
			/**
			 * [getProcessDefinitionList 获取流程定义列表]
			 * @return {[underfined]} [void]
			 */
			getProcessDefinitionList(params) {
				this.showLoading = true
				this.$api.seeHouseConfigService.getProcessDefinitionList(params)
				.then(res => {
					this.dataList = res.data || []
					this.dataList.forEach( function(element, index, array) {
						array[index].content = JSON.parse(array[index].content)
					});
				})
				.finally(() => {
					let timer = setTimeout(() => {
						this.showLoading = false
					}, 300)
				})
			},
			/**
			 * [saveProcessDefinition 保存流程定义列表]
			 * @return {[underfined]} [void]
			 */
			saveProcessDefinition() {
				this.showLoading = true
				let processDefinitionUpdateVos = this.dataList.map(function(element, index) {
					let { ..._element } = element
					_element.content = JSON.stringify(_element.content)
					return _element
				});
				let updateArrayVoVo = {
					processDefinitionUpdateVos,
					sysCode:this.$local.fetch('userInfo').syscode
				}
				this.$api.seeHouseConfigService.saveProcessDefinition(updateArrayVoVo)
				.then(res => {
				}).finally(() => {
					let timer = setTimeout(() => {
						this.showLoading = false
					}, 300)
				})
			},
			/**
			 * [changeTaskStatus 改变流程状态]
			 * @param  {[number]} subIndex [在数组中的序号]
			 * @param  {[number]} mainIndex  [类型，0代表收房，1代表出房，等等]
			 * @return {[underfined]} [void]
			 */
			changeTaskStatus(subIndex, mainIndex) {
				let _dataArray = this.dataList[mainIndex].content.mainTask.subTasks
				if(!_dataArray) {
					// console.log('类型参数错误，0代表收房，1代表出房, 等等！')
					return
				}
				if(_dataArray[subIndex].taskStatus === 'default')
					return
				else if (_dataArray[subIndex].taskStatus != 'disable' && _dataArray[subIndex].taskStatus　!= 'enable') {
					console.log('taskStatus属性值错误！taskStatus属性只能是disable或者enable')
					return
				} else {
					_dataArray[subIndex].taskStatus = _dataArray[subIndex].taskStatus === 'enable' ? 'disable' : 'enable'
				}
			},
			/**
			 * [resetProcessDefinitionList 重置流程定义列表]
			 * @return {[underfined]} [void]
			 */
			resetProcessDefinitionList() {
			    let syscode = this.$local.fetch('userInfo').syscode;
				this.getProcessDefinitionList({syscode:syscode})
			},
			// 获取当前流程设置
			queryProcessSet(){
				this.$api.seeHouseConfigService.queryProcessSet('ifUserDefineProcessAuditor')
				.then(res=>{
					this.userProcessForm = res.data || {}
					if(this.userProcessForm.content){
						this.userProcessAuditor = JSON.parse(this.userProcessForm.content)
					}
				})
			},
			// 更新当前流程设置
			updateProcessSet(){
				this.userProcessForm.content = JSON.stringify(this.userProcessAuditor)
				this.$api.seeHouseConfigService.updateProcessSet(this.userProcessForm)
				.then(res=>{
					// console.log('更改成功');
				})
			},
		}
	}
</script>
<style scoped>
	.title {
		font-weight: 700;
	}
	.default {
		color: #66ccff;
		cursor: not-allowed !important;
	}
	.enable {
		color: #66ccff;
	}
	.disable {
		color: #7E7E7E;
	}
</style>