$(document).ready(function() {
    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

    show_data(); 

    function show_data(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'engineer/breakdown/list_breakdown',
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
                var pool_html = '';
                var i;
                for(i=0; i<data.length; i++){

                    var sl_no = i+1;
                    if(data[i].status == 1){
                        var status = 'Pending';
                    }else{
                        var status = 'Completed';
                    }
                    html += '<tr>'+
                    '<td class="item_view text-center" data-checklist_id="'+data[i].checklist_id+'" data-track_id="'+data[i].track_id+'">'+sl_no+'</td>'+
                    '<td class="item_view text-center" data-checklist_id="'+data[i].checklist_id+'" data-track_id="'+data[i].track_id+'"><div class="widget-content p-0"> <div class="widget-content-wrapper"> <div class="widget-content-left flex2"> <div class="widget-heading">'+data[i].ride_name+'</div>'+
                    '  </div> </div> </div></td>'+
                    '<td class="item_view text-center" data-checklist_id="'+data[i].checklist_id+'" data-track_id="'+data[i].track_id+'">'+data[i].complaint+'</td>'+  
                    '<td class="item_view text-center" data-checklist_id="'+data[i].checklist_id+'" data-track_id="'+data[i].track_id+'">'+data[i].comment+'</td>'+  
                    '<td class="item_view text-center" data-checklist_id="'+data[i].checklist_id+'" data-track_id="'+data[i].track_id+'">'+data[i].fname+' '+data[i].lname+'</td>'+  
                    '<td class="item_view text-center" data-checklist_id="'+data[i].checklist_id+'" data-track_id="'+data[i].track_id+'">'+data[i].created_datetime+'</td>'+       
                    '<td >'+ status+'</td>'+
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

    $('#example').on('click','.item_view',function(){

        var checklist_id = $(this).data('checklist_id');
        var   track_id  = $(this).data('track_id');
        window.location.href = base_url+"engineer/checklist/view/"+checklist_id+'/'+track_id;

    });
});