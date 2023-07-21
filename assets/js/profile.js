$(document).ready(function(){
    $('#show-form-btn').click(function(){
        $('#update-form').toggle();
    });

    let formBtn = document.getElementById('show-form-btn');
    let formOverlay = document.getElementById('form-overlay');
    let updateForm = document.getElementById('update-form');

    formBtn.addEventListener('click',()=>{
        formOverlay.style.display = 'block';
        updateForm.style.display = 'block';
    });

    formOverlay.addEventListener('click',()=>{
        formOverlay.style.display = 'none';
        updateForm.style.display = 'none';
    });


    let inputfile = document.getElementById('avatar');
    let imagename = document.getElementById('image-name');

    inputfile.addEventListener('change',()=>{
        let inputImage = document.querySelector("input[type=file]").files[0];
        imagename.innerHTML = inputImage.name;
    });
})