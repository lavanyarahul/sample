function show_data(){
    $.ajax({
        method :'GET',
        url : api_base_url+'engineer/duty/getList',  
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
        success : function(result){
            if(result.status == 401){
                sessionOutMsg()

            }else{
                var data = result.result;
                var data2 = result.result2;
  
                var html = '';
                var i;
                var wp_status ='';
                
                for(i=0; i<data.length; i++){
                    var asgn =  '<a style="color:white;margin-top:2px;padding: 4px;" class="btn btn-danger btn-sm item_assign" data-toggle="modal"'+
                    'data-target="#assign_modal" data-schedule_id="'+data[i].schedule_id+'" data-ride_id="'+data[i].ride_id+
                    '" data-schedule_date="'+data[i].schedule_date+'" title="Assign">Assign</a> '+
                    '<a style="color:white;margin-top:2px;padding: 4px;" class="btn btn-danger btn-sm item_reschedule" data-toggle="modal"'+
                    'data-target="#reschedule_modal" data-schedule_id="'+data[i].schedule_id+'" data-ride_id="'+data[i].ride_id+
                    '" data-schedule_date="'+data[i].schedule_date+'" title="Reassign">Reassign</a>';
               
                    var sl_no = i+1;
                    html += '<tr>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+sl_no+'</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+data[i].ride_name+'</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+data[i].technician_names+'</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+data[i].tech_assistant_names+'</td>'+
                    '<td >'+asgn + 
                    '</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+ wp_status +'</td>'+

                    '</tr>';
                }
                for(i=0; i<data2.length; i++){
                    var asgn = 'Assigned'; 
                    if( data2[i].wp_status == 2) {
                        var wp_status ='<a style="color:white; padding: 4px;" class="btn btn-danger btn-sm" title="Not Accepted">Not Accepted</a>'
                    }else{
                        var wp_status ='<a style="color:white;padding: 4px;" class="btn btn-success btn-sm" title="Accepted">Accepted</a>' 
                    } 
                    var sl_no = i+1;
                    html += '<tr>'+
                    '<td class="item_view text-center" data-schedule_id="'+data2[i].schedule_id+'">'+sl_no+'</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data2[i].schedule_id+'">'+data2[i].ride_name+'</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data2[i].schedule_id+'">'+data2[i].technician_names+'</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data2[i].schedule_id+'">'+data2[i].tech_assistant_names+'</td>'+
                    '<td >'+asgn + 
                    '</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data2[i].schedule_id+'">'+ wp_status +'</td>'+

                    '</tr>';
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
$('#example').on('click','.item_reschedule',function(){

    var schedule_id = $(this).data('schedule_id');
    $('#reschedule_schedule_id').val(schedule_id);
    var ride_id = $(this).data('ride_id');
    $('#reschedule_ride_id').val(ride_id);
    var schedule_date = $(this).data('schedule_date');
    $('#reschedule_schedule_date').val(schedule_date);

    $.ajax({
        type :'POST',
        url  : api_base_url+'engineer/duty/getAllUserData',
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
                if($('#reschedule_tech_id').length > 0){
                    techData = data.tech_list;
                    console.log(techData) 
                    $('#reschedule_tech_id').empty();
                    var techResult = '';
                    document.getElementById('reschedule_tech_id').innerHTML='<option value="0" selected disabled>Select Technician</option>';
                    for(i=0; i<techData.length; i++){
                        techResult += "<option value='" + techData[i].user_id + "'>" + techData[i].fname + " "+techData[i].lname+"</option>";
                    }
                    $( 'select[name="reschedule_tech_id"]' ).append( techResult );                                        

                } 
                if($('#reschedule_assis_id').length > 0){                                          
                    assisData = data.assis_list;  
                    console.log(assisData) 
                    $('#reschedule_assis_id').empty();
                    var assisResult = '';
                    document.getElementById('reschedule_assis_id').innerHTML='<option value="0" selected disabled>Select Technician Assistant</option>';
                    for(i=0; i<assisData.length; i++){
                        assisResult += "<option value='" + assisData[i].user_id + "'>" + assisData[i].fname + " "+assisData[i].lname+"</option>";
                    }
                    $( 'select[name="reschedule_assis_id[]"]' ).append( assisResult ); 
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
$("#form_reschedule").validate({
    onkeyup: function(element) {$(element).valid()},
    onkeydown : function(element) {$(element).valid()},
    onpaste : function(element) {$(element).valid()},
    oncontextmenu  : function(element) {$(element).valid()},
    oninput  : function(element) {$(element).valid()},
    rules: {

        reschedule_schedule_id:{
            required:true,
        },
        reschedule_schedule_date:{
            required:true,
        },
        reschedule_ride_id:{
            required:true,
        },
        reschedule_tech_id:{
            required:true,
        },
        reschedule_assis_id:{
            required:true,
        },

    },
    messages: {                            

        action: "Please provide some data"
    },
    submitHandler: function(form)
    {
        reschedule_duty();
    }
});
function reschedule_duty(){
    var adddata = new FormData(document.getElementById("form_reschedule"));            
    $.ajax({
        type : "POST",
        url  : api_base_url+'engineer/duty/reschedule_duty',
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
            //Your Error Message
            if(data.status == 401){
                sessionOutMsg()

            }else{
                console.log(data)
                alert('Internal Error: Contact Administrator');
            }
        }
    });
} 
$('#example').on('click','.item_assign',function(){

    var schedule_id = $(this).data('schedule_id');
    $('#schedule_id').val(schedule_id);
    var ride_id = $(this).data('ride_id');
    $('#ride_id').val(ride_id);
    var schedule_date = $(this).data('schedule_date');
    $('#schedule_date').val(schedule_date);

    $.ajax({
        type :'POST',
        url  : api_base_url+'engineer/duty/getData',
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
                    techData = data.tech_list;
                     $('#tech_id').empty();
                      for(i=0; i<techData.length; i++){
                        $( 'input[name="tech_id"]' ).val( techData[i].user_id );
                      } 
                } 
                if($('#assis_id').length > 0){                                          
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

}); 

$("#form_assign").validate({
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
        assign_duty();
    }
});
function assign_duty(){
    var adddata = new FormData(document.getElementById("form_assign"));            
    $.ajax({
        type : "POST",
        url  : api_base_url+'engineer/duty/assign_duty',
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
            //Your Error Message
            if(data.status == 401){
                sessionOutMsg()

            }else{
                console.log(data)
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