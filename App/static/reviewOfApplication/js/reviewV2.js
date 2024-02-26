let REVIEWV2_data = {
    maxDataCount: 10,
    data: [],
}
REVIEWV2_requestData(1);

/**
 * 页码更改以后刷新数据
 */
function pageChangeCallback() {
    REVIEWV2_requestData(TABLEJS_data.page);
}

setPageChangeCallback(pageChangeCallback);

/**
 * 请求对应页码的数据
 * @param {number} page
 * @param {Object} filter
 *
 */
function REVIEWV2_requestData(page, filter = {}) {
    startLoading();
    axios.post('/query_audit', {page: page, filter: filter}).then (res => {
        // console.log(res);
        REVIEWV2_data.data = res.data.data;
        changeTotalPage(res.data.length);
        refreshCompontsStatus();
        reviewV2_refreshData(res.data.data);
        cancelLoading();
    }).catch(err => {
        // console.log(err);
        showMessage(err, "error")
        cancelLoading();
    });
}

function reviewButton_ClickEvent(el) {
    startLoading();
    let serialNumber = (TABLEJS_data.page - 1) * REVIEWV2_data.maxDataCount + [].indexOf.call(document.querySelectorAll("tr.content") ,el.parentNode);
    if (REVIEWV2_data.data[serialNumber]) {
        let tmp = REVIEWV2_data.data[serialNumber]
        if (el.classList.contains("agree")) {
            tmp.pass = "true";
        }else {
            tmp.pass = "false";
        }
        axios.post("/audit", tmp).then(res => {
            showMessage(res.data.message, res.data.messageType);
            if (res.data.status === 1) {
                REVIEWV2_requestData(TABLEJS_data.page);
            }
            cancelLoading();
        }).catch(err => {
            showMessage(err, "error")
            cancelLoading();
        })
    }else {
        showMessage("无数据", "error")
    }
}

function reviewV2_refreshData(data) {
    clearData();
    data.forEach(d => {
        let json = []
        json.push({
            attribute: {
                class: "agree",
                onclick: "reviewButton_ClickEvent(this)",
            },
            inner: '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474c-6.1-7.7-15.3-12.2-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1 0.4-12.8-6.3-12.8z"></path></svg></td>'
        })
        json.push({
            attribute: {
                class: "refuse",
                onclick: "reviewButton_ClickEvent(this)",
            },
            inner: '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M563.8 512l262.5-312.9c4.4-5.2 0.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9c-4.4 5.2-0.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg></td>'
        })
        json = addData_jsonParse(d, json);
        addData(json);
    })
}