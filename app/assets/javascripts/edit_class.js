$( document ).ready(function() {
	if($("#page_id").val()=="edit_class"){

		$(".tbl").click(function(){
			$(".tbl").removeClass("selected")
			$(this).addClass("selected")
		});

		$("#table_adder").click(function(){
			$(".tbl").click(function(){
				$(".tbl").removeClass("selected")
				$(this).addClass("selected")
			});
		});

		$("#selected_table_remover").click(function(){
			$(".selected").remove();
		});

		$("#rotate_selected_desk").click(function(){
			rotate($(".selected"));
		});

	}

	$("#edit_classroom_save").click(function(){
		var tables = "";
		var students = "";
		$('.tbl').removeClass("selected")
		//table csv format - id(CSS), size, orientation, left, top, z-index
		$('.tbl').each(function(index) {
			var table_classes = $( this ).attr('class').split(" ")
			var orientation = 'horiz'
			if ($(this).hasClass("vert")){
				orientation = 'vert'
			}
			tables += ($(this).attr("id") + "," + table_classes[1] + "," + orientation + "," + $(this).css("left") + "," + $(this).css("top") + "," + $(this).css("z-index") + "," )
		})
		//student csv format - id(CSS), id(DB), left, top, z-index 
		$('.student').each(function(index) {
			students += ($(this).attr("id") + "," + $( "#" + $(this).attr("id") + "db_id").val() + "," + $(this).css("left") + "," + $(this).css("top") + "," + $(this).css("z-index") + ",")
		})		

		saving = $.ajax({
					url: "/classrooms/"+$("#classroom_id").val(),
					type: "PATCH",
					data: {students: students,
								tables:tables}
					});

	  saving.done(function(result){
	  	console.log("result: "+ result)
	  	window.location.replace("/classrooms/"+$("#classroom_id").val())
	  })
	})
})