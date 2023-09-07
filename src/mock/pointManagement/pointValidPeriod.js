/*
 * @Author: your name
 * @Date: 2021-01-12 10:16:29
 * @LastEditTime: 2021-01-12 10:31:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\mock\pointManagement\pointValidPeriod.js
 */
export default {
  getmembers: () => {
    return {
      code: '200000',
      data: {
        data: [
          {
            id: '1',
            validPeriod: '一年',
            terminalsId: 'aaa',
            channelsId: '111',
            pointTypeId: '20180102133',
            organizationId: 'liupenghui',
            status: true,
            createTime: '2020-01-01',
            updateTime: '2202-01-01'
          },
          {
            id: '2',
            validPeriod: '六六六天',
            terminalsId: 'bbb',
            channelsId: '222',
            pointTypeId: '20180102144',
            organizationId: 'zhangsan',
            status: false,
            createTime: '2020-02-02',
            updateTime: '2202-02-02'
          },
          {
            id: '3',
            validPeriod: '十一天年',
            terminalsId: 'ccc',
            channelsId: '333',
            pointTypeId: '20180102155',
            organizationId: 'lisi',
            status: true,
            createTime: '2020-03-03',
            updateTime: '2202-03-03'
          },
          {
            id: '4',
            validPeriod: '三个月',
            terminalsId: 'ddd',
            channelsId: '444',
            pointTypeId: '20180102166',
            organizationId: 'wangwu',
            status: false,
            createTime: '2020-04-04',
            updateTime: '2202-04-04'
          }
        ]
      }
    }
  }
}
