$(document).ready(function() {
    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

    $("#form_add").validate({
        onkeyup: function(element) {$(element).valid()},
        onkeydown : function(element) {$(element).valid()},
        onpaste : function(element) {$(element).valid()},
        oncontextmenu  : function(element) {$(element).valid()},
        oninput  : function(element) {$(element).valid()},
        rules: {

            txt_email:{
                required:true,
                noSpace:true,
                remote: {
                    url  :  base_url+'validation/add_duplicate',
                    data:{
                        data_add: function(){return $('input[name=txt_email]').val();},
                        colum_name: function(){return 'email';},
                        table_name: function(){return 'users';},

                    },
                    type : "POST"
                }
            },
            txt_fname:{
                required:true,
                noSpace:true,
            },
            txt_lname:{
                required:true,
                noSpace:true,
            },
            /*  select_dept:{
            required:true,
            },
            select_desig:{
            required:true,
            },*/
            txt_contact:{
                required:true,
                noSpace:true,
                remote: {
                    url  :  base_url+'validation/add_duplicate',
                    data:{
                        data_add: function(){return $('input[name=txt_contact]').val();},
                        colum_name: function(){return 'contact';},
                        table_name: function(){return 'users';},

                    },
                    type : "POST"
                }
            },
            /*  txt_empid:{
            required:true,
            remote: {
            url  :  base_url+'validation/add_duplicate',
            data:{
            data_add: function(){return $('input[name=txt_empid]').val();},
            colum_name: function(){return 'emp_id';},
            table_name: function(){return 'users';},

            },
            type : "POST"
            }
            },
            select_gender:{
            required:true,
            },*/

        },

        messages: {

            /*  txt_empid:{

            remote: "Employee ID already exist "
            },
            */
            txt_email:{

                remote: "Email Id already exist "
            },

            txt_contact:{

                remote: "Contact already exist "
            },

            action: "Please provide some data"
        },
        submitHandler: function(form) { add_accounts_users(); }
    });


    function add_accounts_users() {

        var adddata = new FormData(document.getElementById("form_add"));
        $.ajax({
            type : "POST",
            url  : base_url+'dept/department_head/save_dept_head',
            dataType : "JSON",
            data : adddata,
            async: false,
            processData: false,
            contentType: false,
            beforeSend: function(){
                $('#loader-section').fadeIn();
            },
            success: function(data){ 
                window.location.href = base_url+"dept/department_head";
            },
            error: function(data) {
                //Your Error Message
                console.log(data)
                alert('Something went wrong: Contact Support');

            },
            complete: function(){
                $('#loader-section').fadeOut(1000);
            }
        });

    }


    $('#example').on('click','.item_view',function(){

        var user_id = $(this).data('user_id');
        window.location.href = base_url+"dept/department_head/edit_dept_head/"+user_id;

    });


    // delete accounts_users - start

    $('#example').on('click','.item_delete',function(){

        var user_id = $(this).data('user_id');
         $('#id').val(user_id);

    });

    $('#delete_bt').on('click',function(){

        var user_id = $('#id').val();
         $.ajax({
            type : "POST",
            url  : base_url+'dept/department_head/delete_dept_head',
            dataType : "JSON",
            data : {user_id:user_id},
            success: function(data){

                window.location.href = base_url+"dept/department_head";

            } ,
            error: function(data) {
                //Your Error Message
                console.log(data)
                alert('Internal Error: Contact Administrator');
            }
        });
    });

    // delete accounts_users - end
 
    // enable to edit

    $('#btn_edit').on('click',function(){

        $('.disable').prop("disabled", false);
        document.getElementById("btn_edit").setAttribute("style", 'display:none');
        document.getElementById("btn_update").setAttribute("style", 'display:initial');

    });

    $("#form_update").validate({
        onkeyup: function(element) {$(element).valid()},
        onkeydown : function(element) {$(element).valid()},
        onpaste : function(element) {$(element).valid()},
        oncontextmenu  : function(element) {$(element).valid()},
        oninput  : function(element) {$(element).valid()},
        rules: {

            txt_email:{
                required:true,
                noSpace:true,
                remote: {
                    url  :  base_url+'validation/edit_duplicate',
                    data:{
                        data_edit: function(){return $('input[name=txt_email]').val();},
                        id: function(){return $('input[name=user_id]').val();},
                        colum_name: function(){return 'email';},
                        table_name: function(){return 'users';},
                        table_id: function(){return 'user_id';},

                    },
                    type : "POST"
                }
            },
            txt_fname:{
                required:true,
                noSpace:true,
            },
            txt_lname:{
                required:true,
                noSpace:true,
            },
            /*select_dept:{
            required:true,
            },
            select_desig:{
            required:true,
            },*/
            txt_contact:{
                required:true,
                noSpace:true,
                remote: {
                    url  :  base_url+'validation/edit_duplicate',
                    data:{
                        data_edit: function(){return $('input[name=txt_contact]').val();},
                        id: function(){return $('input[name=user_id]').val();},
                        colum_name: function(){return 'contact';},
                        table_name: function(){return 'users';},
                        table_id: function(){return 'user_id';},

                    },
                    type : "POST"
                }
            },
            /* txt_empid:{
            required:true,
            remote: {
            url  :  base_url+'validation/edit_duplicate',
            data:{
            data_edit: function(){return $('input[name=txt_empid]').val();},
            id: function(){return $('input[name=user_id]').val();},
            colum_name: function(){return 'emp_id';},
            table_name: function(){return 'users';},
            table_id: function(){return 'user_id';},

            },
            type : "POST"
            }
            },*/
            /* select_gender:{
            required:true,
            },
            */
        },
        messages: {

            /*  txt_empid:{

            remote: "Employee ID already exist "
            },
            */
            txt_email:{

                remote: "Email Id already exist "
            },

            txt_contact:{

                remote: "Contact already exist "
            },

            action: "Please provide some data"
        },
        submitHandler: function(form) { update_accounts_user(); }
    });


    function update_accounts_user() {

        var adddata = new FormData(document.getElementById("form_update"));
        $.ajax({
            type : "POST",
            url  : base_url+'dept/department_head/update_dept_head',
            dataType : "JSON",
            data : adddata,
            async: false,
            processData: false,
            contentType: false,
            success: function(data){

                console.log(data);
                window.location.href = base_url+"dept/department_head";

            },
            error: function(data) {
                //Your Error Message
                console.log(data)
                alert('Something went wrong: Contact Support');

            }
        });
    }
 
});
// end document ready