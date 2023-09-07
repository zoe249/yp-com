/*
 * @Author: your name
 * @Date: 2021-01-20 09:29:13
 * @LastEditTime: 2021-01-20 10:16:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\mock\slideShow\slideShow.js
 */
export default {
  getmembers: () => {
    return {
      code: '200000',
      data: {
        data: [
          { id: '1', publicityType: '20180102133', name: 'liupenghui', displayed: true, site: '2020-01-01', pictureURL: '2202-01-01' },
          { id: '2', publicityType: '20180102144', name: 'zhangsan', displayed: false, site: '2020-02-02', pictureURL: '2202-02-02' },
          { id: '3', publicityType: '20180102155', name: 'lisi', displayed: true, site: '2020-03-03', pictureURL: '2202-03-03' },
          { id: '4', publicityType: '20180102166', name: 'wangwu', displayed: false, site: '2020-04-04', pictureURL: '2202-04-04' }
        ]
      }
    }
  }
}
