
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
                    url : base_url+'dept/profile/check_password',
                    type : "POST",

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
                url  : base_url+'dept/profile/change_password',
                dataType : "JSON",
                data : {new_password:user_password},
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
     

      // $("#showPassword1").click(function() {

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
      //     });
    
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

    $("#profile_form").validate({
        onkeyup: function(element) {$(element).valid()}, 
        onkeydown : function(element) {$(element).valid()}, 
        onpaste : function(element) {$(element).valid()}, 
        oncontextmenu  : function(element) {$(element).valid()}, 
        oninput  : function(element) {$(element).valid()}, 
        rules: {
          gst_no:{
              required:true,
              noSpace: true,
              remote: {                    
                url  :  base_url+'validation/edit_duplicate',                    
                data:{                        
                  data_edit: function(){return $('input[name=gst_no]').val();},                        
                  id: function(){return $('input[name=user_id]').val();},                        
                  colum_name: function(){return 'gst_no';},                        
                  table_name: function(){return 'users';},                        
                  table_id: function(){return 'user_id';},                    
                                     
                },                    
                type : "POST"                
              }
            },
            pan_no:{
              required:true,
              noSpace: true,
              remote: {                    
                url  :  base_url+'validation/edit_duplicate',                    
                data:{                        
                  data_edit: function(){return $('input[name=pan_no]').val();},                        
                  id: function(){return $('input[name=user_id]').val();},                        
                  colum_name: function(){return 'pan_no';},                        
                  table_name: function(){return 'users';},                        
                  table_id: function(){return 'user_id';},                    
                                     
                },                    
                type : "POST"                
              }
            },
            tan_no:{
              required:true,
              noSpace: true,
              remote: {                    
                url  :  base_url+'validation/edit_duplicate',                    
                data:{                        
                  data_edit: function(){return $('input[name=tan_no]').val();},                        
                  id: function(){return $('input[name=user_id]').val();},                        
                  colum_name: function(){return 'tan_no';},                        
                  table_name: function(){return 'users';},                        
                  table_id: function(){return 'user_id';},                    
                                     
                },                    
                type : "POST"                
              }
            },
             cin_no:{
              required:true,
              noSpace: true,
              remote: {                    
                url  :  base_url+'validation/edit_duplicate',                    
                data:{                        
                  data_edit: function(){return $('input[name=cin_no]').val();},                        
                  id: function(){return $('input[name=user_id]').val();},                        
                  colum_name: function(){return 'cin_no';},                        
                  table_name: function(){return 'users';},                        
                  table_id: function(){return 'user_id';},                    
                                     
                },                    
                type : "POST"                
              }
            },
            address:{
              required:true,
              noSpace:true,
            },
           txt_fname:{
              required:true,
              noSpace:true,
            },
            
            email:{
              required:true,
              noSpace:true,
            },
            txt_contact:{
              required:true,
              noSpace:true,
            },
        },
        messages: {

            txt_fname:{
              required: "Enter your company name" 
            },
             email:{
              required: "Please enter your email" 
            },
             txt_contact:{
              required: "Please enter your contact number" 
            },
        },
        submitHandler: function(form) { update_profile(); }
  }); 

     function update_profile() {

      var adddata = new FormData(document.getElementById("profile_form"));
      $.ajax({
          type : "POST",
          url  : base_url+'dept/profile/update_profile',
          dataType : "JSON",
          data : adddata,
          async: false,       
          processData: false,
          contentType: false,   
          success: function(data){

            console.log(data);
            window.location.href = base_url+"dept/dashboard";

          },
          error: function(data) {
              //Your Error Message
              console.log(data)
              alert('Something went wrong: Contact Support');
              
          }
      });
    }


      });