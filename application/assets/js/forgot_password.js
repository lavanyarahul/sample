$(document).ready(function(){
    jQuery.validator.addMethod("notEqualTo", function(value, element, param) {
        return this.optional(element) || value != param;
    }, "Please specify a different (non-default) value");

     jQuery.validator.addMethod("noSpace", function(value, element) {
    return value == '' || value.trim().length != 0;
  }, "Blank spaces at beginning is invalid");

    $("#forgot_password").validate({
        rules: {
            email: {
                required:true,
                remote: {
                    url  :  base_url+'forgot_Password/forgot_passwd',
                    type : "POST",
                }
            } ,

        },
        messages: {
            email: {
                remote: "Email not registered",
            },

            action: "Please provide some data"
        },

        submitHandler:function(data)
        {
            send_email();
        }

    });

    /*validate otp*/

  /*  $("#otp_verify").validate({
        rules: {
            otp: {
                required:true,
                remote: {
                    url  :  base_url+'Forgot_Password/otp_verify',
                    type : "POST",
                    complete: function(data){
                       // console.log(data)
                        if( data.responseText == 'true' ) {
                            document.getElementById("email_show").style.display = "none";
                                        document.getElementById("change").style.display = "block";
                                        document.getElementById("otpFooter").style.display = "flex";

                                    }
                                    else
                                    {
                                   document.getElementById("change").style.display = "none" ;
                                    document.getElementById("email_show").style.display = "block";
                                        document.getElementById("otpFooter").style.display = "none";

                        }

                    }
                }
            } ,
            new_password :{
                required:true,
                notEqualTo: '#old_password'
            },
            confirm_password :{
                required:true,
                equalTo: '#new_password',
                notEqualTo: '#old_password',
            }

        },
        messages: {
            otp: {
                remote: "Please enter a valid otp",
            },
            new_password: {
                notEqualTo: "Password cannot be same as old password",
            },
            confirm_password: {
                equalTo: "Password not matched",
                notEqualTo: "Password cannot be same as old password",
            },

            action: "Please provide some data"
        },

        submitHandler:function(data)
        {
            change_password();
        }

    });


*/

function send_email()
{

    var adddata = new FormData(document.getElementById("forgot_password"));
      $.ajax({
          type : "POST",
          url  : base_url+'Forgot_Password/send_email',
          dataType : "JSON",
          data : adddata,
          async: false,
          processData: false,
          contentType: false,
          success: function(data){

            console.log(data);
                   alert('Request successfully sent to your email!');
          },
          error: function(data) {
              //Your Error Message
              console.log(data)
              alert('Something went wrong: Contact Support');

          }
      });
}
 $("#changePassword").validate({
        rules: {

            new_password :{
              required:true,
              noSpace: true,

            },
            confirm_password :{
              required:true,
              equalTo: '#new_password',

            },
        },
        messages: {

            confirm_password: {
                equalTo: "Password not matched",

            },
            action: "Please provide some data"
        },

        submitHandler:function(form)
        {

          change_password();
        }

    });

   function change_password()
   {

            var user_password = $('#new_password').val();
             var user_id = $('#user_id').val();

            $.ajax({
                type : "POST",
                url  : base_url+'forgot_Password/change_password',
                dataType : "JSON",
                data : {new_password:user_password,user_id:user_id},
                success: function(data){
                  console.log(data);
                    $('[name="new_password"]').val("");
                    $('[name="confirm_password"]').val("");

                    $("#new_password").trigger('reset');
                document.getElementById('sucessMessage').style.display="block";

                 },
                 error:function(data){
                    alert("error")
                                 console.log(data);
              }
            });
            return false;
        }

});

