$(document).ready(function() {
    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

    show_data();

    function show_data(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'engineer/checklist/list_checklist',
            dataType : 'json',
            async: false,
            processData: false,
            contentType: false,
            headers: {
                "auth-key":"simplerestapi",
                'client-service' : "frontend-client",
                'User-ID' : window.localStorage.getItem('user_id'),
                'Authorization' : window.localStorage.getItem('token'),
                'Branch-ID' : window.localStorage.getItem('branch_id'),
                'Dept-ID' : window.localStorage.getItem('dept_id'),
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
                    if(ride_data[i].frequency == 1) {
                        frequency = 'One Time';
                    } else if(ride_data[i].frequency == 2){
                        frequency = 'Daily';
                    }else if(ride_data[i].frequency == 3){
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
                        status = 'Expired';
                    }else if(ride_data[i].checklist_status == 3 ){
                        status = 'Pending';
                    }else if(ride_data[i].checklist_status == 4 ){
                        status = 'Partially Completed';
                    }
                    html += '<tr>'+
                    '<td class="item_view text-center" data-checklist_id="'+ride_data[i].checklist_id+'" data-track_id="'+ride_data[i].track_id+'">'+sl_no+'</td>'+
                    '<td class="item_view text-center" data-checklist_id="'+ride_data[i].checklist_id+'" data-track_id="'+ride_data[i].track_id+'"><div class="widget-content p-0"> <div class="widget-content-wrapper"> <div class="widget-content-left flex2"> <div class="widget-heading">'+ride_data[i].checklist_name+'</div>'+
                    '  </div> </div> </div></td>'+
                    '<td class="item_view text-center" data-checklist_id="'+ride_data[i].checklist_id+'" data-track_id="'+ride_data[i].track_id+'">'+frequency+'</td>'+
                    '<td class="item_view text-center" data-checklist_id="'+ride_data[i].checklist_id+'" data-track_id="'+ride_data[i].track_id+'">'+ride_data[i].fname+' '+ride_data[i].lname+'</td>'+
                    '<td class="item_view text-center" data-checklist_id="'+ride_data[i].checklist_id+'" data-track_id="'+ride_data[i].track_id+'">'+ride_data[i].created_datetime+'</td>'+
                    '<td >'+ status+'</td>'+
                    '</tr>';
                }
                $('#ride_checklist').html(html);

                for(i=0; i<pool_data.length; i++){
                    var status = '';
                    var frequency = '';
                    var recurrence = ' - ';
                    var sl_no = i+1;
                    if(pool_data[i].frequency == 1) {
                        frequency = 'One Time';
                    } else if(pool_data[i].frequency == 2){
                        frequency = 'Daily';
                    }else if(pool_data[i].frequency == 3){
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
                        status = 'Expired';
                    }else if(pool_data[i].checklist_status == 3 ){
                        status = 'Pending';
                    }else if(pool_data[i].checklist_status == 4 ){
                        status = 'Partially Completed';
                    }
                    pool_html += '<tr>'+
                    '<td class="item_view text-center" data-checklist_id="'+pool_data[i].checklist_id+'" data-track_id="'+pool_data[i].track_id+'">'+sl_no+'</td>'+
                    '<td class="item_view text-center" data-checklist_id="'+pool_data[i].checklist_id+'" data-track_id="'+pool_data[i].track_id+'"><div class="widget-content p-0"> <div class="widget-content-wrapper"> <div class="widget-content-left flex2"> <div class="widget-heading">'+pool_data[i].checklist_name+'</div>'+
                    '  </div> </div> </div></td>'+
                    '<td class="item_view text-center" data-checklist_id="'+pool_data[i].checklist_id+'" data-track_id="'+pool_data[i].track_id+'">'+frequency+'</td>'+
                    '<td class="item_view text-center" data-checklist_id="'+pool_data[i].checklist_id+'" data-track_id="'+pool_data[i].track_id+'">'+pool_data[i].fname+' '+pool_data[i].lname+'</td>'+
                    '<td class="item_view text-center" data-checklist_id="'+pool_data[i].checklist_id+'" data-track_id="'+pool_data[i].track_id+'">'+pool_data[i].created_datetime+'</td>'+
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

    $('#rideTbl').on('click','.item_view',function(){

        var checklist_id = $(this).data('checklist_id');
        var   track_id  = $(this).data('track_id');
        window.location.href = base_url+"engineer/checklist/view/"+checklist_id+'/'+track_id;

    });

    $('#poolTbl').on('click','.item_view',function(){

        var checklist_id = $(this).data('checklist_id');
        var   track_id  = $(this).data('track_id');
        window.location.href = base_url+"engineer/checklist/view/"+checklist_id+'/'+track_id;

    });
});

function getChecklistData(checklist_id,track_id){
    $.ajax({
        method :'POST',
        url  : api_base_url+'engineer/checklist/get_checklist',
        data:{'checklist_id':checklist_id,'track_id':track_id},
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
            var checklist = data.checklist_details;
            var checklist_labels = data.checklist_labels;
            var criteria = data.criteria_details;
            var criteria_list = data.criteria_list;
            var breakdown = data.get_breakdown;
            
            console.log(data)
            
            $('#task_name_display').html(checklist.checklist_name);
            $('#task_description_display').html(checklist.checklist_desc);
            if(checklist.task_frequency == 2){
                if(checklist.recurrence > 0){
                    var recurrence = checklist.recurrence +' Hrs';
                }
                $('#task_recurrence').css('display','block');
                $('#task_recurrence_display').html(recurrence);
            }
            if(checklist.frequency == 1) {
                var frequency = 'One Time';
            }
            else if(checklist.frequency == 2){
                var frequency = 'Daily';
            }
            else if(checklist.frequency == 3){
                var frequency = 'Weekly';
            }
            else{
                var frequency = 'Monthly';
            }

            $('#task_frequency_display').html(frequency); 
 
             if(checklist.checklist_status == 1){
                var task_status =  'Completed';
            }else if(checklist.checklist_status == 2){
                var task_status =  'Expired';
            }else if(checklist.checklist_status == 3){
                var task_status =  'Completed';
            }else if(checklist.checklist_status == 4){
                var task_status =  'Partially Completed';
            }else{
                var task_status =  'Expired';
            }
            $('#task_status_display').html(task_status);
            $('#updated_date_display').html(checklist.updated_date);
            $('#comment_display').html(checklist.comment);
             if(checklist.checklist_id != '') {
                var criteriaBody ='';
                $('#criteriaDiv').css('display','block');
                if( checklist.checklist_type == 1){
                    for(i=0; i<checklist_labels.length; i++){
                        criteriaHeader += ' <tr><td style="width:40px !important;">'+checklist_labels[i].label1+' </td>  ';
                        if(checklist_labels[i].label2)
                        criteriaHeader += '<td style="width:40px !important;">'+checklist_labels[i].label2+' </td>';
                        if(checklist_labels[i].label3)
                        criteriaHeader += '<td style="width:40px !important;">'+checklist_labels[i].label3+' </td>';
                        if(checklist_labels[i].label4)
                        criteriaHeader +='<td style="width:40px !important;">'+checklist_labels[i].label4+' </td>';
                        if(checklist_labels[i].label5)
                        criteriaHeader +='<td style="width:40px !important;">'+checklist_labels[i].label5+' </td> ' ;
                        criteriaHeader +='<td style="width:40px !important;">Comment </td> <tr>' ;
                      }
                      for(i=0; i<criteria.length; i++){
                        criteriaBody += ' <tr><td style="width:40px !important;">'+criteria[i].criteria_name+' </td>  '+
                        '<td style="width:40px !important;">'+criteria[i].criteria_name2+' </td>'+
                        '<td style="width:40px !important;">'+criteria[i].criteria_name3+' </td>' ;
                        if(criteria[i].criteria_type == 1 ) {
                            if(criteria[i].criteria_value == 1){ 
                                criteriaBody += '<td class="borderx text-success text-center"><i class="fa fa-check" aria-hidden="true"></i></td>'
                            }else{
                                criteriaBody += '<td class="borderx text-danger text-center"> <i class="fa fa-times" aria-hidden="true"></i></td>'    }
                        }else if(criteria[i].criteria_type == 2 ){
                            criteriaBody += '<td ><b>'+criteria[i].criteria_value;+'</b></td>'
                        }else{
                            criteriaBody += '<td ></td>'
                        }
                        criteriaBody += '<td >'+criteria[i].criteria_comment+'</td>'
                    }
                }else{
                    for(i=0; i<checklist_labels.length; i++){
                        criteriaHeader += ' <tr><td style="width:40px !important;">'+checklist_labels[i].label1+' </td>  ';
                        if(checklist_labels[i].label2)
                        criteriaHeader += '<td style="width:40px !important;">'+checklist_labels[i].label2+' </td>';
                        if(checklist_labels[i].label3)
                        criteriaHeader += '<td style="width:40px !important;">'+checklist_labels[i].label3+' </td>';
                        if(checklist_labels[i].label4)
                        criteriaHeader +='<td style="width:40px !important;">'+checklist_labels[i].label4+' </td>';
                        if(checklist_labels[i].label5)
                        criteriaHeader +='<td style="width:40px !important;">'+checklist_labels[i].label5+' </td> ' ;
                        criteriaHeader +='<td style="width:40px !important;">Comment </td> <tr>' ;
                      }

                      for(i=0; i<criteria.length; i++){
                        criteriaBody += ' <tr><td style="width:40px !important;">'+criteria[i].criteria_name+' </td>  ';
                         
                            criteriaBody += '<td ><b>'+criteria[i].criteria_value;+'</b></td>';
                            if(criteria[i].criteria_value2)
                            criteriaBody += '<td ><b>'+criteria[i].criteria_value2;+'</b></td>';
                            if(criteria[i].criteria_value3)
                            criteriaBody += '<td ><b>'+criteria[i].criteria_value3;+'</b></td>';
                            if(criteria[i].criteria_value4)
                            criteriaBody += '<td ><b>'+criteria[i].criteria_value4;+'</b></td>';
                            
                        
                        criteriaBody += '<td >'+criteria[i].criteria_comment+'</td><tr>'
                    }
                }
                $('#criteriaHeader').html(criteriaHeader);
                $('#criteriaBody').html(criteriaBody);
                var imageHtml=''; 
                if( checklist.attached_images != '') {
                    $('.checklistImg').css('display','block');
                    var attached_images_array =  checklist.attached_images.split(',');
                    for(i=0; i<attached_images_array.length;i++){
                        var file_name = base_url+'application/assets/img/task_image/'+attached_images_array[i] ;
                        imageHtml += '<img style="padding:5px; width:50px !important;" id="img'+i+'" onclick="popUp(img'+i+',this)" src="'+file_name+'">' ;
                    } 
                    $('#image_preview').html(imageHtml);
                 }
                 if(breakdown.length > 0){
                    var i;
                    var html ='';
                    for(i=0; i<breakdown.length; i++){

                        var sl_no = i+1;
                        if(breakdown[i].status == 1){
                            var status = 'Pending';
                        }else{
                            var status = 'Completed';
                        }
                        html += '<tr>'+
                        '<td class="text-center" data-checklist_id="'+breakdown[i].checklist_id+'">'+sl_no+'</td>'+
                        '<td class="text-center" data-checklist_id="'+breakdown[i].checklist_id+'"><div class="widget-content p-0"> <div class="widget-content-wrapper"> <div class="widget-content-left flex2"> <div class="widget-heading">'+breakdown[i].ride_name+'</div>'+
                        '  </div> </div> </div></td>'+
                        '<td class="text-center">'+breakdown[i].complaint+'</td>'+  
                        '<td class="text-center">'+breakdown[i].comment+'</td>'+  
                        '<td class="text-center">'+breakdown[i].fname+' '+breakdown[i].lname+'</td>'+  
                        '<td class="text-center">'+breakdown[i].created_datetime+'</td>'+       
                        '<td >'+ status+'</td>'+
                        '</tr>';
                    }
                    $('#tbl_data').html(html);
                    $('#BreakDown').css('display','block');
                }
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
function popUp(img,obj){


    var img = document.getElementById(img);
    var modalImg = document.getElementById("img01");

    $('#myModal').modal('show');

    modalImg.src = obj.src;

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        $('#myModal').modal('hide');
    }
}
