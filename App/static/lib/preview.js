// <!--PREVIEW-->
// <div class="preview invisible">
//     <button class="closePreview">×</button>
//     <div class="previewContainer"></div>
// </div>
// <!--END PREVIEW-->


document.querySelector(".preview button.closePreview").addEventListener("click", function(e) {
    e.target.parentNode.classList.add("invisible");
})