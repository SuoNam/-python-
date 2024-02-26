// 在body里加入：
// <div className="messageBox invisible">
//     <div className="message"></div>
// </div>



let querys = new URLSearchParams(window.location.search);
function changeMessageType(el, type) {
    el.classList.remove("error");
    el.classList.remove("warning");
    el.classList.remove("success");
    el.classList.add(type);
}
if (querys.get("message") && querys.get("message_type")) {
    let el = document.querySelector(".messageBox");
    changeMessageType(el, querys.get("message_type"))
    el.classList.remove("invisible")
    document.querySelector(".message").innerText = `${decodeURI(querys.get("message"))}`
    setTimeout(function() {
        el.classList.remove("error");
        el.classList.remove("warning");
        el.classList.remove("success");
    }, 7000);
}