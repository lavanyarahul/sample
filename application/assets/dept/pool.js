$(document).ready(function() {

  jQuery.validator.addMethod("noSpace", function(value, element) {
       return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

     show_data(); 

    function show_data(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'dept/pool/list_pool',
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
                    '<td class="item_view text-center"  data-pool_id="'+data[i].pool_id+'">'+sl_no+'</td>'+
                    '<td class="item_view text-center"  data-pool_id="'+data[i].pool_id+'"><div class="widget-content p-0"> <div class="widget-content-wrapper"> <div class="widget-content-left flex2"> <div class="widget-heading">'+data[i].pool_name+'</div>'+
                    '</div> </div> </div></td>'+
                    '<td class="item_view text-center"  data-pool_id="'+data[i].pool_id+'">'+data[i].pool_desc+'</td>'+
                    '<td >'+  
                    '<a style="color:white;" class="btn btn-danger btn-sm item_delete" data-toggle="modal" data-target="#delete_modal" data-pool_id="'+data[i].pool_id+'" title="Delete"><i class="ti-trash mr-0-5"></i>Delete</a>'+
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
$("#form_add").validate({
        onkeyup: function(element) {$(element).valid()},
        onkeydown : function(element) {$(element).valid()},
        onpaste : function(element) {$(element).valid()},
        oncontextmenu  : function(element) {$(element).valid()},
        oninput  : function(element) {$(element).valid()},
        rules: {

            pool_name:{
              required:true,
              noSpace: true,
              remote: {
                url  :  api_base_url+'validation/add_duplicate',
                data:{
                  data_add: function(){return $('input[name=pool_name]').val();},
                  colum_name: function(){return 'pool_name';},
                  table_name: function(){return 'pool';},

                },
                type : "POST"
              }
            },

        },
        messages: {

         pool_name:{

              remote:"Pool name already exist"
            },

            action: "Please provide some data"
        },
        submitHandler: function(form)
        {
          add_pool();
        }
  });

 //add pool
   function add_pool() {

      var adddata = new FormData(document.getElementById("form_add"));

      $.ajax({
          type : "POST",
          url  : api_base_url+'dept/pool/create',
          dataType : "JSON",
          data : adddata,
          async: false,
          processData: false,
          contentType: false,
            beforeSend: function(){
            $('#loader-section').fadeIn();
          },
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
            window.location.href = base_url+"dept/pool";

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


// delete pool - start

  $('#example').on('click','.item_delete',function(){

    var pool_id = $(this).data('pool_id');
    $('#id').val(pool_id);

  });

  $('#delete_bt').on('click',function(){

    var pool_id = $('#id').val();
    $.ajax({
        type : "POST",
        url  : api_base_url+'dept/pool/delete',
        dataType : "JSON",
        data : {pool_id:pool_id},
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

            window.location.href = base_url+"dept/pool/index";

        } ,
        error: function(data) {
            //Your Error Message
            console.log(data)
            alert('Internal Error: Contact Administrator');
        }
    });
  });

  // delete pool - end
  //
 $('#example').on('click','.item_view',function(){

    var pool_id = $(this).data('pool_id');
    window.location.href = base_url+"dept/pool/edit/"+pool_id;

  });


// enable to edit

  $('#btn_edit').on('click',function(){

      $('.disable').prop("disabled", false);
      document.getElementById("btn_edit").setAttribute("style", 'display:none');
      document.getElementById("btn_update").setAttribute("style", 'display:initial');

  });

  $("#form_update").validate({
        onkeyup: function(element) {$(element).valid()},
        onkeydown : function(element) {$(element).valid()},
        onpaste : function(element) {$(element).valid()},
        oncontextmenu  : function(element) {$(element).valid()},
        oninput  : function(element) {$(element).valid()},
        rules: {

            pool_name:{
              required:true,
              noSpace: true,
              remote: {
                url  :  api_base_url+'validation/edit_duplicate',
                data:{
                  data_edit: function(){return $('input[name=pool_name]').val();},
                  id: function(){return $('input[name=pool_id]').val();},
                  colum_name: function(){return 'pool_name';},
                  table_name: function(){return 'pool';},
                  table_id: function(){return 'pool_id';},

                },
                type : "POST"
              }
            },

        },
        messages: {

            pool_name:{
              remote:"Department name already exist",
            },

            action: "Please provide some data"
        },
        submitHandler: function(form){
          update_pool();
        }
    });


    function update_pool() {

      var adddata = new FormData(document.getElementById("form_update"));
      $.ajax({
          type : "POST",
          url  : api_base_url+'dept/pool/update',
          dataType : "JSON",
          data : adddata,
          async: false,
            processData: false,
            contentType: false, 
            headers: {
                "auth-key":"simplerestapi",
                'client-service' : "frontend-client",
                'User-ID' : window.localStorage.getItem('user_id'),
                'Branch-ID' : window.localStorage.getItem('dept_id'),
                'Dept-ID' : window.localStorage.getItem('dept_id'),
                'Authorization' : window.localStorage.getItem('token'),
                // more as you need
            },
          success: function(data){

            console.log(data);
            window.location.href = base_url+"dept/pool";

          },
          error: function(data) {
              //Your Error Message
              console.log(data)
              alert('Something went wrong: Contact Support');

          }
      });
    }

  });


// end document ready
 
function getData(pool_id){
    $.ajax({
        url  : api_base_url+'dept/pool/detail/'+pool_id,
        method : 'POST',
        data:{'pool_id':pool_id},
        dataType : 'json', 
        headers: {
            "auth-key":"simplerestapi",
            'client-service' : "frontend-client",
            'User-ID' : window.localStorage.getItem('user_id'),
            'Branch-ID' : window.localStorage.getItem('dept_id'),
            'Dept-ID' : window.localStorage.getItem('dept_id'),
            'Authorization' : window.localStorage.getItem('token'),
            // more as you need
        }, 
        success: function(data){

            console.log(data) 
            $('[name="pool_name"]').val(data.pool_name);  
            $('[name="pool_desc"]').val(data.pool_desc);   
            $('select#select_eng option[value='+data.assign_to+']').attr('selected','selected');
            $('[name="pool_id"]').val(data.pool_id);  

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
