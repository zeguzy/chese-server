/**
 * @description 处理ws
 * @param {*} ws
 * @param {*} req
 * @author zegu
 */
const {
    match
} = require("./wsController/prepare");
const {
    forward,
    closeWs,
    settlement
} = require("./wsController/play");
const {
    roomList
} = require("./utils/variable");
const wsHandler = (ws, req) => {
    // ws.on("")
    ws.on("message", function(message) {
        let mesg = null;
        /**
         * mesg  ：{header:_,data:''}
         */

        try {
            mesg = JSON.parse(message);
            // console.log(mesg);
        } catch (err) {
            // ws.send(
            //     JSON.stringify({
            //         errn: 1,
            //         mesg: "消息格式错误",
            //     })
            // );
            return;
        }
        console.log("msg");
        console.log(mesg);

        //匹配
        if (mesg.header.action == "match") {
            let data = {
                userId: mesg.data.userInfo.id,
                userInfo: {
                    username: mesg.data.userInfo.username,
                    userId: mesg.data.userInfo.id,
                    score: mesg.data.userInfo.score
                },
                ws: ws,
            };
            match(data);
        }
        //消息传递
        if (
            mesg.header.action == "move" ||
            mesg.header.action == "eat" ||
            mesg.header.action == "chat"
        ) {
            //转发
            forward(mesg);
        }
        if (mesg.header.action == "close") {
            closeWs(mesg.data);
        }
        if (mesg.header.action == "Failure") {
            settlement(mesg.data);
        }
    });

    ws.on("close", function() {
        // 连接关闭时，将其移出连接池
        roomList.forEach(function(room1) {
            room1.playerList.forEach((element) => {
                if (element.ws == ws) {
                    //通知其他用户推出游戏
                    try {
                        closeWs({
                            userId: element.userId,
                            roomId: room1.roomId,
                        });
                    } catch (err) {}
                    //删除room   方法有隐患
                    delete room1;
                }
            });
        });
    });
};

module.exports = wsHandler;