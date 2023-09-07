/*
 * @Author: your name
 * @Date: 2020-12-04 11:09:21
 * @LastEditTime: 2021-01-11 20:51:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \crm-mvp-system-web\src\mock\channel\channel.js
 */
export default {
  getmembers: () => {
    return {
      code: '200000',
      data: {
        data: [
          { id: '1', species: '111', code: '20180102133', name: 'liupenghui', status: true, createTime: '2020-01-01', updateTime: '2202-01-01' },
          { id: '2', species: '222', code: '20180102144', name: 'zhangsan', status: false, createTime: '2020-02-02', updateTime: '2202-02-02' },
          { id: '3', species: '333', code: '20180102155', name: 'lisi', status: true, createTime: '2020-03-03', updateTime: '2202-03-03' },
          { id: '4', species: '444', code: '20180102166', name: 'wangwu', status: false, createTime: '2020-04-04', updateTime: '2202-04-04' }
        ]
      }
    }
  }
}
