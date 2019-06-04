/**
* @desc 公用方法
* @author web-吴森
* @date 2018年7月10日
* @example 调用示例
*   函数调用 this.thousandBitSeparator()
    管道符调用 | thousandBitSeparator
**/
import Vue from 'vue'

// 千位分隔符转换
const thousandBitSeparator = (num) => {
  return num && num
      .toString()
      .replace(/^\d+/, (m) => m.replace(/(?=(?!^)(\d{3})+$)/g, ','))
}

Vue.filter('thousandBitSeparator',thousandBitSeparator)


/**
* 侧边栏弹出框
* @desc 补零方法
* @date 2018年7月10日
* @param [str, length, char]  -要补充的字符串  - 要补充达到的长度默认是2   - 被补充的字符 默认是 '0'
**/


  const addZero = (str = '',length = 2, char = '0') => {
    return str.toString().padStart(length, char);
  }

/**
*
* @desc 计算月份差
* @date 2018年7月10日
* @param [d1, d2]  -开始日期  - 结束日期
**/

  const monthDiff = (d1, d2) => {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() ;
    months += d2.getMonth();
    if(d2.getDate() >= d1.getDate()){
      months += 1
    }
    return months <= 0 ? 0 : months;
  }




export {
  thousandBitSeparator,
  addZero,
  monthDiff,
}
