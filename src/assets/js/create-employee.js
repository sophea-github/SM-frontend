
  $(function(){
  $("#fileupload").change(function(event) {
    var x = URL.createObjectURL(event.target.files[0]);
    $("#upload-img").attr("src",x);
    console.log(event);
  });
})

