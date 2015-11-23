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
		})
	}
})