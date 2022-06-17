
$(document).ready(function(){   
    jQuery.validator.addMethod("notEqualTo", function(value, element, param) {
        return this.optional(element) || value != param;
    }, "Please specify a different (non-default) value"); 


    jQuery.validator.addMethod("noSpace", function(value, element) { 
        return value == '' || value.trim().length != 0;
    }, "Blank spaces at beginning is invalid");

    $("#changePassword").validate({
        rules: { 
            old_password: {
                required:true,

                remote: {
                    url : api_base_url+'admin/profile/check_password',
                    type : "POST",
                    data:{old_password:function(){return $('input[name=old_password]').val();},},
 
                },
               
            } ,   
            new_password :{
                required:true,
                noSpace: true,
                notEqualTo: '#old_password'
            },     
            confirm_password :{
                required:true,
                equalTo: '#new_password',
                notEqualTo: '#old_password',    
            },
        }, 
        messages: { 
            old_password: {
                remote: "Password not matched",      
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

        submitHandler:function(form)
        {

            change_password();
        }

    });  

    function change_password()
    { 

        var user_password = $('#new_password').val();  

        $.ajax({
            type : "POST",
            url  : api_base_url+'admin/profile/change_password',
            dataType : "JSON",
            data : {new_password:user_password},
             headers: {
                "auth-key":"simplerestapi",
                'client-service' : "frontend-client",
                'User-ID' : window.localStorage.getItem('user_id'),
                'Authorization' : window.localStorage.getItem('token'),
                'Branch-ID' : window.localStorage.getItem('branch_id'),
                'Dept-ID' : window.localStorage.getItem('dept_id'),
                // more as you need
            },
            success: function(data){

                $('[name="old_password"]').val("");
                $('[name="new_password"]').val("");
                $('[name="confirm_password"]').val("");
                $("#new_password").trigger('reset');
                document.getElementById('sucessMessage').style.display="block";

            },
            error:function(data){
                console.log(data);
            }
        });
        return false;
    }


    /* // $("#showPassword1").click(function() {

    //       $(this).toggleClass("fa-eye fa-eye-slash");
    //       var x = document.getElementById("old_password");
    //       if (x.type === "password") {
    //         x.type = "text";
    //       } else {
    //         x.type = "password";
    //       }
    //     });
    //  $("#showPassword2").click(function() {

    //       $(this).toggleClass("fa-eye fa-eye-slash");
    //       var x = document.getElementById("new_password");
    //       if (x.type === "password") {
    //         x.type = "text";
    //       } else {
    //         x.type = "password";
    //       }
    //     });
    //   $("#showPassword3").click(function() {

    //       $(this).toggleClass("fa-eye fa-eye-slash");
    //       var x = document.getElementById("confirm_password");
    //       if (x.type === "password") {
    //         x.type = "text";
    //       } else {
    //         x.type = "password";
    //       }
    //     });*/

    /*profile settings*/
    /* //for text area
    $('.item_view').click(function () {
    $('textarea').attr('disabled', 'disabled');
    });
    $('#btn_edit').click(function () {
    $('textarea').removeAttr('disabled');
    });*/


    // enable to edit

    $('#btn_edit').on('click',function(){

        $('.disable').prop("disabled", false);
        document.getElementById("btn_edit").setAttribute("style", 'display:none');
        document.getElementById("btn_update").setAttribute("style", 'display:initial');

    });

});