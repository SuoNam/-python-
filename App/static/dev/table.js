//init
let TABLEJS_data = {
    page: 1,
    dataLength: 0,
    pageGroup: 0,
    totalPage: 1,
    pageChangeCallback: function(){},
}

/**
 * 设置切换页码之后的处理，一般是切换数据
 */
function setPageChangeCallback(f) {
    TABLEJS_data.pageChangeCallback = f;
}

/**
 * 开始加载
 * @author isyuah <lyimsup@outlook.com>
 */
function startLoading() {
    document.querySelector(".loading").classList.remove("disabled");
    document.querySelector(".loading .icon").classList.remove("disabled");
}
/**
 * 开始加载
 * @author isyuah <lyimsup@outlook.com>
 */
function cancelLoading() {
    document.querySelector(".loading").classList.add("disabled");
    document.querySelector(".loading .icon").classList.add("disabled");
}

/**
 * 使所有的页码都失去选择状态 **一般内部使用**
 * @author isyuah <lyimsup@outlook.com>
 */
function unselectAllPage() {
    document.querySelectorAll(".pageNum").forEach((el) => {
        el.classList.remove("current");
    })
}

/**
 * 刷新组件状态，纠正禁用和隐藏状态 - 修改页码和数据之后调用
 * @author isyuah <lyimsup@outlook.com>
 */
function refreshCompontsStatus() {
    //更改页码数字
    document.querySelectorAll(".pageNum").forEach((el) => {
        el.innerText = parseInt(el.getAttribute("page")) + TABLEJS_data.pageGroup * 5;
    })
    //如果当前组不够五个页码，就使多余的隐藏
    let restBlockNum = TABLEJS_data.totalPage - TABLEJS_data.pageGroup * 5;
    document.querySelectorAll(".pageNum").forEach((el) => {
        if (parseInt(el.getAttribute("page")) > restBlockNum) {
            el.classList.add("invisible");
        }else {
            el.classList.remove("invisible")
        }
    })
    //更改左右省略号状态 - 隐藏
    if (TABLEJS_data.pageGroup === 0) {
        document.querySelector(".lastGroup").classList.add("invisible");
    }else {
        document.querySelector(".lastGroup").classList.remove("invisible");
    }
    if (TABLEJS_data.pageGroup * 5 + 5 >= TABLEJS_data.totalPage ) {
        document.querySelector(".nextGroup").classList.add("invisible");
    }else {
        document.querySelector(".nextGroup").classList.remove("invisible");
    }
    //刷新左右箭头状态
    if (TABLEJS_data.page <= 1) {
        document.querySelector(".lastPage").classList.add("disabled");
    }else {
        document.querySelector(".lastPage").classList.remove("disabled");
    }
    if (TABLEJS_data.page >= TABLEJS_data.totalPage) {
        document.querySelector(".nextPage").classList.add("disabled");
    }else {
        document.querySelector(".nextPage").classList.remove("disabled");
    }
}

/**
 * 更改页数
 * @author isyuah <lyimsup@outlook.com>
 * @param {number} p
 */
function changePage(p) {
    TABLEJS_data.page = p;
}

/**
 * 更改总页数
 * @author isyuah <lyimsup@outlook.com>
 * @param {number} p
 */
function changeTotalPage(p) {
    TABLEJS_data.totalPage = p;
}

/**
 * @author isyuah <lyimsup@outlook.com>
 * @param { Array<Object> }data
 */
function importData(data) {
    data.forEach(d => {
        addData(d);
    })
}

document.querySelectorAll(".pageNum").forEach((el) => {
    el.addEventListener("click", function (){
        unselectAllPage();
        el.classList.add("current");
        TABLEJS_data.page = parseInt(document.querySelector(".pageNum.current").getAttribute("page")) + TABLEJS_data.pageGroup * 5;
        startLoading();
        TABLEJS_data.pageChangeCallback();
        refreshCompontsStatus();
        cancelLoading();
    })
})
// TODO
// INIT 设置页码相关事件
document.querySelector(".lastGroup").addEventListener("click", function() {
    TABLEJS_data.pageGroup--;
    document.querySelector(".pageNum").click();
})
document.querySelector(".nextGroup").addEventListener("click", function() {
    TABLEJS_data.pageGroup++;
    document.querySelector(".pageNum").click();
})
document.querySelector(".lastPage").addEventListener("click", function() {
    if (this.classList.contains("disabled")) return;
    if (parseInt(document.querySelector(".pageNum.current").getAttribute("page")) === 1) {
        TABLEJS_data.pageGroup--;
        document.querySelector(".pageNum[page='5']").click();
    }else {
        document.querySelector(`.pageNum[page="${TABLEJS_data.page - 1 - TABLEJS_data.pageGroup * 5}"]`).click();
    }
})
document.querySelector(".nextPage").addEventListener("click", function() {
    if (this.classList.contains("disabled")) return;
    if (parseInt(document.querySelector(".pageNum.current").getAttribute("page")) === 5) {
        TABLEJS_data.pageGroup++;
        document.querySelector(".pageNum").click();
    }else {
        document.querySelector(`.pageNum[page="${TABLEJS_data.page + 1 - TABLEJS_data.pageGroup * 5}"]`).click();
    }
})
// INIT END

/**
 * 添加数据 .resultBody
 * @author isyuah <lyimsup@outlook.com>
 * @param { Array<Object> } data 要添加的数据
 */
function addData(data) {
    let el_table = document.querySelector("tbody.resultBody");
    let el_tr = document.createElement("tr");
    el_tr.classList.add("content")
    data.forEach(d => {
        let el_tmp = document.createElement("td");
        // el_tmp.className = d.className;
        for (attr in d.attribute) {
            el_tmp.setAttribute(attr, d.attribute[attr]);
        }
        el_tmp.innerHTML = d.inner;
        el_tr.appendChild(el_tmp);
    })
    el_table.appendChild(el_tr);
}

/**
 * 清空数据 .resultBody
 * @author isyuah <lyimsup@outlook.com>
 */
function clearData() {
    document.querySelector(".resultBody").innerHTML = "";
}