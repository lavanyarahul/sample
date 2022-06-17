$(document).ready(function() {
 
    $("#login_form").validate({

        rules:
        {
            email: {
                required: true,
            },
            password: {
                required: true,
                minlength: 4,
                maxlength: 15
            }
        },
        submitHandler: submitForm
    });



    function submitForm()
    {
        //var data = $("#basicForm").serialize();
        var adddata = new FormData(document.getElementById("login_form"));
        $.ajax({
            method :'POST',
            url  : base_url+'login/login',
            data : adddata,
            dataType : 'json',
            async: false,       
            processData: false,
            contentType: false,   
            headers: {
                "auth-key":"simplerestapi",
                'client-service' : "frontend-client",
                // more as you need
            },
            beforeSend: function()
            {
                NProgress.start();
                $("#error").fadeOut();
                $("#btn_login").html(' <img src="'+base_url+'application/assets/images/loader1.gif" /> &nbsp; Sending ...');
            },
            success :  function (data)
            {   
                console.log(data);
                if(data.status===200){

                    window.localStorage.setItem('user_id', data.id);
                    window.localStorage.setItem('token', data.token);
                    window.localStorage.setItem('branch_id', data.branch_id);
                    window.localStorage.setItem('dept_id', data.dept_id);
                    window.localStorage.setItem('user_name', data.user_name);
                    window.localStorage.setItem('email', data.email);
 
                    toastr.options = {
                        positionClass: 'toast-top-right'
                    };
                    toastr.success('Success!');
                    NProgress.done();

                    $("#btn-submit").html('<img src="'+base_url+'public/assets/img/loader1.gif" /> &nbsp; Signing in ...');
                     // setTimeout('$(".sign-form").fadeOut(500, function(){ window.location = "'+base_url+'admin/dashboard" }); ',2000);
                      window.location = data.url;    

                }
                else 
                    {
                    $("#error").fadeIn(1000, function(){
                        $("#error").html('<div class="alert alert-danger"> &nbsp; Sorry wrong credentials!</div>');

                        $("#btn-submit").html(' &nbsp; Try Again');
                        $("#basicForm").trigger('reset');
                    });


                }

            },
            error :  function (data){
                console.log(data) 
            }
        });
        return false;
    }




});
// end document ready
   