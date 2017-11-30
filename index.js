

$(document).ready(function(){
	console.log("Länkar till js");
	
	var inputtxt = $
	$("#uploadButton").click(function(){
     if($('.outputSelect').val() == ""){
		alert("(shortver) You have to choose output language!");
		break;
	}
	alert($('#videofile').length);
	if($('#videofile').length == 0){
		alert("(shortver) You have to upload a video first!");
		break;
	}

	
    });
});