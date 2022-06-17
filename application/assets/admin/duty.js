function show_data(){
    $.ajax({
        method :'GET',
        url : api_base_url+'admin/duty/getList',  
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
                console.log(data)  
                var html = '';
                var i;
                var wp_status ='';
                
                for(i=0; i<data.length; i++){
                   
                    var sl_no = i+1;
                    html += '<tr>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+sl_no+'</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+data[i].ride_name+'</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+data[i].engineer_name+'</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+data[i].technician_names+'</td>'+
                    '<td class="item_view text-center" data-schedule_id="'+data[i].schedule_id+'">'+data[i].tech_assistant_names+'</td>'+
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