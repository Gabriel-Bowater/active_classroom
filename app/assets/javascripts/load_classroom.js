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
	  var table = '<div id="' + tab_arr[0] + '"class="tbl ' + tab_arr[1] + ' ' + tab_arr[2] + '" style="postion:absolute;float:right;display:none;z-index:' + n + ';margin-top:-' + offset + 'px' + extra_styling + '">';
	  table += '<img class="img_tbl" src="/images/table.png" />';
	  table += '</div>';
		append_draggable(table, '.tbl', tab_arr[0] )
		if (tab_arr[2] == 'vert'){
			tb_id = "#"+tab_arr[0]
				var new_height = $( tb_id ).css("width")
  			var new_width = $( tb_id ).css("height")
  			$( tb_id ).css("height", new_height)
  			$( tb_id ).css("width", new_width)
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
	$.each(students, function(){
		stud_arr = $(this)
		var unset = "";
		if (stud_arr[1] == "unset"){
			unset = "unset"
		}
	  var student = '<div id="' + stud_arr[0] + '"class="student '+ unset +'" style="display:absolute;float:left;z-index:' + stud_arr[4] + ';margin-top:-100px">';
	  student += '<img class="img_student" src="/images/person_icon.svg" />';
	  student += '<input type="hidden" id="' + stud_arr[0] + 'db_id" value="'+ stud_arr[1] +'">';
	  student += '</div>';
	  append_draggable(student, '.student', stud_arr[0])
	  $("#"+stud_arr[0]).css("left", stud_arr[2]);
	  $("#"+stud_arr[0]).css("top", stud_arr[3]);
	  if($("#page_id").val()=="show_class"){
	  	$("#"+stud_arr[0]).draggable('disable');
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

function studentHtml(result){
	console.log("comments length: " + result.comments.length)
	var student_html = "<h3> Student Record</h3><br>"
	student_html+="<div id='student_details'><p> name: " + result.name + "</p><br>"
	student_html+="<p> Sex: " +  result.sex + "</p><br></div>"
	student_html+="<div id='student_comments'><h4>Comments</h4>"
	for (var i = 0; i < result.comments.length; i++) {
		student_html+='<p style="font-weight:bold;margin-bottom:-7px">Title: '+result.comments[i].title+'<img id="mini-disposition"src="/images/'+result.comments[i].disposition+'.png"></p>'
		student_html+='<p id="comment-content">'+result.comments[i].content+'</p>'
	};
	student_html+="</div>"
	student_html+="<div id='student_comment_form'>"
	student_html+="<label>Title(optional): </label><input type='text' id='new_comment_title' name='new_comment_title'><br>"
	student_html+="<textarea id='new_comment_text_area' name='new_comment_content'></textarea><br>"
	student_html+='<div id="comment_dispostion"><input type="radio" name="disposition" id="angry" value="angry" /><label for="angry"><img src="/images/angry.png" alt="angry face" /></label>'
	student_html+='<input type="radio" name="disposition" id="neutral" value="neutral" /><label for="neutral"><img src="/images/neutral.png" alt="neutral face" /></label>'
	student_html+='<input type="radio" name="disposition" id="happy" value="happy" /><label for="happy"><img src="/images/happy.png" alt="happy face" /></label>'
	student_html+='</div>'
	student_html+="<button id='new_comment_submit'>Save</button>"
	student_html+="</div>"
	return student_html
}

function studentClick(student){
	$('#overlay').remove()
	var $overlay = $('<div id="overlay"></div>');
	var $div = $('<div id="overlay-window"></div>');
	var $content = $('<p></p>');
	$overlay.append($div);
	$div.append($content);
	$('body').append($overlay);
	if(student.hasClass("unset")){
		$div.prepend("<h3>Create new student.</h3>")
		$content.append("<br><label>Name: </label><input type='text' id='new-stud-name'> </br>")
		$content.append('<form><input type="radio" name="sex" value="male">Male<br><input type="radio" name="sex" value="female">Female</form>')
		$content.append("<p><button id='save-new-student'>Save</button>  |  <button id='close-window'>Close</button></p>")
	} else {
		stud_id = student.children('input').val();
		console.log(student.attr("id") + " set student")
		student_info = $.get('/students/info/'+ stud_id)
		student_info.done(function(result){
			student_html = studentHtml(result)
			$content.prepend(student_html)
			$('#comment_dispostion input:radio').addClass('input_hidden');
			$('#comment_dispostion label').click(function() {
    		$(this).addClass('selected_disposition').siblings().removeClass('selected_disposition');
			});

			$('#new_comment_submit').click(function(){
				post_comment = $.post('/comments',
															{teacher_id: $("#teacher_id").val(),
															student_id: stud_id,
															title: $('#new_comment_title').val(),
															content: $('#new_comment_text_area').val(),
															disposition: $('.selected_disposition').attr('for')})
				post_comment.done(function(result){
					$overlay.remove();
					alert(result)
					studentClick(student);
				})
			});

		})
		$content.append("<div id='close-button'><button id='close-window'>Close</button></div>")
	}
	console.log(student.children('input').val())
	
	$("#close-window").click(function(){
		$overlay.remove();
	});

	$("#save-new-student").click(function(){
		name = $('#new-stud-name').val()
		sex = $('input[type="radio"]:checked').val()
		teacher_id = $("#teacher_id").val()
		if (!sex ){
			alert("please select a sex")
			return
		}

		if (name == ""){
			alert("please name the student")
			return
		}

		new_student = $.post("/students", {name: name,
																			sex: sex,
																			teacher_id: teacher_id})

		new_student.done(function(result){
			alert("and we're back with: "+ result)
			student.children('input').val(result)
			student.removeClass('unset')
			updateStudents()
			$overlay.remove()
		})
	})

	$overlay.fadeIn(700)
}
	

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

	$("#highlight-unset").mouseenter(function(){
		console.log("mouseover")
		$(".unset").addClass("glow");
	})

	$("#highlight-unset").mouseleave(function(){
		console.log("mouseover")
		$(".unset").removeClass("glow");
	})
});
