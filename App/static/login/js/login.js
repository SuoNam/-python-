document.querySelector("#form").addEventListener("submit", function(e) {
    document.querySelector(".input.password").value = CryptoJS.SHA1(document.querySelector(".input.password").value).toString();


})

document.querySelector(".characterChooseButton.participant").addEventListener("click", function(){
    window.location.replace("/releasedInformation");
})
document.querySelector(".characterChooseButton.experimenter").addEventListener("click", function(){
    document.querySelector(".preview").classList.add("invisible")
})