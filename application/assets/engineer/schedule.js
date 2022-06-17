$(document).ready(function() { 

    $('#example').on('click','.item_replicate',function(){

        var schedule_id = $(this).data('schedule_id');
        $('#schedule_id').val(schedule_id);

    });

    $('#replicate_bt').on('click',function(){

        var schedule_id = $('#schedule_id').val();
        var schedule_date = $('#schedule_date').val();
        $.ajax({
            type : "POST",
            url  : api_base_url+'engineer/schedule/replicate',
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
            data : {schedule_id:schedule_id,schedule_date:schedule_date},
            success: function(data){
                if(data.status == 401){
                    sessionOutMsg()

                }else{
                    window.location.reload();
                }

            } ,
            error: function(data) {
                if(data.status == 401){
                    sessionOutMsg()

                }else{
                    //Your Error Message
                    console.log(data)
                    alert('Internal Error: Contact Administrator');
                }
            }
        });
    });

    $('#example').on('click','.item_delete',function(){

        var schedule_id = $(this).data('schedule_id');
        $('#id').val(schedule_id);

    });

    $('#delete_bt').on('click',function(){

        var schedule_id = $('#id').val();
        $.ajax({
            type : "POST",
            url  : api_base_url+'engineer/schedule/delete',
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
            data : {schedule_id:schedule_id},
            success: function(data){
                if(data.status == 401){
                    sessionOutMsg()

                }else{
                    window.location.reload();
                }

            } ,
            error: function(data) {
                if(data.status == 401){
                    sessionOutMsg()

                }else{
                    //Your Error Message
                    console.log(data)
                    alert('Internal Error: Contact Administrator');
                }
            }
        });
    });

    $("#form_schedule").validate({
        onkeyup: function(element) {$(element).valid()},
        onkeydown : function(element) {$(element).valid()},
        onpaste : function(element) {$(element).valid()},
        oncontextmenu  : function(element) {$(element).valid()},
        oninput  : function(element) {$(element).valid()},
        rules: {

            ride_id:{
                required:true,
            },

            tech_id:{
                required:true,
            },

            assis_id:{
                required:true,
            },

            schedule_date:{
                required:true,
            },

        },
        messages: {                            

            action: "Please provide some data"
        },
        submitHandler: function(form)
        {
            schedule_duty();
        }
    });

    //add ride
    function  schedule_duty() {

        var adddata = new FormData(document.getElementById("form_schedule"));
        $.ajax({
            type : "POST",
            url  : api_base_url+'engineer/schedule/assign',
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
                 console.log(data)
                if(data.status == 401){
                    sessionOutMsg()

                }else{
                    console.log(data);
                    window.location.href = base_url+"engineer/schedule";
                }

            },
            error: function(data) {
                if(data.status == 401){
                    sessionOutMsg()

                }else{ //Your Error Message
                    console.log(data)
                    alert('Something went wrong: Contact Support');
                }

            },
            complete: function(){
                $('#loader-section').fadeOut(1000);
            }
        });

    }

    $('#example').on('click','.item_assign',function(){

        var schedule_id = $(this).data('schedule_id');
        $('#assign_schedule_id').val(schedule_id);

        var schedule_date = $(this).data('schedule_date');
        $('#assign_schedule_date').val(schedule_date);

        var ride_id = $(this).data('ride_id');
        $('#assign_ride_id').val(ride_id);

        $.ajax({
            method :'POST',
            url  : api_base_url+'engineer/schedule/getUserData',
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
            data : {schedule_id:schedule_id},   
            success: function(data){
                if(data.status == 401){
                    sessionOutMsg()

                }else{
                    if($('#tech_id').length > 0){
                        techData = data.technician;
                        console.log(techData) 
                        $('#tech_id').empty();
                        var techResult = '';
                        document.getElementById('tech_id').innerHTML='';
                        for(i=0; i<techData.length; i++){
                            techResult += "<option value='" + techData[i].user_id + "'>" + techData[i].fname + " "+techData[i].lname+"</option>";
                        }
                        $( 'select[name="tech_id[]"]' ).append( techResult );

                        $('#tech_id').html(data.options);
                        var select = document.getElementById("tech_id");
                        multi(select, {
                            non_selected_header: "Technician",
                            selected_header: "Selected Technician"
                        });
                    }     
                    if($('#assis_id').length > 0){
                        assisData = data.tech_assistant;
                        console.log(assisData) 
                        $('#assis_id').empty();
                        var assisResult = '';
                        document.getElementById('assis_id').innerHTML='';
                        for(i=0; i<assisData.length; i++){
                            assisResult += "<option value='" + assisData[i].user_id + "'>" + assisData[i].fname + " "+assisData[i].lname+"</option>";
                        }
                        $( 'select[name="assis_id[]"]' ).append( assisResult );

                        $('#assis_id').html(data.options);
                        var select = document.getElementById("assis_id");
                        multi(select, {
                            non_selected_header: "Technician Assistant",
                            selected_header: "Selected Technician Assistant"
                        });
                    }
                }
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
    });

    $("#form_assign").validate({
        onkeyup: function(element) {$(element).valid()},
        onkeydown : function(element) {$(element).valid()},
        onpaste : function(element) {$(element).valid()},
        oncontextmenu  : function(element) {$(element).valid()},
        oninput  : function(element) {$(element).valid()},
        rules: {

            assign_ride_id:{
                required:true,
            },

            tech_id:{
                required:true,
            },

            assis_id:{
                required:true,
            },

            assign_schedule_date:{
                required:true,
            },

        },
        messages: {                            

            action: "Please provide some data"
        },
        submitHandler: function(form)
        {
            assign_duty();
        }
    });
    function assign_duty(){
        var adddata = new FormData(document.getElementById("form_assign"));            
        $.ajax({
            type : "POST",
            url  : api_base_url+'engineer/schedule/assign_duty',
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
                if(data.status == 401){
                    sessionOutMsg()

                }else{
                    window.location.reload();
                }

            } ,
            error: function(data) {
                if(data.status == 401){
                    sessionOutMsg()

                }else{  //Your Error Message
                    console.log(data)
                    alert('Internal Error: Contact Administrator');
                }
            }
        });
    } 
}); 

function show_data(){
    $.ajax({
        method :'GET',
        url : api_base_url+'engineer/schedule/getList',  
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
            if(data.status == 401){
                sessionOutMsg()

            }else{
                console.log(data)   
                var html = '';
                var i;

                for(i=0; i<data.length; i++){
                    var sl_no = i+1;
                    html += '<tr>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+sl_no+'</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+data[i].ride_name+'</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+data[i].technician_names+'</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+data[i].tech_assistant_names+'</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+data[i].schedule_date+'</td>'+

                    '<td >'+  
                    '<a style="color:white;" class="btn btn-danger btn-sm item_replicate" data-toggle="modal" data-target="#replicate_modal" data-schedule_id="'+data[i].schedule_id+'" title="Replicate"><i class="ti-trash mr-0-5"></i>Replicate</a>'+
                    /* ' &nbsp; &nbsp;<a style="color:white;" class="btn btn-danger btn-sm item_assign" data-toggle="modal" data-target="#assign_modal" data-schedule_id="'+data[i].schedule_id+'" data-ride_id="'+data[i].ride_id+'" data-schedule_date="'+data[i].schedule_date+'" title="Assign"><i class="ti-trash mr-0-5"></i>Assign</a>'+*/
                    ' &nbsp; &nbsp;<a style="color:white;margin-top:2px;" class="btn btn-danger btn-sm item_delete" data-toggle="modal" data-target="#delete_modal" data-schedule_id="'+data[i].schedule_id+'" title="Delete"><i class="ti-trash mr-0-5"></i>Delete</a>'+
                    '</td></tr>';
                }
                $('#tbl_data').html(html);
            }
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
function getData(){
    $.ajax({
        method :'GET',
        url  : api_base_url+'engineer/schedule/getData',
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
            if(data.status == 401){
                sessionOutMsg()

            }else{
                if($('#ride_id').length > 0){
                    rideData = data.ride_list; 
                    $('#ride_id').empty();
                    var rideResult = '';
                    document.getElementById('ride_id').innerHTML='<option value="0" selected disabled>Select Ride</option>';
                    for(i=0; i<rideData.length; i++){
                        rideResult += "<option value='" + rideData[i].ride_id + "'>" + rideData[i].ride_name + "</option>";
                    }
                    $( 'select[name="ride_id"]' ).append( rideResult ); 
                }   

                if($('#tech_id').length > 0){
                    techData = data.tech_list;
                    console.log(techData) 
                    $('#tech_id').empty();
                    var techResult = '';
                    document.getElementById('tech_id').innerHTML='<option value="0" selected disabled>Select Technician</option>';
                    for(i=0; i<techData.length; i++){
                        techResult += "<option value='" + techData[i].user_id + "'>" + techData[i].fname + " "+techData[i].lname+"</option>";
                    }
                    $( 'select[name="tech_id"]' ).append( techResult );                                        

                } 
                if($('#tech_id').length > 0){                                          
                    assisData = data.assis_list;  
                    $('#assis_id').empty();
                    var assisResult = '';
                    document.getElementById('assis_id').innerHTML='<option value="0" selected disabled>Select Technician Assistant</option>';
                    for(i=0; i<assisData.length; i++){
                        assisResult += "<option value='" + assisData[i].user_id + "'>" + assisData[i].fname + " "+assisData[i].lname+"</option>";
                    }
                    $( 'select[name="assis_id[]"]' ).append( assisResult ); 
                }
            }
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
function getTechAssistants(tech_id){
    $.ajax({
        method :'POST',
        url  : api_base_url+'engineer/schedule/getAssistantData',
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
        data:{tech_id:tech_id},
        success: function(data){
            if(data.status == 401){
                sessionOutMsg() 
            }else{
                assisData = data.assis_list;  
                $('#assis_id').empty();
                var assisResult = '';
                document.getElementById('assis_id').innerHTML='<option value="0" selected disabled>Select Technician Assistant</option>';
                for(i=0; i<assisData.length; i++){
                    assisResult += "<option value='" + assisData[i].user_id + "'>" + assisData[i].fname + " "+assisData[i].lname+"</option>";
                }
                $( 'select[name="assis_id[]"]' ).append( assisResult );  
            } 

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