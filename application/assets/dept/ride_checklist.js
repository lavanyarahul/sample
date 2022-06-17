$(document).ready(function() {
    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

    show_data(); 

    function show_data(){
         $.ajax({
            method :'GET',
            url  : api_base_url+'dept/ride_checklist/list_checklist',
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
                    var frequency = '';
                    var recurrence = ' - ';
                    var sl_no = i+1;
                    if(data[i].task_frequency == 1) {
                        frequency = 'One Time';
                    } else if(data[i].task_frequency == 2){
                        frequency = 'Daily';
                    }else if(data[i].task_frequency == 3){
                        frequency = 'Weekly';
                    }else{
                        frequency = 'Monthly';
                    }
                    if(data[i].recurrence > 0){
                        recurrence = data[i].recurrence +' Hrs';
                    }
                    html += '<tr>'+
                    '<td class="item_view text-center" data-checklist_id="'+data[i].checklist_id+'">'+sl_no+'</td>'+
                    '<td class="item_view text-center" data-checklist_id="'+data[i].checklist_id+'"><div class="widget-content p-0"> <div class="widget-content-wrapper"> <div class="widget-content-left flex2"> <div class="widget-heading">'+data[i].checklist_name+'</div>'+
                    '  </div> </div> </div></td>'+
                    '<td class="item_view text-center">'+frequency+'</td>'+  
                    '<td class="item_view text-center">'+recurrence+'</td>'+       
                    '<td >'+  
                    ' <button class="mr-2 btn-icon btn-icon-only btn btn-outline-danger item_delete" data-toggle="modal" data-target="#delete_modal" data-checklist_id="'+data[i].checklist_id+'"> <i class="fa fa-plus"> </i>'+
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

    $("#form_assign").validate({
        onkeyup: function(element) {$(element).valid()},
        onkeydown : function(element) {$(element).valid()},
        onpaste : function(element) {$(element).valid()},
        oncontextmenu  : function(element) {$(element).valid()},
        oninput  : function(element) {$(element).valid()},
        rules: {

            ride:{
                required:true,  
            },

        },
        messages: {

            ride:{

                remote:"Select Ride."
            },

            action: "Please provide some data"
        },
        submitHandler: function(form)
        {
            assign_ride();
        }
    });

    //add ride
    function assign_ride() {

        var adddata = new FormData(document.getElementById("form_assign"));
        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/ride_checklist/assign',
            dataType : "JSON",
            data : adddata,
            async: false,
            processData: false,
            contentType: false,
            headers: {
                "auth-key":"simplerestapi",
                'client-service' : "frontend-client",
                'User-ID' : window.localStorage.getItem('user_id'),
                'Authorization' : window.localStorage.getItem('token'),
                // more as you need
            },
            beforeSend: function(){
                $('#loader-section').fadeIn();
            },
            success: function(data){

                console.log(data);
                window.location.href = base_url+"dept/ride_checklist";

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

    $('#example').on('click','.item_delete',function(){

        var checklist_id = $(this).data('checklist_id');
        $('#checklist_id').val(checklist_id);
        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/ride_checklist/getData',
            dataType : "JSON",
            data : {checklist_id:checklist_id},
            headers: {
                "auth-key":"simplerestapi",
                'client-service' : "frontend-client",
                'User-ID' : window.localStorage.getItem('user_id'),
                'Authorization' : window.localStorage.getItem('token'),
                // more as you need
            }, 
            success: function(data){ 
                console.log(data);
                if($('#ride_id').length > 0){
                    rideData = data.ride_list;
                    $('#ride_id').empty();
                    var rideResult = '';
                    document.getElementById('ride_id').innerHTML='<option value="0" selected disabled>Select Ride</option>';
                    for(i=0; i<rideData.length; i++){
                        rideResult += "<option value='" + rideData[i].ride_id + "'>" + rideData[i].ride_name + "</option>";
                    }
                    $( 'select[name="ride_id[]"]' ).append( rideResult ); 
                }    
 
                $('#ride_id').html(data.options);
                var select = document.getElementById("ride_id");
                multi(select, {
                    non_selected_header: "Rides",
                    selected_header: "Selected Rides"
                });
            },
            error: function(data) {
                //Your Error Message
                console.log(data)
                alert('Something went wrong: Contact Support');

            },

        });

    });


});
// end document ready
 