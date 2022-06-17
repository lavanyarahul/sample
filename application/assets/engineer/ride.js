function list_active(){
    $.ajax({
        method :'GET',
        url  : api_base_url+'engineer/ride/list_active',
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

           var brkdwn_rides= data.brkdwn_rides;  
        //   var active_rides= data.active_rides; 

            for(i=0; i<brkdwn_rides.length; i++){
                if( brkdwn_rides[i].operational_status == 1) {
                    var wp_status ='<a style="color:white; padding: 4px;" class="btn btn-danger btn-sm" title="Not Accepted">Not Working</a>'
                }else{
                    var wp_status ='<a style="color:white;padding: 4px;" class="btn btn-success btn-sm" title="Accepted">Working</a>' 
                } 
                var sl_no = i+1;
                html += '<tr>'+
                '<td class="item_view "  data-ride_id="'+brkdwn_rides[i].ride_id+'">'+sl_no+'</td>'+ 
                '<td class="item_view "  data-ride_id="'+brkdwn_rides[i].ride_id+'">'+brkdwn_rides[i].ride_name+'</td>'+
                '<td class="item_view "  data-ride_id="'+brkdwn_rides[i].ride_id+'">'+brkdwn_rides[i].branch_name+'</td>'+
                '<td class="item_view "  data-ride_id="'+brkdwn_rides[i].ride_id+'">'+wp_status+'</td>'+ 
                '</tr>';
            }
            // for(i=0; i<active_rides.length; i++){
            //     if( active_rides[i].operational_status == 1) {
            //         var wp_status ='<a style="color:white; padding: 4px;" class="btn btn-danger btn-sm" title="Not Accepted">Not Working</a>'
            //     }else{
            //         var wp_status ='<a style="color:white;padding: 4px;" class="btn btn-success btn-sm" title="Accepted">Working</a>' 
            //     } 
            //       sl_no = sl_no+1;
            //     html += '<tr>'+
            //     '<td class="item_view "  data-ride_id="'+active_rides[i].ride_id+'">'+sl_no+'</td>'+ 
            //     '<td class="item_view "  data-ride_id="'+active_rides[i].ride_id+'">'+active_rides[i].ride_name+'</td>'+
            //     '<td class="item_view "  data-ride_id="'+active_rides[i].ride_id+'">'+active_rides[i].branch_name+'</td>'+
            //     '<td class="item_view "  data-ride_id="'+active_rides[i].ride_id+'">'+wp_status+'</td>'+ 
            //     '</tr>';
            // }
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