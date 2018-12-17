import {apiConfig} from 'see-web-basic'

import bizSystemService from './bizSystemService'
import seeDictionaryService from './seeDictionaryService'

apiConfig.registry({bizSystemService, seeDictionaryService}, false)
