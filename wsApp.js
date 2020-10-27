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
    forward
} = require('./wsController/play')
const wsHandler = (ws, req) => {
    ws.on("message", function(message) {
        let mesg = null;
        /**
         * mesg  ：{header:_,data:''}
         */
        try {
            mesg = JSON.parse(message);
            // console.log(mesg);
        } catch (err) {
            ws.send(
                JSON.stringify({
                    errn: 1,
                    mesg: "消息格式错误",
                })
            );
            return;
        }
        //匹配
        if (mesg.header.action == "match") {
            console.log('......---==')
            console.log(mesg.data)
            let data = {
                userId: mesg.data.userInfo.id,
                userInfo: {
                    username: mesg.data.userInfo.username,
                    userId: mesg.data.userInfo.id,
                },
                ws: ws,
            };
            match(data);
        }
        //消息传递
        if (mesg.header.action == "move" || mesg.header.action == "eat") {
            //转发
            forward(mesg)
        }
    });
};

module.exports = wsHandler;