function show_data(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'admin/ride/list_ride',
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
                    '<td class="item_view "  data-ride_id="'+data[i].ride_id+'">'+sl_no+'</td>'+
                    '<td class="item_view "  data-ride_id="'+data[i].ride_id+'"><div class="widget-content p-0"> <div class="widget-content-wrapper"> <div class="widget-content-left flex2"> <div class="widget-heading">'+data[i].ride_name+'</div>'+
                    '</div> </div> </div></td>'+
                    '<td class="item_view "  data-ride_id="'+data[i].ride_id+'">'+data[i].ride_desc+'</td>'+
                    '<td class="item_view "  data-ride_id="'+data[i].ride_id+'">'+data[i].branch_name+'</td>'+
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

function list_active(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'admin/ride/list_active',
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

               var brkdwn_rides= data.brkdwn_rides;  
             //  var active_rides= data.active_rides; 

                for(i=0; i<brkdwn_rides.length; i++){
                    if( brkdwn_rides[i].operational_status == 1) {
                        var wp_status ='<a style="color:white; padding: 4px;" class="btn btn-danger btn-sm" title="Not Accepted">Not Working</a>'
                    }else{
                        var wp_status ='<a style="color:white;padding: 4px;" class="btn btn-success btn-sm" title="Accepted">Working</a>' 
                    } 
                    var sl_no = i+1;
                    html += '<tr>'+
                    '<td class="item_view "  data-ride_id="'+brkdwn_rides[i].ride_id+'">'+sl_no+'</td>'+ 
                    '<td class="item_view "  data-ride_id="'+brkdwn_rides[i].ride_id+'">'+brkdwn_rides[i].ride_name+'</td>'+
                    '<td class="item_view "  data-ride_id="'+brkdwn_rides[i].ride_id+'">'+brkdwn_rides[i].branch_name+'</td>'+
                    '<td class="item_view "  data-ride_id="'+brkdwn_rides[i].ride_id+'">'+wp_status+'</td>'+ 
                    '</tr>';
                }
                // for(i=0; i<active_rides.length; i++){
                //     if( active_rides[i].operational_status == 1) {
                //         var wp_status ='<a style="color:white; padding: 4px;" class="btn btn-danger btn-sm" title="Not Accepted">Not Working</a>'
                //     }else{
                //         var wp_status ='<a style="color:white;padding: 4px;" class="btn btn-success btn-sm" title="Accepted">Working</a>' 
                //     } 
                //       sl_no = sl_no+1;
                //     html += '<tr>'+
                //     '<td class="item_view "  data-ride_id="'+active_rides[i].ride_id+'">'+sl_no+'</td>'+ 
                //     '<td class="item_view "  data-ride_id="'+active_rides[i].ride_id+'">'+active_rides[i].ride_name+'</td>'+
                //     '<td class="item_view "  data-ride_id="'+active_rides[i].ride_id+'">'+active_rides[i].branch_name+'</td>'+
                //     '<td class="item_view "  data-ride_id="'+active_rides[i].ride_id+'">'+wp_status+'</td>'+ 
                //     '</tr>';
                // }
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
            url  : api_base_url+'admin/ride/create',
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
                window.location.href = base_url+"admin/ride";

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
            url  : api_base_url+'admin/ride/delete',
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

                window.location.href = base_url+"admin/ride/index";

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
        window.location.href = base_url+"admin/ride/edit/"+ride_id;

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
            url  : api_base_url+'admin/ride/update',
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
                window.location.href = base_url+"admin/ride";

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
        url  : api_base_url+'admin/ride/getData',
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
        url  : api_base_url+'admin/ride/detail',
        data:{'ride_id':ride_id},
        dataType : 'json', 
        method :'POST',
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
            var select_branch = document.getElementById('select_branch');
            select_branch.value = data.branch_id; 
            var select_dept = document.getElementById('select_eng');
            select_dept.value = data.assign_to; 
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
