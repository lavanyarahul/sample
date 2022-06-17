
$(document).ready(function() {
     jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

    show_data();

    function show_data(){ 
         $.ajax({
            method :'GET',
            url  : api_base_url+'admin/ride_checklist/list_checklist',
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
                    '<td class="item_view " data-checklist_id="'+data[i].checklist_id+'">'+sl_no+'</td>'+
                    '<td class="item_view " data-checklist_id="'+data[i].checklist_id+'">'+data[i].checklist_name+'</td>'+
                     '<td ><img class="qr_view" id="img'+i+'" onclick="popUp(img'+i+',this)" data-checklist_id="'+data[i].checklist_id+'" data-checklist_name="'+data[i].checklist_name+'" data-toggle="modal" data-target="#myModal" src="'+ base_url+'application/assets/qr/'+data[i].checklist_id+'qr.png"></td>'+
                    '<td > <button class="mr-2 btn-icon btn-icon-only btn btn-outline-danger item_delete" data-toggle="modal" data-target="#delete_modal" data-checklist_id="'+data[i].checklist_id+'"> <i class="fa fa-plus"> </i>'+
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

    $( ".qr_view" ).on( "click", function() {

        var checklist_id = $(this).data('checklist_id');
         var checklist_name = $(this).data('checklist_name');  
         $('#checklist_name_qr').html(checklist_name);                                                      
  
    });

    $( ".item_view" ).on( "click", function() {

        var checklist_id = $(this).data('checklist_id');
        
        window.location.href = base_url+"admin/ride_checklist/detail/"+checklist_id;                                                   
  
    });

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
            url  : api_base_url+'admin/ride_checklist/assign',
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
                window.location.href = base_url+"admin/ride_checklist";

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
            url  : api_base_url+'admin/ride_checklist/getData',
            dataType : "JSON",
            data : {checklist_id:checklist_id},
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

    $('#select_task').on('click',function(){   
        var check_type =$("input[name='check_type']:checked").val(); 
        var type =$("input[name='type']:checked").val(); 
        if(check_type == 1){
            location.href = base_url+'admin/ride_checklist/create_checklist/'+type  
        } else{
            location.href = base_url+'admin/ride_checklist/add_checklist/'+type  
        }
    });

});
// end document ready

function printQR() {

    const printContent = document.getElementById("overallprint");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
}
  
    function popUp(img,obj){ 
        
        var img = document.getElementById(img);
        var modalImg = document.getElementById("img01");  
        modalImg.src = obj.src; 
        
    }
  
    function getChecklistData(checklist_id){
        $.ajax({
            method :'POST',
            url  : api_base_url+'admin/ride_checklist/get_checklist',
            data:{'checklist_id':checklist_id},
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
                 
                console.log(checklist_labels)

                 $('#task_name_display').html(checklist.checklist_name);
                $('#task_description_display').html(checklist.checklist_desc); 
                 $('#created_date_display').html(checklist.created_date);
                 var checklist_id = checklist.checklist_id; 
                 $('#qr_display').html('<img class="qr_view" id="img'+checklist_id+'" onclick="popUp(img'+checklist_id+',this)" data-checklist_id="'+checklist_id+'" data-checklist_name="'+checklist.checklist_name+'" data-toggle="modal" data-target="#myModal" src="'+ base_url+'application/assets/qr/'+checklist_id+'qr.png">');
                 if(checklist.checklist_id != '') {
                    var criteriaBody ='';
                    var criteriaHeader = '';
                    $('#criteriaDiv').css('display','block');
                    if( checklist.checklist_type == 1 ){
    
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
                            criteriaHeader +='</tr>' ;
                          }
                         for(i=0; i<criteria.length; i++){
                            criteriaBody += ' <tr><td style="width:40px !important;">'+criteria[i].criteria_name+' </td>  '+
                            '<td style="width:40px !important;">'+criteria[i].criteria_name2+' </td>'+
                            '<td style="width:40px !important;">'+criteria[i].criteria_name3+' </td>' ;
                            if(criteria[i].field_type == 1 ) { 
                                    criteriaBody += '<td class="borderx  ">Checkbox</td>' 
                            }else if(criteria[i].field_type == 2 ){
                                criteriaBody += '<td >Textbox</td>'
                            }else{
                                criteriaBody += '<td >None</td>'
                            }
                            
                        }
                    }else{
                        criteriaBody2 ='';
                        criteriaBody3 ='';
                        criteriaBody4 =''; 
 
                        for(i=0; i<checklist_labels.length; i++){
                            criteriaHeader += ' <tr><td style="width:40px !important;">'+checklist_labels[i].label1+' </td>  ';
                            if(checklist_labels[i].label2){
                            criteriaHeader += '<td style="width:40px !important;">'+checklist_labels[i].label2+' </td>';
                             }
                            if(checklist_labels[i].label3){
                            criteriaHeader += '<td style="width:40px !important;">'+checklist_labels[i].label3+' </td>';
                            criteriaBody2 = '<td >Textbox</td>';
                            }
                            if(checklist_labels[i].label4){
                            criteriaHeader +='<td style="width:40px !important;">'+checklist_labels[i].label4+' </td>';
                            criteriaBody3 = '<td >Textbox</td>';
                            }
                            if(checklist_labels[i].label5 != ''){
                            criteriaHeader +='<td style="width:40px !important;">'+checklist_labels[i].label5+' </td> ' ;
                            criteriaBody4 = '<td >Textbox</td>';
                            }
                            
                             criteriaHeader +='  </tr>' ;
                          }
                           for(i=0; i<criteria.length; i++){
                            criteriaBody += ' <tr><td style="width:40px !important;">'+criteria[i].criteria_name+' </td>  ';
                             
                                criteriaBody += '<td >Textbox</td>';
                                 criteriaBody += criteriaBody2;
                                 criteriaBody += criteriaBody3;
                                 criteriaBody += criteriaBody4; 
                             criteriaBody += '<tr>'
                        }
                    }
                    $('#criteriaBody').html(criteriaBody);
                    $('#criteriaHeader').html(criteriaHeader);

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