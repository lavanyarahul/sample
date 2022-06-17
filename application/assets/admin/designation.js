$(document).ready(function() {

  jQuery.validator.addMethod("noSpace", function(value, element) {
       return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

     show_data(); 

    function show_data(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'admin/designation/list_designation',
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
                    '<td class="item_view"  data-desig_id="'+data[i].desig_id+'">'+sl_no+'</td>'+
                    '<td class="item_view"  data-desig_id="'+data[i].desig_id+'">'+data[i].desig_name+'</td>'+
                    '<td >'+  
                    '<a style="color:white;" class="btn btn-danger btn-sm item_delete" data-toggle="modal" data-target="#delete_modal" data-desig_id="'+data[i].desig_id+'" title="Delete"><i class="ti-trash mr-0-5"></i>Delete</a>'+
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

            desig_name:{
              required:true,
              noSpace: true,
              remote: {
                url  :  api_base_url+'validation/add_duplicate',
                data:{
                  data_add: function(){return $('input[name=desig_name]').val();},
                  colum_name: function(){return 'desig_name';},
                  table_name: function(){return 'designation';},

                },
                type : "POST"
              }
            },

        },
        messages: {

         desig_name:{

              remote:"Designation already exist"
            },

            action: "Please provide some data"
        },
        submitHandler: function(form)
        {
          add_designation();
        }
  });

 //add designation
   function add_designation() {

      var adddata = new FormData(document.getElementById("form_add"));

      $.ajax({
          type : "POST",
          url  : api_base_url+'admin/designation/create',
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
            window.location.href = base_url+"admin/designation";

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

//end of add designation


// delete desig - start

  $('#example').on('click','.item_delete',function(){

    var desig_id = $(this).data('desig_id');
    $('#id').val(desig_id);

  });

  $('#delete_bt').on('click',function(){

    var desig_id = $('#id').val();
    $.ajax({
        type : "POST",
        url  : api_base_url+'admin/designation/delete',
        dataType : "JSON",
        data : {desig_id:desig_id},
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

            window.location.href = base_url+"admin/designation/index";

        } ,
        error: function(data) {
            //Your Error Message
            console.log(data)
            alert('Internal Error: Contact Administrator');
        }
    });
  });

  // delete designation - end
  //
 $('#example').on('click','.item_view',function(){

    var desig_id = $(this).data('desig_id');
    window.location.href = base_url+"admin/designation/edit_designation/"+desig_id;

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

            desig_name:{
              required:true,
              noSpace: true,
              remote: {
                url  :  api_base_url+'validation/edit_duplicate',
                data:{
                  data_edit: function(){return $('input[name=desig_name]').val();},
                  id: function(){return $('input[name=desig_id]').val();},
                  colum_name: function(){return 'desig_name';},
                  table_name: function(){return 'designation';},
                  table_id: function(){return 'desig_id';},

                },
                type : "POST"
              }
            },

        },
        messages: {

            desig_name:{
              remote:"Designation already exist",
            },

            action: "Please provide some data"
        },
        submitHandler: function(form){
          update_designation();
        }
    });


    function update_designation() {

      var adddata = new FormData(document.getElementById("form_update"));
      $.ajax({
          type : "POST",
          url  : api_base_url+'admin/designation/update',
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

            console.log(data);
            window.location.href = base_url+"admin/designation";

          },
          error: function(data) {
              //Your Error Message
              console.log(data)
              alert('Something went wrong: Contact Support');

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


});
function getDesigData(desig_id){
    $.ajax({
        method :'POST',
        url  : api_base_url+'admin/designation/detail',
        data:{'desig_id':desig_id},
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
            console.log(data)  
            $('[name="desig_name"]').val(data.desig_name);  
            $('[name="desig_id"]').val(data.desig_id);  

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

// end document ready
