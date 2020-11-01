const router = require('koa-router')()
let {
    getId
} = require('../utils/util.js')


const {
    userList,
} = require('../utils/variable.js')

router.prefix('/api')


router.post('/login', function(ctx, next) {
    const {
        username
    } = ctx.request.body
    let userInfo = null
    try {
        userInfo = userList.get(username)
    } catch (err) {
        ctx.body = {
            errn: '1',
            mesg: 'mesg'
        }
    }
    if (!userInfo) {
        userInfo = {
            id: getId(),
            username,
            // gameRecords: [],
            score: 1000
        }
    }

    userList.set(userInfo.id, {
        userInfo
    })

    ctx.body = {
        errn: '0',
        userInfo
    }
})


module.exports = router