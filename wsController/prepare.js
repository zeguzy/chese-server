/**
 * @description 为开局做准备
 * @author zegu
 */

/**
 * 存放房间信息 最右端加入 {roomId,[]}
 */
const {
    roomList
} = require("../utils/variable");


/**
 * 匹配
 * @param {Object} data 
 */
const match = (data) => {

    // console.log(data)
    let rightRoom = roomList[roomList.length - 1];
    if (!rightRoom) {
        rightRoom = {
            roomId: data.userId,
            currentPlayer: 0,
            roomStatus: 0,
            playerList: [data],
        };
        roomList.push(rightRoom);

        //向房主发送房间信息
        data.ws.send(
            JSON.stringify({
                header: {
                    action: 'toPrepare'
                },
                data: {
                    roomId: data.userId,
                    otherPlayers: null,
                    inPerson: data.userInfo,
                }
            })
        );
    }
    //如果最右边的房间已满，则新建一个只有自己的房间
    else if (rightRoom.playerList.length == 2) {
        rightRoom = {
            roomId: data.userId,
            roomStatus: 0,
            playerList: [data],
        };
        roomList.push(rightRoom);

        //向房主发送房间信息
        data.ws.send(
            JSON.stringify({
                header: {
                    action: 'prepare'
                },
                data: {
                    roomId: data.userId,
                    inPerson: data.userInfo,
                    otherPlayers: null,
                }
            })
        );
    } else {


        //将玩家加入房间
        rightRoom.playerList.push(data)

        //更新
        _noticeToPrepare(rightRoom)
    }

};

/**
 * 通知其他玩家
 * @param {Array} room 房间
 */
function _noticeToPrepare(room) {
    for (let i = 0; i < room.playerList.length; i++) {
        for (let n = 0; n < room.playerList.length; n++) {
            if (n != i)
                room.playerList[i].ws.send(
                    JSON.stringify({
                        header: {
                            action: 'OK'
                        },
                        data: {
                            redCamp: i == 0 ? true : false,
                            current: i == 0 ? true : false,
                            roomId: room.roomId,
                            otherPlayers: room.playerList[n].userInfo,
                            inPerson: room.playerList[i].userInfo,
                        }
                    })
                )
        }

    }
}

module.exports = {
    match,
};