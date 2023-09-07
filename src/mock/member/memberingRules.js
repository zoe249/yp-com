/*
 * @Author: peng hui
 * @Date: 2020-12-21 16:36:18
 * @LastEditTime: 2020-12-21 17:02:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\mock\member\memberingRules.js
 */
export default {
  getmembers: () => {
    return {
      code: 2000,
      data: {
        data: [
          { id: '1', type: '20180102133', notes: 'liu', codePrefix: '152', codeMiddle: '690', codeSuffix: '85746', suffixExclude: 'aaa' },
          { id: '2', type: '20180102144', notes: 'peng', codePrefix: '178', codeMiddle: '690', codeSuffix: '22790', suffixExclude: 'bbb' },
          { id: '3', type: '20180102155', notes: 'hui', codePrefix: '159', codeMiddle: '658', codeSuffix: '93706', suffixExclude: 'ccc' },
          { id: '4', type: '20180102166', notes: 'handsome', codePrefix: '158', codeMiddle: '640', codeSuffix: '37006', suffixExclude: 'ddd' }
        ]
      }
    }
  }
}
