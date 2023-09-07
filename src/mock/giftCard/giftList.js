/*
 * @Author: your name
 * @Date: 2021-01-15 15:38:45
 * @LastEditTime: 2021-01-16 10:32:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\mock\giftCard\giftList.js
 */
export default {
  getmembers: () => {
    return {
      code: '200000',
      data: {
        data: [
          {
            id: '1',
            cardNumber: '20180102133',
            faceValue: '一个月',
            schemeNumber: '我是说明一',
            name: 'liupenghui',
            status: true,
            cardType: 'aaa',
            lifecycle: '2020-01-01',
            balance: '111',
            updateTime: '2202-01-01'
          },
          {
            id: '2',
            cardNumber: '20180102144',
            faceValue: '一年',
            schemeNumber: '我是说明二',
            name: 'zhangsan',
            status: false,
            balance: '111',
            cardType: 'bbb',
            lifecycle: '2020-02-02',
            updateTime: '2202-02-02'
          },
          {
            id: '3',
            cardNumber: '20180102155',
            faceValue: '三天',
            schemeNumber: '我是说明三',
            name: 'lisi',
            status: true,
            balance: '111',
            cardType: 'ccc',
            lifecycle: '2020-03-03',
            updateTime: '2202-03-03'
          },
          {
            id: '4',
            cardNumber: '20180102166',
            faceValue: '十年',
            schemeNumber: '我是说明四',
            name: 'wangwu',
            status: false,
            balance: '111',
            cardType: 'ddd',
            lifecycle: '2020-04-04',
            updateTime: '2202-04-04'
          }
        ]
      }
    }
  }
}
