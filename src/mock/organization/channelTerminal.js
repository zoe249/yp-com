/*
 * @Author: your name
 * @Date: 2020-12-14 11:14:53
 * @LastEditTime: 2020-12-21 10:28:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\mock\organization\channelTerminal.js
 */
export default {
  getmembers: () => {
    return {
      code: 2000,
      data: {
        data: [
          {
            id: '1',
            channelsId: '20180102133',
            channelsName: 'asd',
            channelsCode: '123',
            terminalsId: '20180102177',
            terminalsName: 'lll',
            terminalsCode: '000',
            status: false,
            createTime: '2020-01-01',
            updateTime: '2202-01-01'
          },
          {
            id: '2',
            channelsId: '20180102144',
            channelsName: 'asds',
            channelsCode: '123',
            terminalsId: '20180102188',
            terminalsName: 'ppp',
            terminalsCode: '000',
            status: false,
            createTime: '2020-02-02',
            updateTime: '2202-02-02'
          },
          {
            id: '3',
            channelsId: '20180102155',
            channelsName: 'asda',
            channelsCode: '123',
            terminalsId: '20180102199',
            terminalsName: 'jjj',
            terminalsCode: '000',
            status: true,
            createTime: '2020-03-03',
            updateTime: '2202-03-03'
          },
          {
            id: '4',
            channelsId: '20180102166',
            channelsName: 'asdf',
            channelsCode: '123',
            terminalsId: '20180102100',
            terminalsName: 'hhh',
            terminalsCode: '000',
            status: false,
            createTime: '2020-04-04',
            updateTime: '2202-04-04'
          }
        ]
      }
    }
  }
}
