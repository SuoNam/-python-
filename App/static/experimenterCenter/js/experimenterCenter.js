let id = Cookies.get("id");
document.querySelector(".nav .title").innerText = `个人中心 - ${id}`;
if (Cookies.get("signal") === "admin") {
    document.querySelector(".audit").classList.remove("invisible");
}