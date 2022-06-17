$(document).ready(function() {

    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

    show_data(); 

    function show_data(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'dept/complaint/list_complaint',
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
                    '<td class="item_view"  data-type_id="'+data[i].type_id+'">'+sl_no+'</td>'+
                    '<td class="item_view"  data-type_id="'+data[i].type_id+'"><div class="widget-content p-0"> <div class="widget-content-wrapper"> <div class="widget-content-left flex2"> <div class="widget-heading">'+data[i].complaint_type+'</div>'+
                    '</div> </div> </div></td>'+
                    '<td >'+  
                    '<a style="color:white;" class="btn btn-danger btn-sm item_delete" data-toggle="modal" data-target="#delete_modal" data-type_id="'+data[i].type_id+'" title="Delete"><i class="ti-trash mr-0-5"></i>Delete</a>'+
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

            complaint_name:{
                required:true,
                noSpace: true,
                remote: {
                    url  :  api_base_url+'validation/add_duplicate',
                    data:{
                        data_add: function(){return $('input[name=complaint_type]').val();},
                        colum_name: function(){return 'complaint_type';},
                        table_name: function(){return 'complaint_type';},

                    },
                    type : "POST"
                }
            },

        },
        messages: {

            complaint_name:{

                remote:"Type already exist"
            },

            action: "Please provide some data"
        },
        submitHandler: function(form)
        {
            add_complaint();
        }
    });

    //add complaint
    function add_complaint() {

        var adddata = new FormData(document.getElementById("form_add"));

        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/complaint/create',
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
                window.location.href = base_url+"dept/complaint";

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

    //end of add complaint


    // delete complaint - start

    $('#example').on('click','.item_delete',function(){

        var type_id = $(this).data('type_id');
        $('#id').val(type_id);

    });

    $('#delete_bt').on('click',function(){

        var type_id = $('#id').val();
        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/complaint/delete',
            dataType : "JSON",
            headers: {
                "auth-key":"simplerestapi",
                'client-service' : "frontend-client",
                'User-ID' : window.localStorage.getItem('user_id'),
                'Branch-ID' : window.localStorage.getItem('branch_id'),
                'Dept-ID' : window.localStorage.getItem('dept_id'),
                'Authorization' : window.localStorage.getItem('token'),
                // more as you need
            },
            data : {type_id:type_id},
            success: function(data){

                window.location.href = base_url+"dept/complaint/index";

            } ,
            error: function(data) {
                //Your Error Message
                console.log(data)
                alert('Internal Error: Contact Administrator');
            }
        });
    });

    // delete complaint - end
    //
    $('#example').on('click','.item_view',function(){

        var type_id = $(this).data('type_id');
        window.location.href = base_url+"dept/complaint/edit/"+type_id;

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

            complaint_name:{
                required:true,
                noSpace: true,
                remote: {
                    url  :  api_base_url+'validation/update',
                    data:{
                        data_edit: function(){return $('input[name=complaint_name]').val();},
                        id: function(){return $('input[name=type_id]').val();},
                        colum_name: function(){return 'complaint_name';},
                        table_name: function(){return 'complaint';},
                        table_id: function(){return 'type_id';},

                    },
                    type : "POST"
                }
            },

        },
        messages: {

            complaint_name:{
                remote:"Department name already exist",
            },

            action: "Please provide some data"
        },
        submitHandler: function(form){
            update_complaint();
        }
    });


    function update_complaint() {

        var adddata = new FormData(document.getElementById("form_update"));
        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/complaint/update',
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
                window.location.href = base_url+"dept/complaint";

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

function getData(type_id){
    $.ajax({
        method :'POST',
        url  : api_base_url+'dept/complaint/detail',
        data:{'type_id':type_id},
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
            $('[name="complaint_type"]').val(data.complaint_type);  
            $('[name="type_id"]').val(data.type_id);  

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