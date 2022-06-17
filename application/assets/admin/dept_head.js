$(document).ready(function() {
    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

      show_data(); 

    function show_data(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'admin/department_head/list_dept_head',
            dataType : 'json',
            async: false,       
            processData: false,
            contentType: false,   
            headers: {
                "auth-key":"simplerestapi",
                'client-service' : "frontend-client",
                'User-ID' : window.localStorage.getItem('user_id'),
                'Branch-ID' : window.localStorage.getItem('branch_id'),
                'Dept-ID' : window.localStorage.getItem('dept_id'),
                'Authorization' : window.localStorage.getItem('token'),
                // more as you need
            },
            success : function(data){
                var html = '';
                var i;

                for(i=0; i<data.length; i++){
                    var sl_no = i+1;
                    html += '<tr>'+
                    '<td class="item_view"  data-user_id="'+data[i].user_id+'">'+sl_no+'</td>'+
                    '<td class="item_view"  data-user_id="'+data[i].user_id+'">'+data[i].fname+' '+data[i].lname+'</td>'+
                     '<td class="item_view"  data-user_id="'+data[i].user_id+'">'+data[i].email+'</td>'+
                    '<td class="item_view"  data-user_id="'+data[i].user_id+'">'+data[i].contact+'</td>'+
                    '<td >'+  
                    '<a style="color:white;" class="btn btn-danger btn-sm item_delete" data-toggle="modal" data-target="#delete_modal" data-user_id="'+data[i].user_id+'" title="Delete"><i class="ti-trash mr-0-5"></i>Delete</a>'+
                    '</td>'+
                    '</tr>';
                }
                $('#tbl_data').html(html);
            } ,
            error: function(data) {
                //Your Error Message 
                console.log(data)  
                if(data.status == 401){
                    sessionOutMsg()

                }else{
                    alert('Internal Error: Contact Administrator');  
                }
            }

        });
    }
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
                    url  :  api_base_url+'validation/add_duplicate',
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
            select_branch:{
                required:true,
            }, 
            select_dept:{
            required:true,
            },
           /*select_desig:{
            required:true,
            },*/
            txt_contact:{
                required:true,
                noSpace:true,
                remote: {
                    url  :  api_base_url+'validation/add_duplicate',
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
            url  : api_base_url+'admin/department_head/create',
            dataType : "JSON",
            data : adddata,
            async: false,
            processData: false,
            contentType: false,
             headers: {
                "auth-key":"simplerestapi",
                'client-service' : "frontend-client",
                'User-ID' : window.localStorage.getItem('user_id'),
                'Branch-ID' : window.localStorage.getItem('branch_id'),
                'Dept-ID' : window.localStorage.getItem('dept_id'),
                'Authorization' : window.localStorage.getItem('token'),
                // more as you need
            },
            beforeSend: function(){
                $('#loader-section').fadeIn();
            },
            success: function(data){ 
                window.location.href = base_url+"admin/department_head";
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
        window.location.href = base_url+"admin/department_head/edit/"+user_id;

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
            url  : api_base_url+'admin/department_head/delete',
            dataType : "JSON",
            data : {user_id:user_id},
             headers: {
                "auth-key":"simplerestapi",
                'client-service' : "frontend-client",
                'User-ID' : window.localStorage.getItem('user_id'),
                'Branch-ID' : window.localStorage.getItem('branch_id'),
                'Dept-ID' : window.localStorage.getItem('dept_id'),
                'Authorization' : window.localStorage.getItem('token'),
                // more as you need
            },
            success: function(data){

                window.location.href = base_url+"admin/department_head";

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
                    url  :  api_base_url+'validation/edit_duplicate',
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
            select_branch:{
                required:true,
            },
            select_dept:{
            required:true,
            },
           /* select_desig:{
            required:true,
            },*/
            txt_contact:{
                required:true,
                noSpace:true,
                remote: {
                    url  :  api_base_url+'validation/edit_duplicate',
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
            url  : api_base_url+'admin/department_head/update',
            dataType : "JSON",
            data : adddata,
            async: false,
            processData: false,
            contentType: false,
             headers: {
                "auth-key":"simplerestapi",
                'client-service' : "frontend-client",
                'User-ID' : window.localStorage.getItem('user_id'),
                'Branch-ID' : window.localStorage.getItem('branch_id'),
                'Dept-ID' : window.localStorage.getItem('dept_id'),
                'Authorization' : window.localStorage.getItem('token'),
                // more as you need
            },
            success: function(data){

                console.log(data);
                window.location.href = base_url+"admin/department_head";

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

function getDropdownData(){
    $.ajax({
        method :'GET',
        url  : api_base_url+'admin/department_head/getData',
        dataType : 'json', 
        headers: {
            "auth-key":"simplerestapi",
            'client-service' : "frontend-client",
            'User-ID' : window.localStorage.getItem('user_id'),
                'Branch-ID' : window.localStorage.getItem('branch_id'),
                'Dept-ID' : window.localStorage.getItem('dept_id'),
            'Authorization' : window.localStorage.getItem('token'),
            // more as you need
        }, 
        success: function(data){
            console.log(data) 
             
            branchData = data.branch_list;
            $('#select_branch').empty();
            var branchResult = '';
            document.getElementById('select_branch').innerHTML='<option value="0" selected disabled>Select Park</option>';
            for(i=0; i<branchData.length; i++){
                branchResult += "<option value='" + branchData[i].branch_id + "'>" + branchData[i].branch_name + "</option>";
            }
            $( 'select[name="select_branch"]' ).append( branchResult ); 

            deptData = data.dept_list;
            $('#select_dept').empty();
            var deptResult = '';
            document.getElementById('select_dept').innerHTML='<option value="0" selected disabled>Select Department</option>';
            for(i=0; i<deptData.length; i++){
                deptResult += "<option value='" + deptData[i].dept_id + "'>" + deptData[i].dept_name + "</option>";
            }
            $( 'select[name="select_dept"]' ).append( deptResult ); 

            // desigData = data.desig_list;
            // $('#select_desig').empty();
            // var desigResult = '';
            // document.getElementById('select_desig').innerHTML='<option value="0" selected disabled>Select Designation</option>';
            // for(i=0; i<desigData.length; i++){
            //     desigResult += "<option value='" + desigData[i].desig_id + "'>" + desigData[i].desig_name + "</option>";
            // }
            // $( 'select[name="select_desig"]' ).append( desigResult );
        } ,
        error: function(data) {
            //Your Error Message 
            console.log(data) 
            if(data.status == 401){
                toastr.options = {
                    positionClass: 'toast-top-right'
                };
                toastr.warning('Your session has been expired!');

                setTimeout(
                function(){
                    window.location = base_url 
                },
                2000);

            }else{ 
                alert('Internal Error: Contact Administrator');  
            }
        }
    });
}
function getUserData(user_id){
    $.ajax({
        method :'POST',
        url  : api_base_url+'admin/department_head/detail',
        data:{'user_id':user_id},
        dataType : 'json', 
        headers: {
            "auth-key":"simplerestapi",
            'client-service' : "frontend-client",
            'User-ID' : window.localStorage.getItem('user_id'),
                'Branch-ID' : window.localStorage.getItem('branch_id'),
                'Dept-ID' : window.localStorage.getItem('dept_id'),
            'Authorization' : window.localStorage.getItem('token'),
            // more as you need
        }, 
        success: function(data){
            console.log(data)  
            $('[name="txt_fname"]').val(data.fname);  
            $('[name="txt_lname"]').val(data.lname);  
            $('[name="txt_email"]').val(data.email);  
            $('[name="txt_contact"]').val(data.contact);  
             var select_branch = document.getElementById('select_branch');
            select_branch.value = data.branch_id; 
            var select_dept = document.getElementById('select_dept');
            select_dept.value = data.dept_id; 
            // var select_desig = document.getElementById('select_desig');
            // select_desig.value = data.desig_id;  
            $('[name="user_id"]').val(data.user_id);  

        } ,
        error: function(data) {
            //Your Error Message 
            console.log(data) 
            if(data.status == 401){
                toastr.options = {
                    positionClass: 'toast-top-right'
                };
                toastr.warning('Your session has been expired!');

                setTimeout(
                function(){
                    window.location = base_url 
                },
                2000);

            }else{ 
                alert('Internal Error: Contact Administrator');  
            }
        }
    });
}
