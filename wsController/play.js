/**
 * @description 处理移动数据
 * @param {Object} mesg 消息 
 * @author zegu
 */
const {
    roomList,
} = require("../utils/variable");
let current = 0

const forward = (mesg) => {
    let {
        roomId
    } = mesg.data
    roomList.forEach(element => {
        if (element.roomId == roomId) {
            if (mesg.data.userId == roomId) {
                element.playerList[1].ws.send(JSON.stringify(mesg))
            } else {
                element.playerList[0].ws.send(JSON.stringify(mesg))
            }
        }
    });
}

/**
 * 关闭ws后  关闭房间
 */
function closeWs(data) {
    console.log('close')
    let {
        userId,
        roomId
    } = data

    let mesg = {
        header: {
            action: 'close'
        },
        data: {}
    }

    roomList.forEach(element => {
        if (element.roomId == roomId) {
            if (userId == roomId) {
                element.playerList[1].ws.send(JSON.stringify(mesg))
            } else {
                element.playerList[0].ws.send(JSON.stringify(mesg))
            }
            delete element
        }
    });
}

/**
 * 一方失败 结算
 * @param {*} data 
 */
function settlement(data) {
    let {
        userId,
        roomId
    } = data

    let mesg = {
        header: {
            action: 'win'
        }
    }
    roomList.forEach(element => {
        if (element.roomId == roomId) {
            if (userId == roomId) {
                element.playerList[1].ws.send(JSON.stringify(mesg))
            } else {
                element.playerList[0].ws.send(JSON.stringify(mesg))
            }
        }
    })
}

module.exports = {
    forward,
    closeWs,
    settlement
}