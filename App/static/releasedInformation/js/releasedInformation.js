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
axios.post('/query_releasedInformation').then (res => {
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
    XLSX.utils.sheet_add_aoa(worksheet, [["实验名称", "主试", "起始日期",  "截止日期", "被试数量", "地点"]], {origin: "A1"});
    XLSX.writeFile(workbook, "releasedInformation.xlsx", { compression: true });
});
function addData(d) {
    document.querySelector(".resultBody").innerHTML+=`<tr class="content">
                <td class="details" onclick="detailsButton_ClickEvent(this)">
                    <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32z m-40 728H184V184h656v656z"></path><path d="M492 400h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zM492 544h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zM492 688h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"></path><path d="M380 368m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z"></path><path d="M380 512m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z"></path><path d="M380 656m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z"></path></svg>
                </td>
                <td class="delete" onclick="deleteButton_ClickEvent(this)">
                    <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72z"></path><path d="M864 256H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg>
                </td>
                <td class="experiment">${d.experiment}</td>
                <td class="experimenter">${d.experimenter}</td>
                <td class="startDate">${d.startDate}</td>
                <td class="endDate">${d.endDate}</td>
                <td class="participantNumber">${d.participantNumber}</td>
                <td class="fee">${d.fee}</td>
                <td class="location">${d.location}</td>
            </tr>`;
}
function detailsButton_ClickEvent(e) {
    let serialNumber = (data.nowPage - 1) * data.maxDataCount + [].indexOf.call(document.querySelectorAll("tr.content") ,e.parentNode);
    previewInit(data.filteredExperiments[serialNumber]);
    document.querySelector(".preview").classList.remove("invisible")
}
function deleteButton_ClickEvent(e) {
    let serialNumber = (data.nowPage - 1) * data.maxDataCount + [].indexOf.call(document.querySelectorAll("tr.content") ,e.parentNode);
    // previewInit(data.filteredExperiments[serialNumber]);
    if (data.filteredExperiments[serialNumber]) {
        axios.post("/delete_releasedInformation", data.filteredExperiments[serialNumber]).then(res => {
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

function previewInit(d) {
    data.previewData = d;
    document.querySelector(".previewContainer .title strong").innerText = d.experiment;
    document.querySelector(".previewContainer .experimenter").innerText = `主试：${d.experimenter}`;
    document.querySelector(".previewContainer .startDate").innerText = `起始日期：${d.startDate}`;
    document.querySelector(".previewContainer .endDate").innerText = `截止日期：${d.endDate}`;
    document.querySelector(".previewContainer .participantNumber").innerText = `被试数量：${d.participantNumber}`;
    document.querySelector(".previewContainer .fee").innerText = `被试费：${d.fee}`;
    document.querySelector(".previewContainer .location").innerText = `地点：${d.location}`;
    document.querySelector(".previewContainer .img").src = d.URL;
}