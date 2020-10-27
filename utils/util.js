/**
 * @description 工具函数
 * @author zegu
 */
let id = 0

/**
 * @description 生成用户id
 */
const getId = () => {
    return id++
}
module.exports = {
    getId
}