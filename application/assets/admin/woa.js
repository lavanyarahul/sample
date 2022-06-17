$(document).ready(function() {

    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

    show_data(); 

    function show_data(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'admin/woa/list_woa',
            dataType : 'json',
            async: false,       
            processData: false,
            contentType: false,   
            headers: {
                "auth-key":"simplerestapi",
                'client-service' : "frontend-client",
                'User-ID' : window.localStorage.getItem('user_id'),
                'Branch-ID' : window.localStorage.getItem('branch_id'),
                'Dept-ID' : window.localStorage.getItem('woa_id'),
                'Authorization' : window.localStorage.getItem('token'),
                // more as you need
            },
            success : function(response){
                var html = '';
                var i;
               data = response.woa_list;
               checklist = response.checklist;
                console.log(data)  
             $.each(checklist, function(index, value){
                $('[name="checklist"]').append('<option value="'+ value.checklist_id +'">'+ value.checklist_name +'</option>');
            }); 
            
                for(i=0; i<data.length; i++){
                    if(data[i].image!=''){
                        var img = '<img id="profile_image" class="image thumb"  src="'+base_url+
                    'application/assets/images/woa/'+data[i].image+'"  alt="'+data[i].image+'">';
                    }else{
                         var img = '';
                    }
                    var sl_no = i+1;
                    html += '<tr>'+
                    '<td class="item_view"  data-woa_id="'+data[i].woa_id+'">'+sl_no+'</td>'+
                    '<td class="item_view"  data-woa_id="'+data[i].woa_id+'">'+data[i].woa_name+'</td>'+
                    '<td class="item_view"  data-woa_id="'+data[i].woa_id+'">'+data[i].checklist_name+'</td>'+
                    '<td class="item_view"  data-woa_id="'+data[i].woa_id+'">'+img+'</td>'+
                    '<td >'+  
                    '<a style="color:white;" class="btn btn-danger btn-sm item_delete" data-toggle="modal" data-target="#delete_modal" data-woa_id="'+data[i].woa_id+'" title="Delete"><i class="ti-trash mr-0-5"></i>Delete</a>'+
                    '</td>'+
                    '</tr>';
                }
                $('#woa_data').html(html);
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

            woa_name:{
                required:true,
                noSpace: true,

            },

        },
        messages: {

            woa_name:{

                remote:"Name already exist"
            },

            action: "Please provide some data"
        },
        submitHandler: function(form)
        {
            add_woa();
        }
    });

    //add woa
    function add_woa() {

        var adddata = new FormData(document.getElementById("form_add"));

        $.ajax({
            type : "POST",
            url  : api_base_url+'admin/woa/create',
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
                'Dept-ID' : window.localStorage.getItem('woa_id'),
                'Authorization' : window.localStorage.getItem('token'),
                // more as you need
            }, 
            success: function(data){

                window.location.href = base_url+"admin/woa";

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

    //end of add woa


    // delete woa - start

    $('#example').on('click','.item_delete',function(){

        var woa_id = $(this).data('woa_id');
        $('#id').val(woa_id);

    });

    $('#delete_bt').on('click',function(){

        var woa_id = $('#id').val();
        $.ajax({
            type : "POST",
            url  : api_base_url+'admin/woa/delete',
            dataType : "JSON",
            data : {woa_id:woa_id},
            headers: {
                "auth-key":"simplerestapi",
                'client-service' : "frontend-client",
                'User-ID' : window.localStorage.getItem('user_id'),
                'Branch-ID' : window.localStorage.getItem('branch_id'),
                'Dept-ID' : window.localStorage.getItem('woa_id'),
                'Authorization' : window.localStorage.getItem('token'),
                // more as you need
            }, 
            success: function(data){

                window.location.href = base_url+"admin/woa/index";

            } ,
            error: function(data) {
                //Your Error Message
                console.log(data)
                alert('Internal Error: Contact Administrator');
            }
        });
    });

    // delete woa - end
    //
    $('#example').on('click','.item_view',function(){

        var woa_id = $(this).data('woa_id');
        window.location.href = base_url+"admin/woa/edit/"+woa_id;

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

            woa_name:{
                required:true,
                noSpace: true,
                remote: {
                    url  :  api_base_url+'validation/edit_duplicate',
                    data:{
                        data_edit: function(){return $('input[name=woa_name]').val();},
                        id: function(){return $('input[name=woa_id]').val();},
                        colum_name: function(){return 'woa_name';},
                        table_name: function(){return 'woa';},
                        table_id: function(){return 'woa_id';},

                    },
                    type : "POST"
                }
            },

        },
        messages: {

            woa_name:{
                remote:"Department name already exist",
            },

            action: "Please provide some data"
        },
        submitHandler: function(form){
            update_woa();
        }
    });


    function update_woa() {

        var adddata = new FormData(document.getElementById("form_update"));
        $.ajax({
            type : "POST",
            url  : api_base_url+'admin/woa/update',
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
                'Dept-ID' : window.localStorage.getItem('woa_id'),
                'Authorization' : window.localStorage.getItem('token'),
                // more as you need
            }, 
            success: function(data){

                console.log(data);
                window.location.href = base_url+"admin/woa";

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
function getDeptData(woa_id){
    $.ajax({
        method :'POST',
        url  : api_base_url+'admin/woa/detail',
        data:{'woa_id':woa_id},
        dataType : 'json',

        headers: {
            "auth-key":"simplerestapi",
            'client-service' : "frontend-client",
            'User-ID' : window.localStorage.getItem('user_id'),
            'Branch-ID' : window.localStorage.getItem('branch_id'),
            'Dept-ID' : window.localStorage.getItem('woa_id'),
            'Authorization' : window.localStorage.getItem('token'),
            // more as you need
        }, 
        success: function(data){
            console.log(data)  
            $('[name="woa_name"]').val(data.woa_name);  
            $('[name="woa_id"]').val(data.woa_id);  

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
