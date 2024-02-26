// document.querySelector("#file").addEventListener("input", function(el) {
//     let filename = document.querySelector("#file").files[0].name
//     document.querySelector("#currentFile").innerText = `当前文件：${filename}`
//
// })
document.querySelector(".submit").addEventListener("click", function(e) {
    // document.querySelector("#id").value = Cookies.get("id");
    if (e.target.classList.contains("disabled")) {
        e.preventDefault();
        return false;
    }else {
        document.querySelector("#password").value = CryptoJS.SHA1(document.querySelector("#password").value).toString();
        document.querySelector("#form").submit();
    }
})
// document.querySelector(".preview button.closePreview").addEventListener("click", function(e) {
//     e.target.parentNode.classList.add("invisible");
// })
document.querySelectorAll(".textInput").forEach(el => {
    el.addEventListener("input", function() {
        if (document.querySelector("#name").value && document.querySelector("#id").value && document.querySelector("#password").value && document.querySelector("#phone").value && document.querySelector("#group").value && document.querySelector("#mentor").value) {
            document.querySelector(".submit").classList.remove("disabled")
        }else {
            document.querySelector(".submit").classList.add("disabled")
        }
    })
})