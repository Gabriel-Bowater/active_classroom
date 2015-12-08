var tables = [];
var students = [];
var load_tables = false

function setLayout(tables_array, students_array){
	tables = tables_array;
	students = students_array;
}

function prepLoad(){
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
	      extra_styling = ";width:100px;height:50px"
	  }
	  if (tab_arr[1]=="lg") {
	      extra_styling = ";width:350px;height:175px"
	      offset = 225
	  }
	  var table = '<div id="' + tab_arr[0] + '"class="tbl ' + tab_arr[1] + ' ' + tab_arr[2] + '" style="postion:absolute;float:right;display:none;z-index:' + n + ';margin-top:-' + offset + 'px' + extra_styling + '">';
	  table += '<img class="img_tbl" src="/images/table.png" />';
	  table += '</div>';
		append_draggable(table, '.tbl', tab_arr[0] )
		if (tab_arr[2] == 'vert'){
			tb_id = "#"+tab_arr[0]
  		$(tb_id).css("transform", "rotate(90deg)")
		}
		$("#"+tab_arr[0]).css("left", tab_arr[3])
		$("#"+tab_arr[0]).css("top", tab_arr[4])
	  if($("#page_id").val()=="show_class"){
			$("#"+tab_arr[0]).draggable('disable')
	  }
		$("#"+tab_arr[0]).fadeIn();

	});
}

function placeStudents(students){
	var std_photos = $.parseJSON($("#student_images").val())

	$.each(students, function(){
		stud_arr = $(this)
		var unset = "";
		if (stud_arr[1] == "unset"){
			unset = "unset"
		}

	  var student = '<div id="' + stud_arr[0] + '"class="student '+ unset +'" style="display:absolute;float:left;z-index:' + stud_arr[4] + ';margin-top:-100px">';
	  student += '<img class="img_student" src="/images/unknown_student.png" />';
	  student += '<input type="hidden" id="' + stud_arr[0] + 'db_id" value="'+ stud_arr[1] +'" class="std_db_id">';
	  student += '</div>';
	  append_draggable(student, '.student', stud_arr[0])
	  $("#"+stud_arr[0]).css("left", stud_arr[2]);
	  $("#"+stud_arr[0]).css("top", stud_arr[3]);
	  if($("#page_id").val()=="show_class"){
	  	$("#"+stud_arr[0]).draggable('disable');
	  }
	  if (stud_arr[1] != "unset"){

	  	if (std_photos.hasOwnProperty(stud_arr[1])){
	  		console.log(std_photos[stud_arr[1]])
	  		$("#"+stud_arr[0]+" img").attr("src", std_photos[stud_arr[1]]).addClass("set_std_img")
	  		$.get('/student/check_sex/'+stud_arr[1]+":"+stud_arr[0]).done(function(result){
		  		$("#"+result.page_id).append("<p class='student-name'>"+result.name+"</p>")
		  	});
	  	} else {

		  	$.get('/student/check_sex/'+stud_arr[1]+":"+stud_arr[0]).done(function(result){
		  		if (result.sex=="male"){
		  			$("#"+result.page_id+" img").attr("src", "/images/male.png")
		  		} else {
		  			$("#"+result.page_id+" img").attr("src", "/images/female.png")	  			
		  		}
		  		$("#"+result.page_id).append("<p class='student-name'>"+result.name+"</p>")

		  	});
		  }
	  }
	})
}

function updateStudents(){
	var students = "";
	$('.student').each(function(index) {
		students += ($(this).attr("id") + "," + $( "#" + $(this).attr("id") + "db_id").val() + "," + $(this).css("left") + "," + $(this).css("top") + "," + $(this).css("z-index") + ",")
	})		

	saving = $.ajax({
  					url: "/classrooms/"+$("#classroom_id").val(),
  					type: "PATCH",
  					data: {students: students}
  					});
	
  saving.done(function(result){
  	console.log("result: "+ result)
  })
};

$( document ).ready(function() {
	if (load_tables){

		placeTables(tables)

		if($("#page_id").val()=="edit_class"){
			$(".tbl").click(function(){
				$(".tbl").removeClass("selected")
				$(this).addClass("selected")
			});
		}

		placeStudents(students)
		if($("#page_id").val()=="edit_class"){
			$(".student").click(function(){
				console.log("mouseenter")
				$(".popup").remove()
				$(this).append("<div class='popup'><p>save changes to edit student details</p></div>")
				$(".popup").delay(3000).fadeOut();
			});
		}

	}

	if ($("#page_id").val()=="show_class"){
		$(".student").click(function(){
			studentClick($(this))
		})
	}

	$("#toggle-names").click(function(){
		$(".student-name").slideToggle();
	})

});
