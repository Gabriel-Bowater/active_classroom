var desk_size_small = false
var desk_size_large = false

function rotate(to_rotate){
	console.log(to_rotate)
  if ($(to_rotate).hasClass('horiz')){
  	$(to_rotate).removeClass('horiz')
  	$(to_rotate).addClass('vert')
  	$(to_rotate).css("transform", "rotate(90deg)")
  } else {
  	$(to_rotate).removeClass('vert')
  	$(to_rotate).addClass('horiz')
  	$(to_rotate).css("transform", "rotate(0deg)")
  }
}

function add_table(){
	var offset = 150
  var extra_styling = "";
  var size = "md"
  var highest_index= 0;

  $(".tbl").each(function(){
  	var index = parseInt($( this ).attr("id").slice(6))
  	if (index > highest_index){
  		highest_index = index
  	}
  })

  var n = highest_index + 1;
  if (desk_size_small) {
      extra_styling = ";width:100px;height:50px"
      // offset = 75
      size = "sm"
  }
  if (desk_size_large) {
      extra_styling = ";width:350px;height:175px"
      offset = 225
      size = "lg"
  }
  var table = '<div id="table_' + n + '"class="tbl ' + size + ' horiz" style="display:absolute;float:right;z-index:' + n + ';margin-top:-' + offset + 'px' + extra_styling + '">';
  table += '<img class="img_tbl" src="/images/table.png" />';
  table += '</div>';

  append_draggable(table, '.tbl', "table_" + n )
}

function add_student(){
	var offset = 100
  var extra_styling = "";
	var highest_index = 0;
  $(".student").each(function(){
  	var index = parseInt($( this ).attr("id").slice(8))
  	if (index > highest_index){
  		highest_index = index
  	}
  })

  var n = highest_index + 1;

  var student = '<div id="student_' + n + '"class="student" style="display:absolute;float:left;z-index:' + (n+100) + ';margin-top:-' + offset + 'px">';
  student += '<img class="img_student" src="/images/unknown_student.png" />';
  student += '<input type="hidden" id="student_' + n +'db_id" value="unset">' 
  student += '</div>';
  append_draggable(student, '.student', "student_" + n)
	if($("#page_id").val()=="edit_class"){
		$(".student").click(function(){
			console.log("mouseenter")
			$(".popup").remove()
			$(this).append("<div class='popup'><p>save changes to edit student details</p></div>")
			$(".popup").delay(3000).fadeOut();
		});
	}
}

function append_draggable(html, obj_class, save_id) {
  $('#classroom').append(html)

  $(obj_class).draggable({
    appendTo: '#'+save_id,
    start: function (event, ui) {
      isDraggingMedia = true;
    },
    stop: function (event, ui) {
    	$( this).css("opacity", "1");
    },
    drag: function (event, ui) {
      $("#x_" + $( this ).attr('id')).val(ui.position.left);
      $("#y_" + $( this ).attr('id')).val(ui.position.top);
      $( this ).css("opacity", "0.6");
    },
    containment: $("#classroom-containment")

  });
}

$( document ).ready(function() {

	$('#table_remover').click(function () {
	  var n = $(".tbl").length;
	  var to_go = '#table_' + n;
	  var to_go_from_tracker = '#positions_tracker_table_'+ n
	  $(to_go).remove();
	  $(to_go_from_tracker).remove();
	});

	$('#student_remover').click(function () {
	  var n = $(".student").length;
	  var to_go = '#student_' + n;
	  var to_go_from_tracker = '#positions_tracker_student_'+ n
	  $(to_go).remove();
	  $(to_go_from_tracker).remove();
	});

	$('#set_small').click(function () {
	  desk_size_small = true
	  desk_size_large = false
	  $(this).css("color", "red")
	  $("#set_medium").css("color", "black")
	  $("#set_large").css("color", "black")

	});

	$('#set_medium').click(function () {
	  desk_size_small = false
	  desk_size_large = false
	  $(this).css("color", "red")
	  $("#set_small").css("color", "black")
	  $("#set_large").css("color", "black")
	});

	$('#set_large').click(function () {
	  desk_size_small = false
	  desk_size_large = true
	  $(this).css("color", "red")
	  $("#set_medium").css("color", "black")
	  $("#set_small").css("color", "black")
	});

	$('#table_adder').click(function () {
		add_table()
	});

	$("#table_adder_mini").click(function(){
		add_table()
	})

	$('#student_adder').click(function () {
		add_student()
	});

	$('#student_adder_mini').click(function () {
		add_student()
	});

	$('#output_positions').click( function(){
		var tables = "";
		var students = "";
		var class_name = $('input[name=class_name').val()
		//table csv format - id(CSS), size, orientation, left, top, z-index
		$('.tbl').each(function(index) {
			var table_classes = $( this ).attr('class').split(" ")
			var orientation = 'horiz'
		
			if ($.inArray('vert', table_classes) > -1){
				orientation = 'vert'
			}
			tables += ($(this).attr("id") + "," + table_classes[1] + "," + orientation + "," + $(this).css("left") + "," + $(this).css("top") + "," + $(this).css("z-index") + "," )
		})
		//student csv format - id(CSS), id(DB), left, top, z-index 
		$('.student').each(function(index) {
			students += ($(this).attr("id") + "," + $( "#" + $(this).attr("id") + "db_id").val() + "," + $(this).css("left") + "," + $(this).css("top") + "," + $(this).css("z-index") + ",")
		})		
		var response_num
	  saving = $.post("/classrooms", {tables: tables, 
	  																students: students, 
	  																teacher_id: $('input[name=user_id').val(),
	  																class_name: $('input[name=class_name').val()},
	  																function( data ){
	  																	response_num = data.responseText
	  																	console.log(data.responseText)
	  																})
	  saving.done(function(result){
	  	console.log("result: "+ result)
	  	response_num = result
	  	window.location.replace("/classrooms/"+result)
	  })
	});

	$('#hide_menu').click( function(){
	  $('#menu').fadeOut();
	  $('.mini_menu_item').fadeIn();
	});

	$('#show_menu').click( function(){
	  $( '.mini_menu_item' ).fadeOut();
	  $('#menu').fadeIn();
	});

	$('#rotate_last_desk').click( function(){
	  var n = $(".tbl").length;
	  var to_rotate = '#table_' + n;
	  rotate(to_rotate);
	});

	$('#delete_classroom').click(function(){
		html_block = "<div style='display:none' id='delete_confirm'><p style='font-size: 0.7em'>Are you sure you want to delete this classroom? It will not be recoverable. Students will not be deleted and can be added to other classes. To delete a student, go to their profile page.</p>"
		html_block+= "<p> <a id='confirm_delete' href='/delete-class/" + $('#classroom_id').val() + "'>Yes</a> | <a id='cancel_delete' href='#'>No</a></p></div>"
		$(this).parent().append(html_block)
		$("#delete_confirm").slideDown();

		$('#cancel_delete').click(function(event){
			event.preventDefault();
			$('#delete_confirm').remove();
		})
	})
  
});
