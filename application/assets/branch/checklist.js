$(document).ready(function() {
    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

    show_data(); 

    function show_data(){
         $.ajax({
            method :'GET',
            url  : api_base_url+'branch/checklist/list_checklist',
            dataType : 'json',
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
            success : function(data){
                var html = '';
                var pool_html = '';
                var i;
                var pool_data =data.pool_checklist;
                var ride_data =data.ride_checklist;
                for(i=0; i<ride_data.length; i++){
                    var status = '';
                    var frequency = '';
                    var recurrence = ' - ';
                    var sl_no = i+1;
                    if(ride_data[i].task_frequency == 1) {
                        frequency = 'One Time';
                    } else if(ride_data[i].task_frequency == 2){
                        frequency = 'Daily';
                    }else if(ride_data[i].task_frequency == 3){
                        frequency = 'Weekly';
                    }else{
                        frequency = 'Monthly';
                    }
                    if(ride_data[i].recurrence > 0){
                        recurrence = ride_data[i].recurrence +' Hrs';
                    }
                    if(ride_data[i].checklist_status ==1 ){
                        status = 'Completed';
                    }else if(ride_data[i].checklist_status == 2 ){
                        status = 'Pending';
                    }
                    html += '<tr>'+
                    '<td class="item_view text-center" data-checklist_id="'+ride_data[i].checklist_id+'">'+sl_no+'</td>'+
                    '<td class="item_view text-center" data-checklist_id="'+ride_data[i].checklist_id+'"><div class="widget-content p-0"> <div class="widget-content-wrapper"> <div class="widget-content-left flex2"> <div class="widget-heading">'+ride_data[i].checklist_name+'</div>'+
                    '  </div> </div> </div></td>'+
                    '<td class="item_view text-center">'+frequency+'</td>'+  
                    '<td class="item_view text-center">'+ride_data[i].fname+' '+ride_data[i].lname+'</td>'+  
                    '<td class="item_view text-center">'+ride_data[i].created_datetime+'</td>'+       
                    '<td >'+ status+'</td>'+
                    '</tr>';
                }
                $('#ride_checklist').html(html);
                
                 for(i=0; i<pool_data.length; i++){
                    var status = '';
                    var frequency = '';
                    var recurrence = ' - ';
                    var sl_no = i+1;
                    if(pool_data[i].task_frequency == 1) {
                        frequency = 'One Time';
                    } else if(pool_data[i].task_frequency == 2){
                        frequency = 'Daily';
                    }else if(pool_data[i].task_frequency == 3){
                        frequency = 'Weekly';
                    }else{
                        frequency = 'Monthly';
                    }
                    if(pool_data[i].recurrence > 0){
                        recurrence = pool_data[i].recurrence +' Hrs';
                    }
                    if(pool_data[i].checklist_status ==1 ){
                        status = 'Completed';
                    }else if(pool_data[i].checklist_status == 2 ){
                        status = 'Pending';
                    }
                    pool_html += '<tr>'+
                    '<td class="item_view text-center" data-checklist_id="'+pool_data[i].checklist_id+'">'+sl_no+'</td>'+
                    '<td class="item_view text-center" data-checklist_id="'+pool_data[i].checklist_id+'"><div class="widget-content p-0"> <div class="widget-content-wrapper"> <div class="widget-content-left flex2"> <div class="widget-heading">'+pool_data[i].checklist_name+'</div>'+
                    '  </div> </div> </div></td>'+
                    '<td class="item_view text-center">'+frequency+'</td>'+   
                    '<td class="item_view text-center">'+pool_data[i].fname+' '+pool_data[i].lname+'</td>'+  
                    '<td class="item_view text-center">'+pool_data[i].created_datetime+'</td>'+       
                    '<td >'+ status+'</td>'+
                    '</tr>';
                }
                $('#pool_checklist').html(pool_html);
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
});
