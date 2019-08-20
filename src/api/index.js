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