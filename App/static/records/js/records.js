// init
let data = {
    nowPageGroup: 0,
    nowPage: 0,
    maxDataCount: 10,
    pageNum: 0,
    experiments: [],
    filteredExperiments: [],
    id: Cookies.get("id"),
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
axios.post('/query_records', {
    id: data.id,
}).then (res => {
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
// addData("1","1","1","1","1","1","1","1")
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
    XLSX.utils.sheet_add_aoa(worksheet, [["主试", "被试", "被试学号", "实验时间", "实验地点", "实验名称", "实验材料", "被试费", "导师"]], {origin: "A1"});
    XLSX.writeFile(workbook, "records.xlsx", { compression: true });
});
function addData(d) {
    document.querySelector(".resultBody").innerHTML+=`<tr class="content">
                <td class="experimenter">${d.experimenter}</td>
                <td class="participant">${d.participant}</td>
                <td class="id">${d.id}</td>
                <td class="time">${d.time}</td>
                <td class="location">${d.location}</td>
                <td class="experiment">${d.experiment}</td>
                <td class="material">${d.material}</td>
                <td class="fee">${d.fee}</td>
                <td class="mentor">${d.mentor}</td>
            </tr>`;
}

function clearData() {
    document.querySelector(".resultBody").innerHTML = "";
}

function checkData(val) {
    if (data.filter.date.enable) {
        let experimentDate = new Date(val.time);
        if (experimentDate < data.filter.date.startDate || experimentDate > data.filter.date.endDate) {
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