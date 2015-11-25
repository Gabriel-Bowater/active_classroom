$( document ).ready(function() {

	setActive()

	$('#log-in-button').click(function(){
		logIn()
	})

	$("#password").keyup(function (e) {
    if (e.keyCode === 13) {
      logIn()
    }
  });

	$("#create-account").click(function(){
		createAccount()
	});

	$(".su-dd").keyup(function (e) {
    if (e.keyCode === 13) {
      createAccount()
    }
  });

});

function setActive(){
	page = $("#page_id").val();
	console.log(page)
	$(".nav-link").removeClass("active")
	$("#"+page+"-tab").addClass("active")
}

function createAccount(){
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
}

function logIn(){
	user_id = $("#user_id").val();
	password = $("#password").val();

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
}