let RECORDSV2_data = {
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
RECORDSV2_requestData(1);

/**
 * 页码更改以后刷新数据
 */
function pageChangeCallback() {
    RECORDSV2_requestData(TABLEJS_data.page, RECORDSV2_data.filterEnable ? RECORDSV2_data.filter : {});
}

setPageChangeCallback(pageChangeCallback);


/**
 * 请求对应页码的数据
 * @param {number} page
 * @param {Object} filter
 *
 */
function RECORDSV2_requestData(page, filter = {}) {
    startLoading();
    axios.post('/query_records', {id: Cookies.get("id"), page: page, filter: filter}).then (res => {
        RECORDSV2_data.data = res.data.data;
        changeTotalPage(res.data.length);
        refreshCompontsStatus();
        recordsV2_refreshData(res.data.data);
        cancelLoading();
    }).catch(err => {
        // console.log(err);
        showMessage(err, "error")
        cancelLoading();
    });
}

function recordsV2_refreshData(data) {
    clearData();
    data.forEach(d => {
        let json = []
        json = addData_jsonParse(d, json);
        addData(json);
    })
}

document.querySelector(".queryPanel .operationButton button.export").addEventListener("click", function() {
    const worksheet = XLSX.utils.json_to_sheet(RECORDSV2_data.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.utils.sheet_add_aoa(worksheet, [["主试", "被试", "被试学号", "实验时间", "实验地点", "实验名称", "实验材料", "被试费", "导师"]], {origin: "A1"});
    XLSX.writeFile(workbook, "records.xlsx", { compression: true });
});

document.querySelector("input.filter").addEventListener("change", function() {
    RECORDSV2_data.filterEnable = document.querySelector("input.filter").checked;
    TABLEJS_data.pageGroup = 0;
    document.querySelector(".pageNum").click();
})
document.querySelector(".dataSelector #startDate").addEventListener("change", function() {
    RECORDSV2_data.filter.date.startDate = document.querySelector(".dataSelector #startDate").value;
    if (RECORDSV2_data.filterEnable) {
        TABLEJS_data.pageGroup = 0;
        document.querySelector(".pageNum").click();
    }
})
document.querySelector(".dataSelector #endDate").addEventListener("change", function() {
    RECORDSV2_data.filter.date.endDate = document.querySelector(".dataSelector #endDate").value;
    if (RECORDSV2_data.filterEnable) {
        TABLEJS_data.pageGroup = 0;
        document.querySelector(".pageNum").click();
    }
})