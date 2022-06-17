$(document).ready(function() {

    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

     show_data(); 

    function show_data(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'dept/location/list_location',
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
                    '<td class="item_view"  data-location_id="'+data[i].location_id+'">'+sl_no+'</td>'+
                    '<td class="item_view"  data-location_id="'+data[i].location_id+'"><div class="widget-content p-0"> <div class="widget-content-wrapper"> <div class="widget-content-left flex2"> <div class="widget-heading">'+data[i].location+'</div>'+
                    '</div> </div> </div></td>'+
                    '<td >'+  
                    '<a style="color:white;" class="btn btn-danger btn-sm item_delete" data-toggle="modal" data-target="#delete_modal" data-location_id="'+data[i].location_id+'" title="Delete"><i class="ti-trash mr-0-5"></i>Delete</a>'+
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

            location:{
                required:true,
                noSpace: true,
                remote: {
                    url  :  api_base_url+'validation/add_duplicate',
                    data:{
                        data_add: function(){return $('input[name=location]').val();},
                        colum_name: function(){return 'location';},
                        table_name: function(){return 'location';},

                    },
                    type : "POST"
                }
            },

        },
        messages: {

            location:{

                remote:"Location already exist"
            },

            action: "Please provide some data"
        },
        submitHandler: function(form)
        {
            add_location();
        }
    });

    //add location
    function add_location() {

        var adddata = new FormData(document.getElementById("form_add"));

        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/location/create',
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
                window.location.href = base_url+"dept/location";

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

    //end of add location


    // delete location - start

    $('#example').on('click','.item_delete',function(){

        var location_id = $(this).data('location_id');
        $('#id').val(location_id);

    });

    $('#delete_bt').on('click',function(){

        var location_id = $('#id').val();
        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/location/delete',
            dataType : "JSON",
            data : {location_id:location_id},
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

                window.location.href = base_url+"dept/location/index";

            } ,
            error: function(data) {
                //Your Error Message
                console.log(data)
                alert('Internal Error: Contact Administrator');
            }
        });
    });

    // delete location - end
    //
    $('#example').on('click','.item_view',function(){

        var location_id = $(this).data('location_id');
        window.location.href = base_url+"dept/location/edit/"+location_id;

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

            location:{
                required:true,
                noSpace: true,
                remote: {
                    url  :  api_base_url+'validation/edit_duplicate',
                    data:{
                        data_edit: function(){return $('input[name=location]').val();},
                        id: function(){return $('input[name=location_id]').val();},
                        colum_name: function(){return 'location';},
                        table_name: function(){return 'location';},
                        table_id: function(){return 'location_id';},

                    },
                    type : "POST"
                }
            },

        },
        messages: {

            location:{
                remote:"Location already exist",
            },

            action: "Please provide some data"
        },
        submitHandler: function(form){
            update_location();
        }
    });


    function update_location() {

        var adddata = new FormData(document.getElementById("form_update"));
        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/location/update',
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
                window.location.href = base_url+"dept/location";

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


function getData(location_id){
    $.ajax({
        method :'POST',
        url  : api_base_url+'dept/location/detail',
        data:{'location_id':location_id},
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
            $('[name="location"]').val(data.location);  
            $('[name="location_id"]').val(data.location_id);  

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