var tables = [];
var students = [];
var load_tables = false

function setLayout(tables_array, students_array){
	tables = tables_array;
	students = students_array;
}

function prepLoad()
{
	load_tables = true;
}

function placeTables(tables){
	$.each(tables, function(){
		tab_arr = $(this)
		var offset = 150
	  var extra_styling = "";
	  var n = $(".tbl").length + 1;
	  var size = "md"
	  if (tab_arr[1]=="sm") {
	      extra_styling = ";width:150px;height:75px"
	  }
	  if (tab_arr[1]=="lg") {
	      extra_styling = ";width:450px;height:225px"
	      offset = 225
	  }
	  var table = '<div id="' + tab_arr[0] + '"class="tbl ' + tab_arr[1] + ' ' + tab_arr[2] + '" style="display:absolute;float:right;display:none;z-index:' + n + ';margin-top:-' + offset + 'px' + extra_styling + '">';
	  table += '<img class="img_tbl" src="/images/table.png" />';
	  table += '</div>';
		append_draggable(table, '.tbl', tab_arr[0] )
		if (tab_arr[2] == 'vert'){
			rotate("#"+tab_arr[0])
		}
		$("#"+tab_arr[0]).css("left", tab_arr[3])
		$("#"+tab_arr[0]).css("top", tab_arr[4])
		$("#"+tab_arr[0]).draggable('disable')
		$("#"+tab_arr[0]).fadeIn();

	});
}

function placeStudents(students){
	$.each(students, function(){
		stud_arr = $(this)
	  var student = '<div id="' + stud_arr[0] + '"class="student" style="display:absolute;float:left;z-index:' + stud_arr[4] + ';margin-top:-100px">';
	  student += '<img class="img_student" src="http://www.wpclipart.com/office/people/business_people_icons/business_person_T.png" />';
	  student += '</div>';
	  append_draggable(student, '.student', stud_arr[0])
	  $("#"+stud_arr[0]).css("left", stud_arr[2]);
	  $("#"+stud_arr[0]).css("top", stud_arr[3]);
	  $("#"+stud_arr[0]).draggable('disable');

	})
}
	


$( document ).ready(function() {
	if (load_tables){

		placeTables(tables)
		placeStudents(students)
	}



});


	// $.each(tables_array, function(){
	// 	alert($(this)[0] + " x: " + $(this)[3] + " y: " + $(this)[4] )
	// });