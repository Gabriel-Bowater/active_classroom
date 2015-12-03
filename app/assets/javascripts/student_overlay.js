
function studentClick(student){
	$('#overlay').remove()
	var $overlay = $('<div id="overlay"></div>');
	var $div = $('<div id="overlay-window"><img id="loader-gif" src="/images/ajax-loader.gif"></div>');
	var $content = $('<p></p>');
	$overlay.append($div);
	$div.append($content);
	$('body').append($overlay);
	if(student.hasClass("unset")){
		$("#loader-gif").remove();
		$div.prepend("<h3>Create new student.</h3>")
		$content.append("<br><label>Personal Name: </label><input type='text' id='new-stud-per-name'> <br><label>Family Name: </label><input type='text' id='new-stud-fam-name'></br>")
		$content.append('<form><input type="radio" name="sex" value="male">Male<br><input type="radio" name="sex" value="female">Female</form>')
		$content.append("<p><button id='save-new-student'>Save</button>  |  <button id='close-window'>Close</button></p>")
		getTeacherStudents(student)
	} else {
		stud_id = student.children('input').val();
		getStudentInfo(stud_id, student);
		$content.append("<div id='close-button'><button id='close-window'>Close</button></div>")
	}
	console.log(student.children('input').val())
	
	$("#close-window").click(function(){
		$overlay.remove();
	});

	$("#save-new-student").click(function(){

		if(!(/^[a-z'-]+$/i.test($("#new-stud-per-name").val()))){
			alert("Only alphabetic characters, hyphens and apostrophes are allowed in student names.")
			return
		}

		if (!($("#new-stud-fam-name").val()==""))	{
			if(!(/^[a-z'-]+$/i.test($("#new-stud-fam-name").val()))){
				alert("Only alphabetic characters, hyphens and apostrophes are allowed in student names.")
				return
			}
		}

		name = $('#new-stud-per-name').val() + " " + $('#new-stud-fam-name').val()
		sex = $('input[type="radio"]:checked').val()
		teacher_id = $("#teacher_id").val()
		if (!sex ){
			alert("please select a sex")
			return
		}

		if (name == ""){
			alert("please name the student. Family name can be left blank, but a personal name is required.")
			return
		}
		new_student = $.post("/students", {name: name,
																			sex: sex,
																			teacher_id: teacher_id})

		new_student.done(function(result){

			student.children('input').val(result)
			student.removeClass('unset')
			if (sex == "male"){
				student.children('img').attr('src', '/images/male.png')
			} else{
				student.children('img').attr('src', '/images/female.png')
			}
			updateStudents()
			$(student).append("<p class='student-name'>"+name+"</p>")
			$(".student-name").slideUp();
			$overlay.remove()
		})
	})

	$overlay.fadeIn(700)
} //End of student click function

function tagsDropdown(user_tags){
	html_chunk = '<ul class="navbar-nav" id="tags-dropdown"><li class="dropdown"><button href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Tag Comment<span class="caret"></button>'
	html_chunk+='<ul class="dropdown-menu">'
	for (var i = 0; i < user_tags.length; i++) {
		html_chunk += '<li><a id="tag_'+user_tags[i]+'" class="dropdown-tag" href="#">'+user_tags[i]+'</a></li>'
	};

	if (user_tags.length==0){
		html_chunk += '<li><a id="tag_absent" class="dropdown-tag" href="#">Add tags on your profile page.</a></li>'
	}

	html_chunk+=' </ul> </li> </ul>'
	return html_chunk
}

function getTeacherStudents(student){
	var current_students = []

	$.each($(".student"),function(){
		if ($(this).children('input').val() != "unset"){
			db_id = parseInt($(this).children('input').val())
			current_students.push(db_id)
		}
	})

	students = $.get("/students/existing_stds/1")
	students.done(function(result){
		var available_students = []
		$.each(result.array, function(){
			if ($.inArray(this[0], current_students ) == -1){
				available_students.push(this)
			}
		});
		student_dropdown = '<ul class="navbar-nav" id="student-dropdown"><li class="dropdown"><button href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Existing Student<span class="caret"></button>'
		student_dropdown +='<ul class="dropdown-menu">'
		for (var i = 0; i < available_students.length; i++) {
			student_dropdown += '<li><a id="student_drpdwn_'+available_students[i][2] + available_students[i][0]+ '" class="dropdown-student" href="#">'+available_students[i][1]+'</a></li>'
		};
		if (available_students.length == 0){
			student_dropdown += '<li><a id="tag_absent" class="dropdown-student-none" href="#">Any existing students not already in this class can be added from here.</a></li>'
		}
		student_dropdown += ' </ul> </li> </ul>'

		$("#overlay").append(student_dropdown)
		$(".dropdown-student").click(function(e){
			e.preventDefault()
			id = parseInt($(this).attr('id').slice(16))
			console.log(id)
			student.children('input').val(id)
			student.removeClass('unset')
			if ($(this).attr('id')[15] == "m"){
				student.children('img').attr('src', '/images/male.png')
			} else{
				student.children('img').attr('src', '/images/female.png')
			}
			updateStudents()
			studentClick(student)
		});
	});
}


function getStudentInfo(id, student){
	// var student = $("#student_"+id)
	student_info = $.get('/students/info/'+ id)
	student_info.done(function(result){
		student_html = studentHtml(result)
		$("#loader-gif").remove();
		$("#overlay-window").prepend(student_html);
		$('#comment_dispostion input:radio').addClass('input_hidden');
		$('#comment_dispostion label').click(function() {
  		$(this).addClass('selected_disposition').siblings().removeClass('selected_disposition');
		});

		$('#new_comment_submit').click(function(){
			var applied_tags = $(".applied-tag")
			var tags_csv = ","
			for (var i = 0; i < applied_tags.length; i++) {
				tags_csv += $($(".applied-tag")[i]).text()+","
			};

			console.log(student) // wrong window repoping after done

			post_comment = $.post('/comments',
														{teacher_id: $("#teacher_id").val(),
														student_id: stud_id,
														title: $('#new_comment_title').val(),
														content: $('#new_comment_text_area').val(),
														disposition: $('.selected_disposition').attr('for'),
														tags_csv: tags_csv})
			post_comment.done(function(result){
				$("#overlay").remove();
				studentClick(student);
			})
		});

		$(".dropdown-tag").click(function(){
			event.preventDefault()
		})

		for (var i = 0; i < tags.length; i++) {
			
			$("#tag_"+tags[i]).click(function(){
				tag_id = $(this).attr("id")+ "_widget"
				tag_block = "<p class='applied-tag' id='" + tag_id + "''><img class='remove-tag' src='/images/x_icon.png'>"+$(this).attr("id").slice(4)+"</p>"
				$("#applied_tags").append(tag_block)

				$(".remove-tag").click(function(){
					$(this).parent().remove()
				})
			})
		};

		$(".student_profile_link").click(function(){
			id = $(this).attr('id').slice(9)
			window.location.href = "/students/"+id
		})

	})
}

function studentHtml(result){
	console.log("comments length: " + result.comments.length)
	var student_html = "<h3> Student Record</h3><br>"
	student_html+="<div id='student_details'><p> name: " + result.name + "</p><br>"
	student_html+="<p> Sex: " +  result.sex + "</p><br></div>"
	student_html+="<div id='student_comments'><h4>Comments</h4>"
	for (var i = 0; i < result.comments.length; i++) {
		student_html+='<p style="font-weight:bold;margin-bottom:-7px">Title: '+result.comments[i].title 
		if (result.comments[i].disposition) {
		student_html+='<img class="mini-disposition"src="/images/'+result.comments[i].disposition+'.png">'
		}
		student_html+='</p>'
		student_html+='<p id="comment-content">'+result.comments[i].content+'</p>'
	};
	student_html+="</div>"
	student_html+= "<button class='student_profile_link' id='std_prof_"+result.id+"'>View full profile</button>"
	student_html+="<div id='student_comment_form'>"
	student_html+="<label>Title(optional): </label><input type='text' id='new_comment_title' name='new_comment_title'><br>"
	student_html+="<textarea id='new_comment_text_area' name='new_comment_content'></textarea><br>"
	student_html+='<div id="comment_dispostion"><input type="radio" name="disposition" id="angry" value="angry" /><label for="angry"><img src="/images/angry.png" alt="angry face" /></label>'
	student_html+='<input type="radio" name="disposition" id="neutral" value="neutral" /><label for="neutral"><img src="/images/neutral.png" alt="neutral face" /></label>'
	student_html+='<input type="radio" name="disposition" id="happy" value="happy" /><label for="happy"><img src="/images/happy.png" alt="happy face" /></label>'
	student_html+='</div>'
	student_html+='<div id="applied_tags"></div>'
	student_html+= tagsDropdown(tags)
	student_html+="<button id='new_comment_submit'>Save</button>"
	student_html+="</div>"
	return student_html
}