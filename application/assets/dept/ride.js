$(document).ready(function() {

    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

    show_data(); 

    function show_data(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'dept/ride/list_ride',
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
                    '<td class="item_view text-center"  data-ride_id="'+data[i].ride_id+'">'+sl_no+'</td>'+
                    '<td class="item_view text-center"  data-ride_id="'+data[i].ride_id+'"><div class="widget-content p-0"> <div class="widget-content-wrapper"> <div class="widget-content-left flex2"> <div class="widget-heading">'+data[i].ride_name+'</div>'+
                    '</div> </div> </div></td>'+
                    '<td class="item_view text-center"  data-ride_id="'+data[i].ride_id+'">'+data[i].ride_desc+'</td>'+
                    '<td >'+  
                    '<a style="color:white;" class="btn btn-danger btn-sm item_delete" data-toggle="modal" data-target="#delete_modal" data-ride_id="'+data[i].ride_id+'" title="Delete"><i class="ti-trash mr-0-5"></i>Delete</a>'+
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

            ride_name:{
                required:true,
                noSpace: true,
                remote: {
                    url  :  api_base_url+'validation/add_duplicate',
                    data:{
                        data_add: function(){return $('input[name=ride_name]').val();},
                        colum_name: function(){return 'ride_name';},
                        table_name: function(){return 'ride';},

                    },
                    type : "POST"
                }
            },

        },
        messages: {

            ride_name:{

                remote:"Ride name already exist"
            },

            action: "Please provide some data"
        },
        submitHandler: function(form)
        {
            add_ride();
        }
    });

    //add ride
    function add_ride() {

        var adddata = new FormData(document.getElementById("form_add"));

        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/ride/create',
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
                window.location.href = base_url+"dept/ride";

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

    //end of add ride


    // delete ride - start

    $('#example').on('click','.item_delete',function(){

        var ride_id = $(this).data('ride_id');
        $('#id').val(ride_id);
    });

    $('#delete_bt').on('click',function(){

        var ride_id = $('#id').val();
        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/ride/delete',
            dataType : "JSON",
            data : {ride_id:ride_id},

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
                window.location.href = base_url+"dept/ride/index";

            } ,
            error: function(data) {
                //Your Error Message
                console.log(data)
                alert('Internal Error: Contact Administrator');
            }
        });
    });

    // delete ride - end
    //
    $('#example').on('click','.item_view',function(){

        var ride_id = $(this).data('ride_id');
        window.location.href = base_url+"dept/ride/edit/"+ride_id;

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

            ride_name:{
                required:true,
                noSpace: true,
                remote: {
                    url  :  api_base_url+'validation/edit_duplicate',
                    data:{
                        data_edit: function(){return $('input[name=ride_name]').val();},
                        id: function(){return $('input[name=ride_id]').val();},
                        colum_name: function(){return 'ride_name';},
                        table_name: function(){return 'ride';},
                        table_id: function(){return 'ride_id';},

                    },
                    type : "POST"
                }
            },

        },
        messages: {

            ride_name:{
                remote:"Ride name already exist",
            },

            action: "Please provide some data"
        },
        submitHandler: function(form){
            update_ride();
        }
    });


    function update_ride() {

        var adddata = new FormData(document.getElementById("form_update"));
        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/ride/update',
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
                window.location.href = base_url+"dept/ride";

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
        url  : api_base_url+'dept/ride/getData',
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
function getRideData(ride_id){
    $.ajax({
        url  : api_base_url+'dept/ride/detail/'+ride_id,
        method : 'POST',
        data:{'ride_id':ride_id},
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
            $('[name="ride_name"]').val(data.ride_name);  
            $('[name="ride_desc"]').val(data.ride_desc);   
            var select_eng = document.getElementById('select_eng');
            select_eng.value = data.assign_to;  
            $('[name="ride_id"]').val(data.ride_id);  

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
