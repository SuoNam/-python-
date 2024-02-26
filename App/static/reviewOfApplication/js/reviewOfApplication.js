// init
let data = {
    nowPageGroup: 0,
    nowPage: 0,
    maxDataCount: 10,
    pageNum: 0,
    experiments: [],
    filteredExperiments: [],
    studentID: Cookies.get("id"),
    filter : {
        date: {
            enable: false,
            startDate: new Date("2024-01-01"),
            endDate: new Date("2028-01-01"),
        }
    }
}
//获取数据
refresh();
startLoading();
axios.post('/query_audit').then (res => {
    // console.log(res);
    data.experiments = res.data;
    data.filteredExperiments = res.data;
    data.pageNum = Math.ceil(data.filteredExperiments.length / data.maxDataCount);
    refresh();
}).catch(err => {
    // console.log(err);
    showMessage(err, "error")
    cancelLoading();
});
//计算页数

// init

function startLoading() {
    document.querySelector(".loading").classList.remove("disabled");
    document.querySelector(".loading .icon").classList.remove("disabled");
}
function cancelLoading() {
    document.querySelector(".loading").classList.add("disabled");
    document.querySelector(".loading .icon").classList.add("disabled");
}

function unselectAllPage() {
    document.querySelectorAll(".pageNum").forEach((el) => {
        el.classList.remove("current");
    })
}
function refresh() {
    startLoading();
    //更改页码数字
    document.querySelectorAll(".pageNum").forEach((el) => {
        el.innerText = parseInt(el.getAttribute("page")) + data.nowPageGroup * 5;
    })
    //如果当前组不够五个页码，就使多余的隐藏
    let restBlockNum = data.pageNum - data.nowPageGroup * 5;
    let i = 1;
    document.querySelectorAll(".pageNum").forEach((el) => {
        if (i > restBlockNum) {
            el.classList.add("invisible");
        }else {
            el.classList.remove("invisible")
        }
        i++;
    })
    //更改左右省略号状态
    if (data.nowPageGroup === 0) {
        document.querySelector(".lastGroup").classList.add("invisible");
    }else {
        document.querySelector(".lastGroup").classList.remove("invisible");
    }
    if (data.nowPageGroup * 5 + 5 >= data.pageNum ) {
        document.querySelector(".nextGroup").classList.add("invisible");
    }else {
        document.querySelector(".nextGroup").classList.remove("invisible");
    }
    //更改当前页码
    data.nowPage = parseInt(document.querySelector(".pageNum.current").getAttribute("page")) + data.nowPageGroup * 5;
    //刷新左右箭头状态
    if (data.nowPage === 1) {
        document.querySelector(".lastPage").classList.add("disabled");
    }else {
        document.querySelector(".lastPage").classList.remove("disabled");
    }
    if (data.nowPage >= data.pageNum) {
        document.querySelector(".nextPage").classList.add("disabled");
    }else {
        document.querySelector(".nextPage").classList.remove("disabled");
    }

    //刷新表格内容
    clearData();
    for (let i = data.nowPage * data.maxDataCount - data.maxDataCount; i < data.nowPage * data.maxDataCount; i++) {
        if (i < data.filteredExperiments.length) {
            if (checkData(data.filteredExperiments[i])) {
                addData(data.filteredExperiments[i]);
            }
        }
    }
    cancelLoading();
}

document.querySelectorAll(".pageNum").forEach((el) => {
    el.addEventListener("click", function (){
        unselectAllPage();
        el.classList.add("current");
        // data.nowPage = parseInt(document.querySelector(".pageNum.current").getAttribute("page")) + data.nowPageGroup * 5;
        refresh();
    })
})

document.querySelector(".lastGroup").addEventListener("click", function() {
    data.nowPageGroup--;
    document.querySelector(".pageNum").click();
})
document.querySelector(".nextGroup").addEventListener("click", function() {
    data.nowPageGroup++;
    document.querySelector(".pageNum").click();
})
document.querySelector(".lastPage").addEventListener("click", function() {
    if (this.classList.contains("disabled")) return;
    if (parseInt(document.querySelector(".pageNum.current").getAttribute("page")) === 1) {
        data.nowPageGroup--;
        document.querySelector(".pageNum[page='5']").click();
    }else {
        document.querySelector(`.pageNum[page="${data.nowPage - 1 - data.nowPageGroup * 5}"]`).click();
    }
})
document.querySelector(".nextPage").addEventListener("click", function() {
    if (this.classList.contains("disabled")) return;
    if (parseInt(document.querySelector(".pageNum.current").getAttribute("page")) === 5) {
        data.nowPageGroup++;
        document.querySelector(".pageNum").click();
    }else {
        document.querySelector(`.pageNum[page="${data.nowPage + 1 - data.nowPageGroup * 5}"]`).click();
    }
})

document.querySelector(".queryPanel .operationButton button.filter").addEventListener("click", function() {
    startLoading();
    data.filter.date.enable = true;
    data.filter.date.startDate = new Date(document.querySelector(".dataSelector #startDate").value);
    data.filter.date.endDate = new Date(document.querySelector(".dataSelector #endDate").value);
    refreshData();
    refresh();
    cancelLoading();
})
document.querySelector(".queryPanel .operationButton button.export").addEventListener("click", function() {
    const worksheet = XLSX.utils.json_to_sheet(data.filteredExperiments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.utils.sheet_add_aoa(worksheet, [["姓名", "学号", "手机号",  "课题组", "导师名"]], {origin: "A1"});
    XLSX.writeFile(workbook, "audit.xlsx", { compression: true });
});
function addData(d) {
    document.querySelector(".resultBody").innerHTML+=`<tr class="content">
                <td class="agree" onclick="reviewButton_ClickEvent(this)">
                    <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474c-6.1-7.7-15.3-12.2-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1 0.4-12.8-6.3-12.8z"></path></svg>                </td>
                <td class="refuse" onclick="reviewButton_ClickEvent(this)">
                    <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M563.8 512l262.5-312.9c4.4-5.2 0.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9c-4.4 5.2-0.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>                </td>
                <td class="name">${d.name}</td>
                <td class="id">${d.id}</td>
                <td class="phone">${d.phone}</td>
                <td class="group">${d["group"]}</td>
                <td class="mentor">${d.mentor}</td>
            </tr>`;
}
function reviewButton_ClickEvent(el) {
    let serialNumber = (data.nowPage - 1) * data.maxDataCount + [].indexOf.call(document.querySelectorAll("tr.content") ,el.parentNode);
    // previewInit(data.filteredExperiments[serialNumber]);
    if (data.filteredExperiments[serialNumber]) {
        let tmp = data.filteredExperiments[serialNumber]
        if (el.classList.contains("agree")) {
            tmp.pass = "true";
        }else {
            tmp.pass = "false";
        }
        console.log(tmp);
        axios.post("/audit", tmp).then(res => {
            if (res.data.status === 1) {
                data.experiments.splice(data.experiments.indexOf(data.filteredExperiments[serialNumber]), 1);
                data.filteredExperiments.splice(serialNumber, 1);
                refresh();
            }
            showMessage(res.data.message, res.data.messageType);
        }).catch(err => {
            showMessage(err, "error")
            cancelLoading();
        })
    }else {
        showMessage("无数据", "error")
    }
}
function clearData() {
    document.querySelector(".resultBody").innerHTML = "";
}

function checkData(val) {
    if (data.filter.date.enable) {
        let startDate = new Date(val.startDate);
        let endDate = new Date(val.endDate);
        if (startDate < data.filter.date.startDate || endDate > data.filter.date.endDate) {
            return false;
        }
    }

    return true;
}

function refreshData() {
    data.filteredExperiments = data.experiments.filter(val => {
        return checkData(val)
    });
    data.nowPage = 1;
    data.nowPageGroup = 0;
    data.pageNum = Math.ceil(data.filteredExperiments.length / data.maxDataCount);
}