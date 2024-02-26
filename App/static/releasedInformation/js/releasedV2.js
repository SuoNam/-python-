let RELEASEDV2_data = {
    maxDataCount: 10,
    data: [],
    filterEnable: false,
    filter: {
        date: {
            enable: true,
            startDate: document.querySelector("#startDate").value,
            endDate: document.querySelector("#endDate").value,
        }
    },
}
refreshCompontsStatus();
RELEASEDV2_requestData(1);

/**
 * 页码更改以后刷新数据
 */
function pageChangeCallback() {
    RELEASEDV2_requestData(TABLEJS_data.page, RELEASEDV2_data.filterEnable ? RELEASEDV2_data.filter : {});
}

setPageChangeCallback(pageChangeCallback);

/**
 * 请求对应页码的数据
 * @param {number} page
 * @param {Object} filter
 *
 */
function RELEASEDV2_requestData(page, filter = {}) {
    startLoading();
    axios.post('/query_releasedInformation', {page: page, filter: filter}).then (res => {
        // console.log(res)
        RELEASEDV2_data.data = res.data.data;
        changeTotalPage(res.data.length);
        refreshCompontsStatus();
        releasedV2_refreshData(res.data.data);
        cancelLoading();
    }).catch(err => {
        showMessage(err, "error")
        cancelLoading();
    });
}

function releasedV2_refreshData(data) {
    clearData();
    data.forEach(d => {
        let json = []
        let tmp = {
            experiment: d.experiment,
            experimenter: d.experimenter,
            startDate: d.startDate,
            endDate: d.endDate,
            participantNumber: d.participantNumber,
            fee: d.fee,
            location: d.location,
        }
        // let tmp = d;
        // delete tmp.URL;
        json.push({
            attribute: {
                class: "details",
                onclick: "detailsButton_ClickEvent(this)",
            },
            inner: '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32z m-40 728H184V184h656v656z"></path><path d="M492 400h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zM492 544h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zM492 688h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"></path><path d="M380 368m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z"></path><path d="M380 512m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z"></path><path d="M380 656m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z"></path></svg>'
        })
        json.push({
            attribute: {
                class: "delete",
                onclick: "deleteButton_ClickEvent(this)",
            },
            inner: '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72z"></path><path d="M864 256H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg>'
        })
        json = addData_jsonParse(tmp, json);
        addData(json);
    })
}

function detailsButton_ClickEvent(el) {
    let serialNumber = (TABLEJS_data.page - 1) * RELEASEDV2_data.maxDataCount + [].indexOf.call(document.querySelectorAll("tr.content") ,el.parentNode);
    previewInit(RELEASEDV2_data.data[serialNumber]);
    document.querySelector(".preview").classList.remove("invisible")
}
function deleteButton_ClickEvent(el) {
    let serialNumber = (TABLEJS_data.page - 1) * RELEASEDV2_data.maxDataCount + [].indexOf.call(document.querySelectorAll("tr.content") ,el.parentNode);
    if (RELEASEDV2_data.data[serialNumber]) {
        startLoading();
        console.log(RELEASEDV2_data.data[serialNumber]);
        axios.post("/delete_releasedInformation", RELEASEDV2_data.data[serialNumber]).then(res => {
            showMessage(res.data.message, res.data.messageType);
            RELEASEDV2_requestData(TABLEJS_data.page, RELEASEDV2_data.filterEnable ? RELEASEDV2_data.filter : {});
            cancelLoading();
        }).catch(err => {
            showMessage(err, "error")
            cancelLoading();
        })
    }else {
        showMessage("无数据", "error")
    }
}


function previewInit(d) {
    document.querySelector(".previewContainer .title strong").innerText = d.experiment;
    document.querySelector(".previewContainer .experimenter").innerText = `主试：${d.experimenter}`;
    document.querySelector(".previewContainer .startDate").innerText = `起始日期：${d.startDate}`;
    document.querySelector(".previewContainer .endDate").innerText = `截止日期：${d.endDate}`;
    document.querySelector(".previewContainer .participantNumber").innerText = `被试数量：${d.participantNumber}`;
    document.querySelector(".previewContainer .fee").innerText = `被试费：${d.fee}`;
    document.querySelector(".previewContainer .location").innerText = `地点：${d.location}`;
    document.querySelector(".previewContainer .img").src = d.URL;
}

document.querySelector(".queryPanel .operationButton button.export").addEventListener("click", function() {
    const worksheet = XLSX.utils.json_to_sheet(RELEASEDV2_data.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.utils.sheet_add_aoa(worksheet, [["实验名称", "主试", "起始日期",  "截止日期", "被试数量", "地点"]], {origin: "A1"});
    XLSX.writeFile(workbook, "releasedInformation.xlsx", { compression: true });
});

document.querySelector("input.filter").addEventListener("change", function() {
    RELEASEDV2_data.filterEnable = document.querySelector("input.filter").checked;
    TABLEJS_data.pageGroup = 0;
    document.querySelector(".pageNum").click();
})
document.querySelector(".dataSelector #startDate").addEventListener("change", function() {
    RELEASEDV2_data.filter.date.startDate = document.querySelector(".dataSelector #startDate").value;
    if (RELEASEDV2_data.filterEnable) {
        TABLEJS_data.pageGroup = 0;
        document.querySelector(".pageNum").click();
    }
})
document.querySelector(".dataSelector #endDate").addEventListener("change", function() {
    RELEASEDV2_data.filter.date.endDate = document.querySelector(".dataSelector #endDate").value;
    if (RELEASEDV2_data.filterEnable) {
        TABLEJS_data.pageGroup = 0;
        document.querySelector(".pageNum").click();
    }
})