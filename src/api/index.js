import { apiConfig } from 'see-web-basic';

import bizSystemService from './bizSystemService';
import resourceService from './resourceService';
import seeDictionaryService from './seeDictionaryService';

apiConfig.registry({ bizSystemService: bizSystemService,resourceService: resourceService, seeDictionaryService: seeDictionaryService }, false);