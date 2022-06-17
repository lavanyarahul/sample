$(document).ready(function() {  

    $('#example').on('click','.item_assign',function(){

        var complaint_id = $(this).data('complaint_id');
        $('#assign_complaint_id').val(complaint_id); 
 
        $.ajax({
            method :'GET',
            url  : api_base_url+'engineer/complaint/getTech',
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
            success: function(techData){
                if(techData.status == 401){
                    sessionOutMsg()

                }else{
                    if($('#tech_id').length > 0){
                        console.log(techData) 
                        $('#tech_id').empty();
                        var techResult = '';
                        document.getElementById('tech_id').innerHTML="<option selected disabled >Select Technician</option>";
                        for(i=0; i<techData.length; i++){
                            techResult += "<option value='" + techData[i].user_id + "'>" + techData[i].fname + " "+techData[i].lname+"</option>";
                        }
                        $( 'select[name="tech_id"]' ).append( techResult );


                    }     

                }
            } ,
            error: function(data) {
                //Your Error Message 
                console.log(data) 
                if(data.status == 401){
                    sessionOutMsg()

                }else{
                    console.log(data)
                    alert('Internal Error: Contact Administrator');
                }
            }
        });
    });
    $('#example').on('click','.item_reassign',function(){

        var complaint_id = $(this).data('complaint_id');
        $('#reassign_complaint_id').val(complaint_id); 
 
        $.ajax({
            method :'GET',
            url  : api_base_url+'engineer/complaint/getTech',
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
            success: function(techData){
                if(techData.status == 401){
                    sessionOutMsg()

                }else{
                    if($('#re_tech_id').length > 0){
                        console.log(techData) 
                        $('#re_tech_id').empty();
                        var techResult = '';
                        document.getElementById('re_tech_id').innerHTML="<option selected disabled >Select Technician</option>";
                        for(i=0; i<techData.length; i++){
                            techResult += "<option value='" + techData[i].user_id + "'>" + techData[i].fname + " "+techData[i].lname+"</option>";
                        }
                        $( 'select[name="re_tech_id"]' ).append( techResult );


                    }     

                }
            } ,
            error: function(data) {
                //Your Error Message 
                console.log(data) 
                if(data.status == 401){
                    sessionOutMsg()

                }else{
                    console.log(data)
                    alert('Internal Error: Contact Administrator');
                }
            }
        });
    });

    $("#form_reassign").validate({
        onkeyup: function(element) {$(element).valid()},
        onkeydown : function(element) {$(element).valid()},
        onpaste : function(element) {$(element).valid()},
        oncontextmenu  : function(element) {$(element).valid()},
        oninput  : function(element) {$(element).valid()},
        rules: {
 
            re_tech_id:{
                required:true,
            }, 
            reassign_complaint_id:{
                required:true,
            }, 
        },
        messages: {                            

            action: "Please provide some data"
        },
        submitHandler: function(form)
        {
            reassign_comp();
        }
    });

    function reassign_comp(){
        var adddata = new FormData(document.getElementById("form_reassign"));            
        $.ajax({
            type : "POST",
            url  : api_base_url+'engineer/complaint/reassign',
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

    $('#example').on('click','.item_close',function(){

        var complaint_id = $(this).data('complaint_id');
        $('#comp_id').val(complaint_id);  

    });

    $('#close_bt').click( function(){
 
       var complaint_id = $('#comp_id').val();   
         alert(complaint_id)     
        $.ajax({
            type : "POST",
            url  : api_base_url+'engineer/complaint/close',
            dataType : "JSON",
            data : {complaint_id:complaint_id},
            
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
            assign_complaint_id:{
                required:true,
            }, 
        },
        messages: {                            

            action: "Please provide some data"
        },
        submitHandler: function(form)
        {
            assign_comp();
        }
    });

    function assign_comp(){
        var adddata = new FormData(document.getElementById("form_assign"));            
        $.ajax({
            type : "POST",
            url  : api_base_url+'engineer/complaint/assign',
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
}); 

function show_data(){
    $.ajax({
        method :'GET',
        url : api_base_url+'engineer/complaint/getList',  
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
                    if(data[i].status == 1){
                        var status =  '';
                        var btn =  '<a style="color:white;" class="btn btn-warning btn-sm item_assign" data-toggle="modal" data-target="#assign_modal" data-complaint_id="'+data[i].complaint_id+'" title="Assign">Assign</a>'; 
                    } else if(data[i].status ==2 ){
                        var status = ''; 
                        var btn =  '<a style="color:white;" class="btn btn-info btn-sm item_reassign" data-toggle="modal" data-target="#reassign_modal" data-complaint_id="'+data[i].complaint_id+'" title="Reassign">Reassign</a>'; 
                    }else if(data[i].status ==3 ){
                        var status = '';  
                        var btn = '<a style="color:white;" class="btn btn-success btn-sm item_close" data-toggle="modal" data-target="#close_modal" data-complaint_id="'+data[i].complaint_id+'" title="Close">Close</a>'; 
                    }else {
                        var status = 'Closed';  
                        var btn = ''; 
                     }
                     if(data[i].priority == 1){
                         var priority = 'Major';
                     }else if(data[i].priority == 2){
                         var priority = 'Medium';
                     }else if(data[i].priority == 3){
                         var priority = 'Minor';
                     } else {
                        var priority = '';
                    }   

                    html += '<tr>'+
                    '<td class="item_view text-center" data-complaint_id="'+data[i].complaint_id+'">'+sl_no+'</td>'+
                    '<td class="item_view text-center" data-complaint_id="'+data[i].complaint_id+'">'+data[i].complaint+'</td>'+ 
                    '<td >'+priority+ '</td>'+
                    '<td class="item_view text-center" data-complaint_id="'+data[i].complaint_id+'">'+data[i].assigned_technician+'</td>'+
                    '<td class="item_view text-center" data-complaint_id="'+data[i].complaint_id+'">'+data[i].technician+'</td>'+
                    '<td class="item_view text-center" data-complaint_id="'+data[i].complaint_id+'">'+data[i].remarks+'</td>'+
                    '<td class="item_view text-center" data-complaint_id="'+data[i].complaint_id+'">'+data[i].complaint_date+'</td>'+ 
                    '<td class="item_view text-center" data-complaint_id="'+data[i].complaint_id+'">'+status+'&nbsp;'+ btn+' </td>'+ 
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