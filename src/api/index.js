import { apiConfig } from 'see-web-basic';

import bizSystemService from './bizSystemService';
import systemService from './systemService';
import resourceService from './resourceService';
import seeDictionaryService from './seeDictionaryService';

apiConfig.registry({ 
    bizSystemService: bizSystemService,
    systemService:systemService,
    resourceService: resourceService, 
    seeDictionaryService: seeDictionaryService 
}, false);