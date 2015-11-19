$( document ).ready(function() {

	var desk_size_small = false
	var desk_size_large = false


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
	  var offset = 150
	  var extra_styling = "";
	  var n = $(".tbl").length + 1;
	  var size = "md"
	  if (desk_size_small) {
	      extra_styling = ";width:150px;height:75px"
	      // offset = 75
	      size = "sm"
	  }
	  if (desk_size_large) {
	      extra_styling = ";width:450px;height:225px"
	      offset = 225
	      size - "lg"
	  }
	  var table = '<div id="table_' + n + '"class="tbl ' + size + ' horiz" style="display:absolute;float:right;z-index:' + n + ';margin-top:-' + offset + 'px' + extra_styling + '">';
	  table += '<img class="img_tbl" src="/images/table.png" />';
	  table += '</div>';

	  append_draggable(table, '.tbl', "table_" + n )
	    
	});

	$('#student_adder').click(function () {
	  var offset = 100
	  var extra_styling = "";
	  var n = $(".student").length + 1;
	  var student = '<div id="student_' + n + '"class="student" style="display:absolute;float:left;z-index:' + (n+100) + ';margin-top:-' + offset + 'px">';
	  student += '<img class="img_student" src="http://www.wpclipart.com/office/people/business_people_icons/business_person_T.png" />';
	  student += '</div>';
	  append_draggable(student, '.student', "student_" + n)
	    
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
		//student csv format - id(CSS), id(DB), left, top 
		$('.student').each(function(index) {
			// students += ("Student " + index + ": left - " + $(this).css("left") + ", top- " + $(this).css("top")  + ", id value " + $(this).attr("id") + "\n")
			students += ($(this).attr("id") + "," +  " DB_ID " + "," + $(this).css("left") + "," + $(this).css("top") + "," + $(this).css("z-index") + ",")
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
	  $('#menu').slideUp();
	  $('#show_menu').fadeIn();
	});

	$('#show_menu').click( function(){
	  $('#menu').slideDown();
	  $( this ).fadeOut();
	});

	$('#rotate_last_desk').click( function(){
	  var n = $(".tbl").length;
	  var to_rotate = '#table_' + n;
	  var new_height = $( to_rotate ).css("width")
	  var new_width = $( to_rotate ).css("height")
	  $( to_rotate ).css("height", new_height)
	  $( to_rotate ).css("width", new_width)
	  var classes = $( to_rotate).attr('class').split(" ")
	  if ($.inArray('horiz', classes) > -1){
	  	$(to_rotate).removeClass('horiz')
	  	$(to_rotate).addClass('vert')
	  } else {
	  	$(to_rotate).removeClass('vert')
	  	$(to_rotate).addClass('horiz')
	  }

	});


	function append_draggable(html, obj_class, save_id) {
	  $('#classroom').append(html)
	  tracking_info = '<tr id="positions_tracker_'+ save_id +'"><td>'+ save_id + '</td> <td>drag x:</td><td><input type="text" id="x_' + save_id + '" class="console" value="0"/></td><td>drag y:</td><td><input type="text" id="y_' + save_id + '" class="console" value="0"/></td></tr>'
	  $('#tracker_console').append(tracking_info)

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
	    containment: "parent"

	  });
	}
  console.log( "ready!" );
});

        //'<tr id="positions_tracker'+ save_id +'"> <td>drag x:</td><td><input type="text" id="x' + save_id + '" class="console" /></td><td>drag y:</td><td><input type="text" id="y' + save_id + '" class="console" /></td></tr>''