$(document).ready(function() {
    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

    show_data(); 

    function show_data(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'branch/technician/list_technician',
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
                    '<td class="item_view"  data-user_id="'+data[i].user_id+'"><div class="widget-content p-0"> <div class="widget-content-wrapper"> <div class="widget-content-left flex2"> <div class="widget-heading">'+data[i].fname+' '+data[i].lname+'</div>'+
                    '<div class="widget-subheading opacity-7">'+data[i].desig_name+'</div> </div> </div> </div></td>'+
                    '<td class="item_view"  data-user_id="'+data[i].user_id+'">'+data[i].email+'</td>'+
                    '<td class="item_view"  data-user_id="'+data[i].user_id+'">'+data[i].contact+'</td>'+
                    '<td class="item_view"  data-user_id="'+data[i].user_id+'">'+data[i].dept_name+'</td>'+
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
            /* select_dept:{
            required:true,
            },
            select_desig:{
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
        submitHandler: function(form) { add_technician_users(); }
    });


    function add_technician_users() {

        var adddata = new FormData(document.getElementById("form_add"));
        $.ajax({
            type : "POST",
            url  : api_base_url+'branch/technician/create',
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

                console.log(data);
                window.location.href = base_url+"branch/technician";

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
        window.location.href = base_url+"branch/technician/edit/"+user_id;

    });


    // delete technician_users - start

    $('#example').on('click','.item_delete',function(){

        var user_id = $(this).data('user_id');
        $('#id').val(user_id);

    });

    $('#delete_bt').on('click',function(){

        var user_id = $('#id').val();
        $.ajax({
            type : "POST",
            url  : api_base_url+'branch/technician/delete',
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

                window.location.href = base_url+"branch/technician";

            } ,
            error: function(data) {
                //Your Error Message
                console.log(data)
                alert('Internal Error: Contact Administrator');
            }
        });
    });

    // delete technician_users - end



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
            /* select_dept:{
            required:true,
            },
            select_desig:{
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
        submitHandler: function(form) { update_technician_user(); }
    });


    function update_technician_user() {

        var adddata = new FormData(document.getElementById("form_update"));
        $.ajax({
            type : "POST",
            url  : api_base_url+'branch/technician/update',
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
                window.location.href = base_url+"branch/technician";

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
        url  : api_base_url+'branch/technician/getData',
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
            if($('#branch_id').length > 0){
                branchData = data.branch_list;
                $('#branch_id').empty();
                var branchResult = '';
                document.getElementById('branch_id').innerHTML='<option value="0" selected disabled>Select Branch</option>';
                for(i=0; i<branchData.length; i++){
                    branchResult += "<option value='" + branchData[i].branch_id + "'>" + branchData[i].branch_name + "</option>";
                }
                $( 'select[name="branch_id"]' ).append( branchResult ); 
            }    
            if($('#select_eng').length > 0){
                engData = data.eng_list;
                $('#select_eng').empty();
                var engResult = '';
                document.getElementById('select_eng').innerHTML='<option value="0" selected disabled>Select Engineer </option>';
                for(i=0; i<engData.length; i++){
                    engResult += "<option value='" + engData[i].user_id + "'>" + engData[i].fname+' '+ engData[i].lname + "</option>";
                }
                $( 'select[name="select_eng"]' ).append( engResult ); 
            }
            deptData = data.dept_list;
            $('#select_dept').empty();
            var deptResult = '';
            document.getElementById('select_dept').innerHTML='<option value="0" selected disabled>Select Department</option>';
            for(i=0; i<deptData.length; i++){
                deptResult += "<option value='" + deptData[i].dept_id + "'>" + deptData[i].dept_name + "</option>";
            }
            $( 'select[name="select_dept"]' ).append( deptResult ); 

            desigData = data.desig_list;
            $('#select_desig').empty();
            var desigResult = '';
            document.getElementById('select_desig').innerHTML='<option value="0" selected disabled>Select Designation</option>';
            for(i=0; i<desigData.length; i++){
                desigResult += "<option value='" + desigData[i].desig_id + "'>" + desigData[i].desig_name + "</option>";
            }
            $( 'select[name="select_desig"]' ).append( desigResult );
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
        url  : api_base_url+'branch/technician/detail',
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
        success: function(res){
            console.log(res) 
            data = res.technician_data;
            console.log(data) 
            $('[name="txt_fname"]').val(data.fname);  
            $('[name="txt_lname"]').val(data.lname);  
            $('[name="txt_email"]').val(data.email);  
            $('[name="txt_contact"]').val(data.contact);
            var select_eng = document.getElementById('select_eng');
            select_eng.value = data.assign_to; 
            var select_dept = document.getElementById('select_dept');
            select_dept.value = data.dept_id; 
            var select_desig = document.getElementById('select_desig');
            select_desig.value = data.desig_id; 
            $('[name="user_id"]').val(data.user_id);  

            engineer_list = res.engineer_list;
            $('#select_eng').empty();
            var engineerResult = '';
            for(i=0; i<engineer_list.length; i++){
                if(engineer_list[i].assign_to == user_id){
                    var selected = 'selected = "selected"';
                }else{
                    var selected = '';
                }
                engineerResult += "<option "+selected+" value='"+engineer_list[i].user_id+"'>"+engineer_list[i].fname+' '+engineer_list[i].lname+"</option>";
            }
            $( '#select_eng' ).append( engineerResult ); 

            var select = document.getElementById("select_eng");
            multi(select, {
                non_selected_header: "Engineer",
                selected_header: "Selected Engineer"
            });

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