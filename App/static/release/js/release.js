// document.querySelector("#file").addEventListener("input", function(el) {
//     let filename = document.querySelector("#file").files[0].name
//     document.querySelector("#currentFile").innerText = `当前文件：${filename}`
//
// })
document.querySelector(".submit").addEventListener("click", function(e) {
    // document.querySelector("#id").value = Cookies.get("id");
    e.preventDefault();
    if (e.target.classList.contains("disabled")) {
        e.preventDefault();
        return false;
    }
    let f = document.querySelector("#file").files[0];
    if (f) {
        // document.querySelector(".preview").classList.remove("invisible");
        let filetype = f.name.substring(f.name.lastIndexOf(".")+1);
        if (["jpg", "png", "webp", "jpeg", "gif", "svg", ].includes(filetype)) {
            document.querySelector("#form").submit();
        }else {
            showMessage("文件后缀不匹配", "error");
        }
    }else {
        showMessage("未选择文件", "error");
    }
})
document.querySelector(".previewButton").addEventListener("click", function(e) {
    e.preventDefault();
    let f = document.querySelector("#file").files[0];
    if (f) {
        // document.querySelector(".preview").classList.remove("invisible");
        let filetype = f.name.substring(f.name.lastIndexOf(".")+1);
        if (["jpg", "png", "webp", "jpeg", "gif", "svg", ].includes(filetype)) {
            document.querySelector(".preview").classList.remove("invisible");
        }else {
            showMessage("文件后缀不匹配", "error");
        }
    }else {
        showMessage("未选择文件", "error");
    }
})
// document.querySelector(".preview button.closePreview").addEventListener("click", function(e) {
//     e.target.parentNode.classList.add("invisible");
// })
let el_f = document.querySelector("#file");
el_f.addEventListener("change", function(el) {
    let u = URL.createObjectURL(el_f.files[0]);
    if (u) {
        document.querySelector(".previewButton").classList.remove("disabled");
    }else {
        document.querySelector(".previewButton").classList.add("disabled");
    }
    document.querySelector(".currentFile").innerText = el_f.files[0].name;
    document.querySelector("img.previewContainer").src = u;
})

document.querySelectorAll(".textInput").forEach(el => {
    el.addEventListener("input", function() {
        if (document.querySelector("#experiment").value && document.querySelector("#participantNumber").value && document.querySelector("#experimenter").value && document.querySelector("#fee").value && document.querySelector("#location").value) {
            document.querySelector(".submit").classList.remove("disabled")
        }else {
            document.querySelector(".submit").classList.add("disabled")
        }
    })
})