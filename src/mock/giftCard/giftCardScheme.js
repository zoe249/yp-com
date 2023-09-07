/*
 * @Author: your name
 * @Date: 2021-01-14 16:24:42
 * @LastEditTime: 2021-01-19 14:16:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\mock\giftCard\giftCardScheme.js
 */
export default {
  getmembers: () => {
    return {
      code: '200000',
      data: {
        data: [
          {
            id: '1',
            number: '20180102133',
            productCode: '20180102133',
            validPeriod: '一个月',
            description: '我是说明一',
            productName: 'liupenghui',
            status: '01',
            createBy: 'aaa',
            createTime: '2020-01-01',
            updateBy: '111',
            updateTime: '2202-01-01',
            published: true,
            faceValue: '100',
            cardType: '1'
          },
          {
            id: '2',
            number: '20180102144',
            productCode: '20180102133',
            validPeriod: '一年',
            description: '我是说明二',
            productName: 'zhangsan',
            status: '01',
            updateBy: '111',
            createBy: 'bbb',
            createTime: '2020-02-02',
            updateTime: '2202-02-02',
            published: false,
            faceValue: '100',
            cardType: '2'
          },
          {
            id: '3',
            number: '20180102155',
            productCode: '20180102133',
            validPeriod: '三天',
            description: '我是说明三',
            productName: 'lisi',
            status: '03',
            updateBy: '111',
            createBy: 'ccc',
            createTime: '2020-03-03',
            updateTime: '2202-03-03',
            published: true,
            faceValue: '100',
            cardType: '1'
          },
          {
            id: '4',
            number: '20180102166',
            productCode: '20180102133',
            validPeriod: '十年',
            description: '我是说明四',
            productName: 'wangwu',
            status: '02',
            updateBy: '111',
            createBy: 'ddd',
            createTime: '2020-04-04',
            updateTime: '2202-04-04',
            published: false,
            faceValue: '200',
            cardType: '1'
          }
        ]
      }
    }
  }
}
