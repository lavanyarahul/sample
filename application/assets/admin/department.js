$(document).ready(function() {

    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

    show_data(); 

    function show_data(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'admin/department/list_dept',
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
                    '<td class="item_view"  data-dept_id="'+data[i].dept_id+'">'+sl_no+'</td>'+
                    '<td class="item_view"  data-dept_id="'+data[i].dept_id+'">'+data[i].dept_name+'</td>'+
                    '<td >'+  
                    '<a style="color:white;" class="btn btn-danger btn-sm item_delete" data-toggle="modal" data-target="#delete_modal" data-dept_id="'+data[i].dept_id+'" title="Delete"><i class="ti-trash mr-0-5"></i>Delete</a>'+
                    '</td>'+
                    '</tr>';
                }
                $('#dept_data').html(html);
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

            dept_name:{
                required:true,
                noSpace: true,
                remote: {
                    url  :  api_base_url+'validation/add_duplicate',
                    data:{
                        data_add: function(){return $('input[name=dept_name]').val();},
                        colum_name: function(){return 'dept_name';},
                        table_name: function(){return 'department';},

                    },
                    type : "POST"
                }
            },

        },
        messages: {

            dept_name:{

                remote:"Department name already exist"
            },

            action: "Please provide some data"
        },
        submitHandler: function(form)
        {
            add_department();
        }
    });

    //add department
    function add_department() {

        var adddata = new FormData(document.getElementById("form_add"));

        $.ajax({
            type : "POST",
            url  : api_base_url+'admin/department/create',
            dataType : "JSON",
            data : adddata,
            async: false,
            processData: false,
            contentType: false,
            beforeSend: function(){
                $('#loader-section').fadeIn();
            }, 
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
                window.location.href = base_url+"admin/department";

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

    //end of add department


    // delete dept - start

    $('#example').on('click','.item_delete',function(){

        var dept_id = $(this).data('dept_id');
        $('#id').val(dept_id);

    });

    $('#delete_bt').on('click',function(){

        var dept_id = $('#id').val();
        $.ajax({
            type : "POST",
            url  : api_base_url+'admin/department/delete',
            dataType : "JSON",
            data : {dept_id:dept_id},
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

                window.location.href = base_url+"admin/department/index";

            } ,
            error: function(data) {
                //Your Error Message
                console.log(data)
                alert('Internal Error: Contact Administrator');
            }
        });
    });

    // delete department - end
    //
    $('#example').on('click','.item_view',function(){

        var dept_id = $(this).data('dept_id');
        window.location.href = base_url+"admin/department/edit/"+dept_id;

    });


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

            dept_name:{
                required:true,
                noSpace: true,
                remote: {
                    url  :  api_base_url+'validation/edit_duplicate',
                    data:{
                        data_edit: function(){return $('input[name=dept_name]').val();},
                        id: function(){return $('input[name=dept_id]').val();},
                        colum_name: function(){return 'dept_name';},
                        table_name: function(){return 'department';},
                        table_id: function(){return 'dept_id';},

                    },
                    type : "POST"
                }
            },

        },
        messages: {

            dept_name:{
                remote:"Department name already exist",
            },

            action: "Please provide some data"
        },
        submitHandler: function(form){
            update_department();
        }
    });


    function update_department() {

        var adddata = new FormData(document.getElementById("form_update"));
        $.ajax({
            type : "POST",
            url  : api_base_url+'admin/department/update',
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
                window.location.href = base_url+"admin/department";

            },
            error: function(data) {
                if(data.status == 401){
                    sessionOutMsg()

                }else{
                    alert('Something went wrong: Contact Support');

                }

            }
        });
    }


    function sessionOutMsg(){
        toastr.options = {
            positionClass: 'toast-top-right'
        };
        toastr.warning('Your session has been expired!');

        setTimeout(
        function(){
            window.location = base_url 
        },
        2000);
    }


});
function getDeptData(dept_id){
    $.ajax({
        method :'POST',
        url  : api_base_url+'admin/department/detail',
        data:{'dept_id':dept_id},
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
            $('[name="dept_name"]').val(data.dept_name);  
            $('[name="dept_id"]').val(data.dept_id);  

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

// end document ready
