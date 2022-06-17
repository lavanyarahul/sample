function getData(branch_id){
    $.ajax({
        method :'GET',
        url  : api_base_url+'engineer/dashboard/get_data',
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
            //console.log(data)  
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
                var completed_checklist_count = data.completed_checklist_count;
                $('.totalCom').html(parseInt(completed_checklist_count[0].ride)+parseInt(completed_checklist_count[0].pool));  
                $('.rideCom').html('Ride <br>'+completed_checklist_count[0].ride);  
                $('.poolCom').html('Pool <br>'+completed_checklist_count[0].pool); 

                var pending_checklist_count = data.pending_checklist_count;
                $('.totalPen').html(parseInt(pending_checklist_count[0].ride)+parseInt(pending_checklist_count[0].pool));  
                $('.ridePen').html('Ride <br>'+pending_checklist_count[0].ride);  
                $('.poolPen').html('Pool <br>'+pending_checklist_count[0].pool);  

                $('.totalComplaints').html(parseInt(data.breakdown_count)+parseInt(data.operational_count));  
                $('.brkdwn').html('Breakdown <br>'+data.breakdown_count);  
                $('.others').html('Others <br>'+data.operational_count);  

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

var labelData=[];
var totalData=[];
var rideData=[];
var poolData=[];
(function($) {
    'use strict';
    $(function() {
      
        $.ajax({
            method :'GET',
            url  : api_base_url+'engineer/dashboard/get_chart_data',
             dataType : 'json', 
             async: false ,
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
                 //console.log(data)  
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
                    console.log(data)
                    for(var i=0; i<data.length; i++){
                        labelData[i] = data[i].dy;
                        totalData[i] = data[i].total;
                        rideData[i] = data[i].pending;
                        poolData[i] = data[i].completed;
                    }
                    console.log(labelData)  
    
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

      Chart.defaults.global.legend.labels.usePointStyle = true;

      if ($("#visit-sale-chart").length) {
        Chart.defaults.global.legend.labels.usePointStyle = true;
        var ctx = document.getElementById('visit-sale-chart').getContext("2d");
  
        var gradientStrokeViolet = ctx.createLinearGradient(0, 0, 0, 181);
        gradientStrokeViolet.addColorStop(0, 'rgba(218, 140, 255, 1)');
        gradientStrokeViolet.addColorStop(1, 'rgba(154, 85, 255, 1)');
        var gradientLegendViolet = 'linear-gradient(to right, rgba(218, 140, 255, 1), rgba(154, 85, 255, 1))';
        
        var gradientStrokeBlue = ctx.createLinearGradient(0, 0, 0, 360);
        gradientStrokeBlue.addColorStop(0, 'rgba(54, 215, 232, 1)');
        gradientStrokeBlue.addColorStop(1, 'rgba(177, 148, 250, 1)');
        var gradientLegendBlue = 'linear-gradient(to right, rgba(54, 215, 232, 1), rgba(177, 148, 250, 1))';
  
        var gradientStrokeRed = ctx.createLinearGradient(0, 0, 0, 300);
        gradientStrokeRed.addColorStop(0, 'rgba(255, 191, 150, 1)');
        gradientStrokeRed.addColorStop(1, 'rgba(254, 112, 150, 1)');
        var gradientLegendRed = 'linear-gradient(to right, rgba(255, 191, 150, 1), rgba(254, 112, 150, 1))';
  
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: labelData,
              datasets: [
                {
                  label: "Total Checklist",
                  borderColor: gradientStrokeViolet,
                  backgroundColor: gradientStrokeViolet,
                  hoverBackgroundColor: gradientStrokeViolet,
                  legendColor: gradientLegendViolet,
                  pointRadius: 0,
                  fill: false,
                  borderWidth: 1,
                  fill: 'origin',
                  data: totalData
                },
                {
                  label: "Completed",
                  borderColor: gradientStrokeRed,
                  backgroundColor: gradientStrokeRed,
                  hoverBackgroundColor: gradientStrokeRed,
                  legendColor: gradientLegendRed,
                  pointRadius: 0,
                  fill: false,
                  borderWidth: 1,
                  fill: 'origin',
                  data: rideData
                },
                {
                  label: "Pending",
                  borderColor: gradientStrokeBlue,
                  backgroundColor: gradientStrokeBlue,
                  hoverBackgroundColor: gradientStrokeBlue,
                  legendColor: gradientLegendBlue,
                  pointRadius: 0,
                  fill: false,
                  borderWidth: 1,
                  fill: 'origin',
                  data: poolData
                }
            ]
          },
          options: {
            responsive: true,
            legend: false,
            legendCallback: function(chart) {
              var text = []; 
              text.push('<ul>'); 
              for (var i = 0; i < chart.data.datasets.length; i++) { 
                  text.push('<li><span class="legend-dots" style="background:' + 
                             chart.data.datasets[i].legendColor + 
                             '"></span>'); 
                  if (chart.data.datasets[i].label) { 
                      text.push(chart.data.datasets[i].label); 
                  } 
                  text.push('</li>'); 
              } 
              text.push('</ul>'); 
              return text.join('');
            },
            scales: {
                yAxes: [{
                    ticks: {
                        display: false,
                        min: 0,
                        stepSize: 20,
                        max: 80
                    },
                    gridLines: {
                      drawBorder: false,
                      color: 'rgba(235,237,242,1)',
                      zeroLineColor: 'rgba(235,237,242,1)'
                    }
                }],
                xAxes: [{
                    gridLines: {
                      display:false,
                      drawBorder: false,
                      color: 'rgba(0,0,0,1)',
                      zeroLineColor: 'rgba(235,237,242,1)'
                    },
                    ticks: {
                        padding: 20,
                        fontColor: "#9c9fa6",
                        autoSkip: true,
                    },
                    categoryPercentage: 0.5,
                    barPercentage: 0.5
                }]
              }
            },
            elements: {
              point: {
                radius: 0
              }
            }
        })
        $("#visit-sale-chart-legend").html(myChart.generateLegend());
      }
    });
})(jQuery);