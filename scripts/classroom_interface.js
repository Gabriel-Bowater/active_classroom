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
  if (desk_size_small) {
      extra_styling = ";width:150px;height:75px"
      offset = 75
  }
  if (desk_size_large) {
      extra_styling = ";width:450px;height:225px"
      offset = 225
  }
  var table = '<div id="table_' + n + '"class="tbl" style="display:absolute;z-index:' + n + ';margin-top:-' + offset + 'px' + extra_styling + '">';
  table += '<img class="img_tbl" style="border:1px solid black" src="http://cdn.playbuzz.com/cdn/75870e24-e1bc-4bcc-98c2-72c8e98ed194/358c150d-d33e-43b1-8bd5-dbae22014e8f.jpg" />';
  table += '</div>';

  append_draggable(table, '.tbl', "table_" + n )
    
});

$('#student_adder').click(function () {
  var offset = 100
  var extra_styling = "";
  var n = $(".student").length + 1;
  var student = '<div id="student_' + n + '"class="student" style="display:absolute;z-index:' + (n+100) + ';margin-top:-' + offset + 'px">';
  student += '<img class="img_student" style="border:1px solid black" src="http://www.wpclipart.com/office/people/business_people_icons/business_person_T.png" />';
  student += '</div>';
  append_draggable(student, '.student', "student_" + n)
    
});

$('#output_positions').click( function(){

});

function append_draggable(html, obj_class, save_id) {
  $('#classroom').append(html)
  tracking_info = '<tr id="positions_tracker_'+ save_id +'"> <td>drag x:</td><td><input type="text" id="x_' + save_id + '" class="console" value="0"/></td><td>drag y:</td><td><input type="text" id="y_' + save_id + '" class="console" value="0"/></td></tr>'
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


        //'<tr id="positions_tracker'+ save_id +'"> <td>drag x:</td><td><input type="text" id="x' + save_id + '" class="console" /></td><td>drag y:</td><td><input type="text" id="y' + save_id + '" class="console" /></td></tr>''