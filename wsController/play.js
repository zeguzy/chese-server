/**
 * @description 处理移动数据
 * @param {Object} mesg 消息 
 * @author zegu
 */
const {
    roomList
} = require("../utils/variable");
let current = 0

const forward = (mesg) => {
    let {
        roomId
    } = mesg.data
    console.log('mesg.data.userId   ' + mesg.data.userId)
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

module.exports = {
    forward
}