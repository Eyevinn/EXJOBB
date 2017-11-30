$(document).ready(function(){
	console.log("Länkar till js");
	
	var inputtxt = $
	$("#uploadButton").click(function(){
     if($('.outputSelect').val() == ""){
		alert("You have to choose output language!");
		
	}
	if($('#videofile').length == 0){
		alert("You have to upload a video first!");
		
	}
	if($('.outputSelect').val() == "English"){
	if($('.myselect').val() == "English"){
	const execSync = require('child_process').execSync;

	var cmd = execSync('C:\Python27\python.exe C:\Python27\scripts\autosub_app.py -F vtt -S en -D en .videofile');
	}
	const execSync = require('child_process').execSync;

	var cmd = execSync('C:\Python27\python.exe C:\Python27\scripts\autosub_app.py -F vtt -S sv -D en -K AIzaSyASFkvmg0w4efBYB57p--Wa2Rs5BASD5Ec .videofile');
	
	}else if($('.myselect').val() == "English"){
	
	const execSync = require('child_process').execSync;

	var cmd = execSync('C:\Python27\python.exe C:\Python27\scripts\autosub_app.py -F vtt -S en -D sv -K AIzaSyASFkvmg0w4efBYB57p--Wa2Rs5BASD5Ec .videofile');
	} else {
	const execSync = require('child_process').execSync;

	var cmd = execSync('C:\Python27\python.exe C:\Python27\scripts\autosub_app.py -F vtt -S sv -D sv .videofile');
	}
	$('.player').source = $('.videofile');
    });
});