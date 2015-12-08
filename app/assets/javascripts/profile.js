var tags;
var comments;
var saved_teacher_tags_html;

function addTag(){
	$('#overlay').remove()
	var $overlay = $('<div id="overlay" style="height:200px"></div>');
	var $div = $('<div id="overlay-window"></div>');
	var $content = $('<p></p>');
	$overlay.append($div);
	$div.append($content);
	$('body').append($overlay);

	$div.prepend("<h3>Create new tag.</h3>")
	$div.append("<p style='font-size:.8em'>A tag could be a subject, a test, or a disposition of a comment. Tags can only contain alphanumeric characters, hyphens, and apostrophes (no spaces)</p>")
	$content.append("<br><label>Tag: </label><input type='text' id='new-tag-content'> <br>")
	$div.append("<button id='save-tag'>Save Tag</button>  <button id='close-window'>Close</button>")	
	$("#close-window").click(function(){
		$overlay.remove();
	});
	$("#save-tag").click(function(){
		saveTag();
	})
	$("#new-tag-content").keydown(function(event){
		if(event.keyCode=="13"){
			saveTag()
		}
	})
	$overlay.fadeIn(700)
}

function saveTag(){
	content = $("#new-tag-content").val().trim();
	if (!(content==""))	{
		if(!(/^[a-z'-]+$/i.test(content))) {
			alert("Only alphabetic characters, hyphens and apostrophes are allowed in tags.")
			return
		} 
	}else {
		alert("empty field")
		return
	}

	saving = $.ajax({
  					url: "/users/"+$("#user_id").val(),
  					type: "PATCH",
  					data: {tag: content}
  					});
	saving.success(function(result){
  	setTags(result.tags);
  	refreshTags();
  	$("#overlay").remove();
  })
	saving.failure(function(result){
		alert("Something went wrong.")
	})
}

function setTags(user_tags){
	tags = user_tags;
}

function setComments(user_comments){
	comments = user_comments;
	console.log(comments)
}

function refreshTags(){
	console.log(tags)
	$(".single-tag").remove()
	for (var i = 0; i < tags.length; i++) {
		$("#tags-div p").append("<a class='single-tag' id='tag_"+tags[i]+"' href='#'>  "+tags[i]+"  </a>")
	};
	if ($("#page_id").val() == "profile"){
		$(".single-tag").click(function(event){
			event.preventDefault()
			findTagComments($(this).text().trim())
		})
	} else if ( $("#page_id").val() == "profile_student"){
		$(".single-tag").click(function(event){
			event.preventDefault()
			findTagCommentsStudentProfile($(this).text().trim())
		})
	}
	$(".single-tag").fadeIn(700)
}

function findTagComments(tag){
	var tag_comments =[]
	for (var i = 0; i < comments.length; i++) {
		if (comments[i].tags_csv){
			console.log(comments[i].tags_csv)
			if (comments[i].tags_csv.includes(","+tag+",")){
				tag_comments.push(comments[i])
				console.log(comments[i])
			}
		}
	};
	tag_comments_html = "<div id='tag-comments'><h3>Comments tagged " + tag +"</h3>"
	for (var i = 0; i < tag_comments.length; i++) {
		var student_name = $("#stud_"+tag_comments[i].student_id+" p").text()
		var title = tag_comments[i].title
		var content = tag_comments[i].content
		var disposition = tag_comments[i].disposition
		tag_comments_html += "<p>comment for "+student_name+". Title:<u>" + title + "</u>" 
		if (disposition){
			tag_comments_html +="<img class='mini-disposition' src='/images/"+disposition+".png'>"
		}
		tag_comments_html += "</p><p>"+content+"</p><br>"
	}
	tag_comments_html += "<button id='tags-back'>Go Back</button>"
	tag_comments_html += "</div>"
	saved_teacher_tags_html = document.getElementById("teacher-tags");
	$("#teacher-tags").remove()
	$("#classrooms-list").after(tag_comments_html)
	$("#tags-back").click(function(){
		$("#tag-comments").remove();
		$("#classrooms-list").after(saved_teacher_tags_html)
		$("#add_tag").click(function(){
			addTag();
		})
		refreshTags();
	})
	console.log(saved_teacher_tags_html)
}


function findTagCommentsStudentProfile(tag){
	var tag_comments =[]
	for (var i = 0; i < comments.length; i++) {
		if (comments[i].tags_csv){
			console.log(comments[i].tags_csv)
			if (comments[i].tags_csv.includes(","+tag+",")){
				tag_comments.push(comments[i])
				console.log(comments[i])
			}
		}
	};
	tag_comments_html = "<div id='student_profile_comments'><h4 class='student-profile-header'>Comments tagged " + tag +" for " + $("#stud_name").text() +"</h4>"
	for (var i = 0; i < tag_comments.length; i++) {
		var student_name = $("#stud_"+tag_comments[i].student_id+" p").text()
		var title = tag_comments[i].title
		var content = tag_comments[i].content
		var disposition = tag_comments[i].disposition
		tag_comments_html += "<p>comment for "+student_name+". Title:<u>" + title + "</u>" 
		if (disposition){
			tag_comments_html +="<img class='mini-disposition' src='/images/"+disposition+".png'>"
		}
		tag_comments_html += "</p><p>"+content+"</p><br>"
	}
	tag_comments_html += "<button id='tags-back' class='stud-back-butt'>Go Back</button>"
	tag_comments_html += "</div>"

	saved_student_comments_html = document.getElementById("student_profile_comments");
	$("#student_profile_comments").remove()
	$("#student-profile-head").after(tag_comments_html)
	$(".single-tag").css("color", "grey").off().click(function(e){ e.preventDefault()});
	$(".comment-disp-filter").off().addClass("greyed-out").click(function(e){ e.preventDefault()});
	$("#tags-back").click(function(){
		$("#student_profile_comments").remove();
		$("#student-profile-head").after(saved_student_comments_html)
		refreshTags();
		$(".comment-disp-filter").removeClass("greyed-out")
		$(".comment-disp-filter").click(function(e){
			e.preventDefault();
			studentCommentsByDisp($(this).attr("id").slice(5))
		})
	})
}

function studentCommentsByDisp(disp){
	var disp_comments = []
	for (var i = 0; i < comments.length; i++) {
		if (comments[i].disposition == disp){
			disp_comments.push(comments[i])
		} 
	};

	disp_comments_html = "<div id='student_profile_comments'><h4 class='student-profile-header'><img src='/images/"+disp+".png' class='mini-disposition'> Comments for " + $("#stud_name").text() +"</h4>"

	for (var i = 0; i < disp_comments.length; i++) {
		title = disp_comments[i].title
		content = disp_comments[i].content
		disp_comments_html += "<p><u>"+title+"</u></p>"
		disp_comments_html += "<p>"+content+"</p>"
	};
	disp_comments_html += "<button id='tags-back' class='stud-back-butt'>Go Back</button>"
	disp_comments_html += "</div>"
	saved_student_comments_html = document.getElementById("student_profile_comments");
	$("#student_profile_comments").remove()
	$("#student-profile-head").after(disp_comments_html)
	$(".single-tag").css("color", "grey").off().click(function(e){ e.preventDefault()});
	$(".comment-disp-filter").off().addClass("greyed-out").click(function(e){ e.preventDefault()});
	$("#tags-back").click(function(){
		$("#student_profile_comments").remove();
		$("#student-profile-head").after(saved_student_comments_html)
		refreshTags();
		$(".comment-disp-filter").removeClass("greyed-out")
		$(".comment-disp-filter").click(function(e){
			e.preventDefault();
			studentCommentsByDisp($(this).attr("id").slice(5))
		})
	})

}

$( document ).ready(function() {
	$("#add_tag").click(function(){
		addTag();
	})

	$(".comment-disp-filter").click(function(e){
		e.preventDefault();
		studentCommentsByDisp($(this).attr("id").slice(5))
	})

	if ($("#page_id").val() == "profile" || $("#page_id").val() == "profile_student"){
		refreshTags()
	}
});