$(document).ready(function() {
    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

    show_data();

    function show_data(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'admin/pool_checklist/list_checklist',
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
        
        window.location.href = base_url+"admin/pool_checklist/detail/"+checklist_id;                                                   
  
    });
    $("#form_assign").validate({
        onkeyup: function(element) {$(element).valid()},
        onkeydown : function(element) {$(element).valid()},
        onpaste : function(element) {$(element).valid()},
        oncontextmenu  : function(element) {$(element).valid()},
        oninput  : function(element) {$(element).valid()},
        rules: {

            pool:{
                required:true,
            },

        },
        messages: {

            pool:{

                remote:"Select Ride."
            },

            action: "Please provide some data"
        },
        submitHandler: function(form)
        {
            assign_pool();
        }
    });

    //add pool
    function assign_pool() {

        var adddata = new FormData(document.getElementById("form_assign"));
        $.ajax({
            type : "POST",
            url  : api_base_url+'admin/pool_checklist/assign',
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
                window.location.href = base_url+"admin/pool_checklist";

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

    //end of add pool

    $('#example').on('click','.item_delete',function(){

        var checklist_id = $(this).data('checklist_id');
        $('#checklist_id').val(checklist_id);
        $.ajax({
            type : "POST",
            url  : api_base_url+'admin/pool_checklist/getData',
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
                 if($('#pool_id').length > 0){
                    poolData = data.pool_list;
                    $('#pool_id').empty();
                    var poolResult = '';
                    document.getElementById('pool_id').innerHTML='<option value="0" selected disabled>Select Ride</option>';
                    for(i=0; i<poolData.length; i++){
                        poolResult += "<option value='" + poolData[i].pool_id + "'>" + poolData[i].pool_name + "</option>";
                    }
                    $( 'select[name="pool_id[]"]' ).append( poolResult );
                }
                $('#pool_id').html(data.options);
                var select = document.getElementById("pool_id");
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