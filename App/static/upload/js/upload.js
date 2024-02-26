document.querySelector("#file").addEventListener("input", function(el) {
    let filename = document.querySelector("#file").files[0].name
    document.querySelector("#currentFile").innerText = `当前文件：${filename}`

})
document.querySelector(".submit").addEventListener("click", function() {
    let f = document.querySelector("#file").files[0];
    if (f) {
        // document.querySelector(".preview").classList.remove("invisible");
        let filetype = f.name.substring(f.name.lastIndexOf(".")+1);
        if (filetype === "xlsx") {
            document.querySelector("#form").submit();
        }else {
            showMessage("文件后缀不匹配", "error");
        }
    }else {
        showMessage("未选择文件", "error");
    }
})
document.querySelector(".previewButton").addEventListener("click", function() {
    let f = document.querySelector("#file").files[0];
    if (f) {
        // document.querySelector(".preview").classList.remove("invisible");
        let filetype = f.name.substring(f.name.lastIndexOf(".")+1);
        if (filetype === "xlsx") {
            document.querySelector(".preview").classList.remove("invisible");
            clearData();
            parseXLSX(f);
        }else {
            showMessage("文件后缀不匹配", "error");
        }
    }else {
        showMessage("未选择文件", "error");
    }
})
//表格数据处理
function addData(d) {
    document.querySelector(".resultBody").innerHTML+=`<tr class="content">
                <td class="experimenter">${d.experimenter}</td>
                <td class="participant">${d.participant}</td>
                <td class="studentID">${d.id}</td>
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
//END 表格数据处理

function parseXLSX(f) {
    let fr = new FileReader();
    fr.addEventListener("loadend", function() {
        let workbook = XLSX.read(fr.result, {type: "array", cellDates: true});
        let worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let j = XLSX.utils.sheet_to_json(worksheet);
        j.forEach(item => {
            if (typeof item['实验时间'] == "object") {
                item['实验时间'] = item['实验时间'].toLocaleDateString("zh-CN").replaceAll("/", "-");
            }
            let d = {
                experimenter: item["主试"],
                participant: item["被试"],
                id: item["被试学号"],
                time: item["实验时间"],
                location: item["实验地点"],
                experiment: item["实验名称"],
                material: item["实验材料"],
                fee: item["被试费"],
                mentor: item["导师"]
            }
            addData(d)
        })
    })
    fr.readAsArrayBuffer(f);
}