/**
 * 将一个简单的json简单转换为addData可用的数组,键名即为className
 * @param {Object} j 源数据
 * @param {Array<Object>} initData 原始数据
 * @return Object
 */
function addData_jsonParse(j, initData = []) {
    for (k in j) {
        initData.push({
            attribute: {
                className: k,
            },
            inner: j[k],
        })
    }
    return initData;
}