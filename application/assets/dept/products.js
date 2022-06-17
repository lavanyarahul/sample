$(document).ready(function() {

    jQuery.validator.addMethod("noSpace", function(value, element) {
        return value == '' || value.trim().length != 0;
    }, " Blank spaces at beginning is invalid");

    show_data(); 

    function show_data(){
        $.ajax({
            method :'GET',
            url  : api_base_url+'dept/products/list_product',
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
                console.log(data)  
                var html = '';
                var i;

                for(i=0; i<data.length; i++){
                    var sl_no = i+1;
                    html += '<tr>'+
                    '<td class="item_view text-center"  data-product_id="'+data[i].product_id+'">'+sl_no+'</td>'+
                    '<td class="item_view text-center"  data-product_id="'+data[i].product_id+'"><div class="widget-content p-0"> <div class="widget-content-wrapper"> <div class="widget-content-left flex2"> <div class="widget-heading">'+data[i].product_name+'</div>'+
                    '</div> </div> </div></td>'+
                    '<td class="item_view text-center"  data-product_id="'+data[i].product_id+'">'+data[i].quantity+'</td>'+
                    '<td class="item_view text-center"  data-product_id="'+data[i].product_id+'">'+data[i].category_name+'</td>'+
                    '<td >'+  
                    '<a style="color:white;" class="btn btn-danger btn-sm item_delete" data-toggle="modal" data-target="#delete_modal" data-product_id="'+data[i].product_id+'" title="Delete"><i class="ti-trash mr-0-5"></i>Delete</a>'+
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

            product_name:{
                required:true,
                noSpace: true,
                remote: {
                    url  :  api_base_url+'validation/add_duplicate',
                    data:{
                        data_add: function(){return $('input[name=product_name]').val();},
                        colum_name: function(){return 'product_name';},
                        table_name: function(){return 'products';},

                    },
                    type : "POST"
                }
            },
            description:{
                noSpace: true,
            },
            quantity:{
                required:true,
                noSpace: true,
            },
            // unit:{
            //     required:true,
            //     noSpace: true,
            // },
            select_category:{
                required:true,
            },
            select_unit:{
                required:true,
            },
            ignore:[],
            'select_dept[]':{
                required:true,
            },
            // unit_price:{
            //     required:true,
            //     noSpace: true,
            // },
            budget_amount:{

                noSpace: true,
            },
            serial_no:{

                noSpace: true,
            },
            brand:{

                noSpace: true,
            },
            model:{

                noSpace: true,
            },
        },

        messages: {

            product_name:{

                remote: "Product already exist "
            },

            action: "Please provide some data"
        },
        submitHandler: function(form) { add_products(); }
    });

    //add products
    function add_products() {

        var adddata = new FormData(document.getElementById("form_add"));

        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/products/create',
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
                window.location.href = base_url+"dept/products";

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

    //end of add products

    // delete products - start

    $('#example').on('click','.item_delete',function(){

        var product_id = $(this).data('product_id');
        $('#id').val(product_id);

    });

    $('#delete_bt').on('click',function(){

        var product_id = $('#id').val();
        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/products/delete',
            dataType : "JSON",
            data : {product_id:product_id},
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

                window.location.href = base_url+"dept/products/index";

            } ,
            error: function(data) {
                //Your Error Message
                console.log(data)
                alert('Internal Error: Contact Administrator');
            }
        });
    });

    // delete products - end

    $('#example').on('click','.item_view',function(){

        var product_id = $(this).data('product_id');
        window.location.href = base_url+"dept/products/edit/"+product_id;

    });
    //for text area

    $('.item_view').click(function () {
        $('textarea').attr('disabled', 'disabled');
    });

    $('#btn_edit').click(function () {
        $('textarea').removeAttr('disabled');
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

            product_name:{
                required:true,
                noSpace: true,
                remote: {
                    url  :  api_base_url+'validation/edit_duplicate',
                    data:{
                        data_edit: function(){return $('input[name=product_name]').val();},
                        id: function(){return $('input[name=product_id]').val();},
                        colum_name: function(){return 'product_name';},
                        table_name: function(){return 'products';},
                        table_id: function(){return 'product_id';},

                    },
                    type : "POST"
                }
            },

            description:{
                noSpace: true,
            },
            quantity:{
                required:true,
                noSpace: true,
            },
            // unit:{
            //     required:true,
            //     noSpace: true,
            // },
            select_unit:{
                required:true,
            },
            select_category:{
                required:true,
            },
            // unit_price:{
            //     required:true,
            //     noSpace: true,
            // },
            budget_amount:{

                noSpace: true,
            },
            serial_no:{

                noSpace: true,
            },
            brand:{

                noSpace: true,
            },
            model:{

                noSpace: true,
            },
            ignore:[],
            'select_dept[]':{
                required:true,
            },
        },
        messages: {

            product_name:{
                remote:"Product already exist",
            },

            action: "Please provide some data"
        },
        submitHandler: function(form){
            update_products();
        }
    });

    function update_products() {

        var adddata = new FormData(document.getElementById("form_update"));
        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/products/update',
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
                window.location.href = base_url+"dept/products";

            },
            error: function(data) {
                //Your Error Message
                console.log(data)
                alert('Something went wrong: Contact Support');

            }
        });
    }

    $('#example').on('click','.item_return',function(){

        var product_id = $(this).data('product_id');
        $('#product_id').val(product_id);
        var track_id = $(this).data('track_id');
        $('#track_id').val(track_id);
        var quantity = $(this).data('quantity');
        $('#quantity').val(quantity);
        var return_qty = $(this).data('return_qty');
        $('#return_qty').val(return_qty);

    });

    $('#returnBtn').on('click',function(){

        var product_id = $('#product_id').val();
        var track_id = $('#track_id').val();
        var return_count = $('#return_count').val();
        var remarks = $('#remarks').val();
        $.ajax({
            type : "POST",
            url  : api_base_url+'dept/issue_product/return_products',
            dataType : "JSON",
            data : {product_id:product_id,track_id:track_id,return_count:return_count,remarks:remarks},
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

                window.location.href = base_url+"dept/issue_product/issue_products";

            } ,
            error: function(data) {
                //Your Error Message
                console.log(data)
                alert('Internal Error: Contact Administrator');
            }
        });
    });
});
function checkCount(val){
    var quantity = $('#quantity').val();
    var return_qty = $('#return_qty').val();
    var qty = quantity-return_qty;
    if(val>qty){
        document.getElementById("retrunError").setAttribute("style", 'display:flex');  
        $('#errorFlag').val(1);
    } else{
        $('#errorFlag').val(0);
    }
}
// end document ready

function getDropdownData(){
    $.ajax({
        method :'GET',
        url  : api_base_url+'dept/products/getData',
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

            if($('#select_dept').length > 0){
                deptData = data.dept_list;
                $('#select_dept').empty();
                var deptResult = '';
                for(i=0; i<deptData.length; i++){
                    deptResult += "<option value='" + deptData[i].dept_id + "'>" + deptData[i].dept_name + "</option>";
                }
                $( 'select[name="select_dept[]"]' ).append( deptResult ); 
                var select = document.getElementById("select_dept");
                multi(select, {
                    non_selected_header: "Department",
                    selected_header: "Selected Department"
                });
            }    
            if($('#select_category').length > 0){
                categoryData = data.category_list;
                $('#select_category').empty();
                var categoryResult = '';
                document.getElementById('select_category').innerHTML='<option value="0" selected disabled>Select Category </option>';
                for(i=0; i<categoryData.length; i++){
                    categoryResult += "<option value='" + categoryData[i].category_id + "'>" + categoryData[i].category_name+"</option>";
                }
                $( 'select[name="select_category"]' ).append( categoryResult ); 
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
function getData(product_id){
    $.ajax({
        url  : api_base_url+'dept/products/detail/'+product_id,
        method : 'POST',
        data:{'product_id':product_id},
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
        success: function(res){
            var data = res.pdt_data;
            console.log(data) 
            $('[name="product_name"]').val(data.product_name);  
            $('[name="description"]').val(data.description);   
            $('[name="select_unit"]').val(data.unit);   
            $('[name="quantity"]').val(data.quantity);  
            var select_category = document.getElementById('select_category');
            select_category.value = data.category_id; 
            $('[name="unit_price"]').val(data.unit_price);   
            $('[name="serial_no"]').val(data.serial_no);   
            $('[name="brand"]').val(data.brand);   
            $('[name="select_model"]').val(data.model);   
            $('[name="product_id"]').val(data.product_id);  

            if($('#select_dept_edit').length > 0){
                deptData = res.dept_list;
                $('#select_dept_edit').empty();
                var deptResult = '';
                for(i=0; i<deptData.length; i++){
                    deptResult += "<option value='" + deptData[i].dept_id + "'>" + deptData[i].dept_name + "</option>";
                }
                $( 'select[name="select_dept_edit[]"]' ).append( deptResult ); 
                $('#select_dept_edit').html(res.options);
                var select = document.getElementById("select_dept_edit");
                multi(select, {
                    non_selected_header: "Department",
                    selected_header: "Selected Department"
                });
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