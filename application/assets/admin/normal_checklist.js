var dupCheckArray = [];
var tr_count = 0;
var tr_count_edit = 0;

function removeArrayValue(arr) {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}

function findValueInArray(value, arr) {
  var result = true;

  for (var i = 0; i < arr.length; i++) {
    var name = arr[i].trim();
    if (name == value) {
      result = false;
      break;
    }
  }

  return result;
}

function checkDaily(frequency) {
  if (frequency == 2) {
    $("#checklist_recurrence_div").css("display", "block");
  } else {
    $("#checklist_recurrence_div").css("display", "none");
  }
}

function checkDailyEdit(frequency) {
  if (frequency == 2) {
    $("#checklist_recurrence_editdiv").css("display", "block");
  } else {
    $("#checklist_recurrence_editdiv").css("display", "none");
    $('[name="checklist_recurrence_edit"]').val("");
  }
}

function getSupervisors(checklist_id) {
  $.ajax({
    type: "POST",
    url: base_url + "admin/checklist/list_supervisors",
    async: false,
    dataType: "json",
    data: { checklist_id: checklist_id },
    success: function (data) {
      console.log(data);
      var result = "";
      $("#supervisor_id").empty();
      document.getElementById("supervisor_id").innerHTML =
        '<option value="0" selected disabled>Select Supervisor</option>';
      for (i = 0; i < data.length; i++) {
        result +=
          "<option value='" +
          data[i].user_id +
          "'>" +
          data[i].supervisor_name +
          "</option>";
      }
      $('select[name="supervisor_id"]').append(result);
    },
    error: function (data) {
      console.log(data);
      alert("Internal Error: Contact Administrator");
    },
  });
}
function popUp(img, obj) {
  var img = document.getElementById(img);
  var modalImg = document.getElementById("img01");

  $("#myModal").modal("show");

  modalImg.src = obj.src;

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    $("#myModal").modal("hide");
  };
}

$(document).ready(function () {
  //add hr form validation rules

  function hideLoader() {
    $(".loading").css("display", "none");
  }
  function showLoader() {
    $(".loading").css("display", "block");
  }
  function disableButton(btnID, msg) {
     $("#" + btnID).attr("disabled", "disabled");
    $("#" + btnID).html('<i class="fa fa-circle-o-notch fa-spin"></i> ' + msg);
  }
  function enableButton(btnID, msg) {
    $("#" + btnID).removeAttr("disabled");
    $("#" + btnID).html(msg);
  }
  $("#addchecklistForm").validate({
    rules: {
      checklist_name: {
        required: true,
      },
      checklist_frequency: {
        required: true,
      },
    },
    submitHandler: function () {
      addchecklist();
    },
  });
  $("#editchecklistForm").validate({
    rules: {
      checklist_name: {
        required: true,
      },
      checklist_frequency: {
        required: true,
      },
    },
    submitHandler: function () {
      editchecklist();
    },
  });

  //Save product
  function addchecklist() {
    disableButton("btn_save", "Updating");
      var addData = new FormData(document.getElementById("addchecklistForm"));
    $.ajax({
        type : "POST",
        url  : api_base_url+'admin/ride_checklist/create_normal_checklist',
        dataType : "JSON", 
        data: addData,
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
      success: function (data) {
       var type = $("#type").val();
       if(type == 1)
        location.href = base_url + "admin/ride_checklist";
        else
        location.href = base_url + "admin/pool_checklist";
      },
      error: function (data) {
        //Your Error Message
        console.log(data);
        alert("Internal Error: Contact Administrator");
      },
    });
  }

  //get data for update record
  $("#btn_edit").on("click", function () {
    $("#ModalView").modal("hide");
    $("#Edit_checklist").modal("show");
  });

  //update record to database
  function editchecklist() {
    disableButton("btn_update", "Updating");
    var editData = new FormData(document.getElementById("editchecklistForm"));
    $.ajax({
      type: "POST",
      url: base_url + "admin/checklist/update_normal_checklist",
      dataType: "JSON",
      data: editData,
      async: false,
      processData: false,
      contentType: false,
      success: function (data) {
        location.href = base_url + "admin/checklist";
      },
      error: function (data) {
        //Your Error Message
        console.log(data);
        alert("Internal Error: Contact Administrator");
      },
    });
  }

  //get data for delete record
  $("#show_data").on("click", ".item_delete", function () {
    var checklist_id = $(this).data("checklist_id");

    $("#Modal_Delete").modal("show");
    $('[name="checklist_id"]').val(checklist_id);
  });

  //delete record to database

  $("#btn_delete").on("click", function () {
    disableButton("btn_delete", "Deleting");
    var checklist_id = $("#checklist_id").val();
    $.ajax({
      type: "POST",
      url: base_url + "admin/checklist/delete_checklist",
      dataType: "JSON",
      data: { checklist_id: checklist_id },
      success: function (data) {
        location.reload();
      },
      error: function (data) {
        //Your Error Message
        console.log(data);
        alert("Internal Error: Contact Administrator");
      },
    });
    return false;
  });

  $(".add-row").click(function () {
    var checklist = $("#checklist").val().trim();
    var checklist2 = $("#checklist2").val().trim();
    var checklist3 = $("#checklist3").val().trim();
      
    var check_dup = checklist.toLowerCase();
    
    var checklist_type = document.querySelectorAll(
      "input[name=checklist_type]:checked"
    )[0].value;

    if (checklist_type == 1) {
      type_text = "Checkbox";
    } else if (checklist_type == 2) {
      type_text = "Textbox";
    } else {
      type_text = "None";
    }
    var length = checklist.length;
    
    var flag = 0;
    
    if (checklist != null && checklist != "" && length != 0) {
      
          var tr_count = $("#checkListTbl tbody tr").length;
          if (tr_count > 0) {
            $("#checkListTbl tbody tr").each(function () {
              if ($(this).find("td").find('input[name="check_list[]"]').val()) {
                val = $(this).find("td").find('input[name="check_list[]"]').val().toLowerCase();
                type = $(this).find("td").find('input[name="check_type[]"]').val();
                if (val === check_dup && checklist_type === type) {
                  flag = 1;
                }
              } else {
                val = $(this).find("td").find('input[name="check_list_new[]"]').val().toLowerCase(); 
                type = $(this).find("td").find('input[name="check_type_new[]"]').val();
                if (val === check_dup && checklist_type === type) {
                  flag = 1;
                }
              }
            });
          }
          if (flag == 0) {
            $("#checklist-error").css("display", "none");
            var markup ="<tr><td>" +'<input type="hidden" name="check_list_new[]" value="' +
              checklist +'" />' +checklist +"</td> " +
              "<td>" +'<input type="hidden" name="check_list_new2[]" value="' +checklist2 +'" />' +
              checklist2 +"</td>" +
              "<td>" +'<input type="hidden" name="check_list_new3[]" value="' +checklist3 +'" />' +
              checklist3 +"</td>" + 
              "<td>" +'<input type="hidden" name="check_type_new[]" value="' +checklist_type +'" />' +
              type_text +"</td>" +
              '<td><a href="javascript:void(0);" class="btn btn-link btn-danger btn-just-icon checklist_delete">' +
              '<i class="mdi mdi-delete material-icons"></i></a></td>' +
              "</tr>";
            $("#checkListTbl tbody").append(markup);
            $(".rmVal").val(""); 
            dupCheckArray.push(check_dup);
            tr_count = tr_count + 1;
          } else {
            $("#checklist-error").css("display", "block");
            $('label[id*="checklist-error"]').text("Duplicate Checklist");
          } 
    } else {
      $("#checklist-error").css("display", "block");
      $('label[id*="checklist-error"]').text("Part is required");
    }
  });
  $(".add-row-edit").click(function () {
    var checklist = $("#checklist_edit").val().trim();
    var check_dup = checklist.toLowerCase();
    var length = checklist.length;
    var checklist_type = document.querySelectorAll(
      "input[name=checklist_type_edit]:checked"
    )[0].value;
    if (checklist_type == 1) {
      type_text = "Checkbox";
    } else if (checklist_type == 2) {
      type_text = "Textbox";
    } else {
      type_text = "";
    }
    var flag = 0;
    if (checklist != null && checklist != "" && length != 0) {
      var tr_count = $("#checkListTbl tbody tr").length;
      if (tr_count > 0) {
        $("#checkListTbl tbody tr").each(function () {
          if ($(this).find("td").find('input[name="check_list[]"]').val()) {
            val = $(this)
              .find("td")
              .find('input[name="check_list[]"]')
              .val()
              .toLowerCase();
            type = $(this).find("td").find('input[name="check_type[]"]').val();
            if (val === check_dup && checklist_type === type) {
              flag = 1;
            }
          } else {
            val = $(this)
              .find("td")
              .find('input[name="check_list_new[]"]')
              .val()
              .toLowerCase();
            type = $(this)
              .find("td")
              .find('input[name="check_type_new[]"]')
              .val();
            if (val === check_dup && checklist_type === type) {
              flag = 1;
            }
          }
        });
      }

      if (flag == 0) {
        $("#checklist_edit-error").css("display", "none");
        var markup =
          '<tr><td><input type="hidden" name="check_list_new[]" value="' +
          checklist +
          '" />' +
          checklist +
          "</td>" +
          "<td>" +
          '<input type="hidden" name="check_type_new[]" value="' +
          checklist_type +
          '" />' +
          type_text +
          "</td>" +
          '<td><a href="javascript:void(0);" class="btn btn-link btn-danger btn-just-icon checklist_edit_delete"><i class="material-icons">close</i></a></td></tr>';
        $("#checkListEditTbl tbody").append(markup);
        $("#checklist_edit").val("");
        dupCheckArray.push(check_dup);
        tr_count_edit = tr_count_edit + 1;
      } else {
        $("#checklist_edit-error").css("display", "block");
        $('label[id*="checklist_edit-error"]').text("Duplicate Checklist");
      }
    } else {
      $("#checklist_edit-error").css("display", "block");
      $('label[id*="checklist_edit-error"]').text(
        "Checklist criteria is required"
      );
    }
  });

  $("#checkListTbl").on("click", "tr a.checklist_delete", function (e) {
    e.preventDefault();
    var val;
    $(this)
      .closest("tr")
      .find("input")
      .each(function () {
        val = this.value.toLowerCase();
      });
    removeArrayValue(dupCheckArray, val);
    $(this).closest("tr").remove();
  });

  $("#checkListEditTbl").on(
    "click",
    "tr a.checklist_edit_delete",
    function (e) {
      e.preventDefault();
      var val;
      $(this)
        .closest("tr")
        .find("input")
        .each(function () {
          val = this.value.toLowerCase();
        });
      removeArrayValue(amcDupCheckArray, val);
      var checklist_id = $(this)
        .parents("tr")
        .find('input[type="hidden"][name="check_list_id"]')
        .val();
      removeChecklist(checklist_id);
      $(this).closest("tr").remove();
    }
  );

  $("#label1").change(function(){
    var label1_txt = $("#label1").val().trim();
     $(".label1_txt").text(label1_txt);
  });
  $("#label2").change(function(){
    var label2_txt = $("#label2").val().trim();
     $(".label2_txt").text(label2_txt);
  });
  $("#label3").change(function(){
    var label3_txt = $("#label3").val().trim();
     $(".label3_txt").text(label3_txt);
  });
  $("#label4").change(function(){
    var label4_txt = $("#label4").val().trim();
     $(".label4_txt").text(label4_txt);
  }); 
  $("#label5").change(function(){
    var label5_txt = $("#label5").val().trim();
     $(".label5_txt").text(label5_txt);
  });
});

function getChecklist(checklist_id) {
  $.ajax({
    type: "POST",
    url: base_url + "admin/checklist/get_criteria",
    data: { checklist_id: checklist_id },
    async: false,
    dataType: "json",
    success: function (data) {
      checklist = data;
    },
    error: function (data) {
      //Your Error Message
      console.log(data);
      alert("Internal Error: Contact Administrator");
    },
  });
  return checklist;
}

function removeChecklist(checklist_id) {
  $.ajax({
    type: "POST",
    url: base_url + "admin/checklist/remove_criteria",
    data: { checklist_id: checklist_id },
    async: false,
    dataType: "json",
    success: function (data) {},
    error: function (data) {
      //Your Error Message
      console.log(data);
      alert("Internal Error: Contact Administrator");
    },
  });
}

function checklist_delete_edit(tr_id, tbl, checklist_id) {
  $("#del_tr_id").val(tr_id);
  $("#del_tbl_id").val(tbl);
  $("#del_checklist_id").val(checklist_id);
  $("#Modal_Checklist_Delete").modal("show");
}

$("#btn_delete_checklist").on("click", function () {
  var del_tr_id = $("#del_tr_id").val();
  var del_tbl_id = $("#del_tbl_id").val();
  var del_checklist_id = $("#del_checklist_id").val();

  $("#" + del_tbl_id)
    .closest("table")
    .find("tbody > tr")
    .each(function () {
      var idr = this.id;
      if (idr == del_tr_id) {
        $(this).remove();
        removeChecklist(del_checklist_id);
        $("#Modal_Checklist_Delete").modal("hide");
      }
    });
});
