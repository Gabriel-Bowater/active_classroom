$( document ).ready(function() {



	$('#log-in-button').click(function(){
		user_id = $("#user_id").val();
		password = $("#password").val();
		alert(user_id+ " "+ password)

		login = $.post("/sessions",{id: user_id, 
																password: password},
																function( data ){
																console.log(data.responseText)
															})
	  login.done(function(result){
	  	console.log("result: "+ result)
	  	response_num = result
	  	location.reload()
	  })
	})

	$("#create-account").click(function(){
		password = $("#new-password").val();
		password_confirm = $("#new-password-confirm").val();
		username = $("#new-username").val();
		email = $("#new-email").val();

		if (password != password_confirm){
			alert("Passwords don't match!")
			return
		}

		create = $.post("/users", {username: username,
															password: password,
															email: email},
															function( data ){
															console.log(data)
															})

		create.done(function(){
			location.reload()
		})

	})

});