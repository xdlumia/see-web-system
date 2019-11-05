/*
 * @Author: 赵伦
 * @Date: 2019-06-06 10:39:49
 * @LastEditors: 赵伦
 * @LastEditTime: 2019-11-05 16:01:28
 * @Description: file content
 */
import { apiConfig } from 'see-web-basic';

import bizSystemService from './bizSystemService';
import systemService from './systemService';
import resourceService from './resourceService';
import seeDictionaryService from './seeDictionaryService';
import seeBaseinfoService from './seeBaseinfoService';
import seeExternService from './seeExternService';

apiConfig.registry({ 
    bizSystemService: bizSystemService,
    systemService:systemService,
    resourceService: resourceService, 
    seeDictionaryService: seeDictionaryService,
    seeExternService,
});

// 新的api使用方法
apiConfig.registryConfig({
    seeBaseinfoService: seeBaseinfoService
});