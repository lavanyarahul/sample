
$(document).ready(function() {
        
	$('#upload_file').on('change',function(){
 		var adddata = new FormData(document.getElementById("upload_bulk"));
        var up_file = $('#upload_file').val();
        if (up_file) {
            $('#error_msg').html('');

            $.ajax({
                type: 'POST',
                url: api_base_url+'engineer/schedule/upload',
                dataType: 'JSON',
                data: adddata,
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
                success:function (data) {
                    if(data.status == 401){
                        sessionOutMsg() 
                    }
                    // window.location.href=base_url+'admin/user' ;   
                        $('#error_msg').html("Schedule details successfully uploaded");
                        var timePeriodInMs = 4000; 
                        setTimeout(function() 
                        { 
                            document.getElementById("error_msg").style.display = "none"; 
                            window.location.reload();
                        }, 
                        timePeriodInMs);
                    
                },
                error:function (data) {
                    console.log(data);
                    alert("Internal Error: Contact Administrator");
                }
            });
        }else{
            $('#error_msg').html('Please select one file to upload');
        }
		
	});
  
});

 
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