function makeGuage(divId, guageValue) {

  var chart = new Highcharts.Chart({
    
        chart: {
            renderTo: 'container',
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        
        title: {
            text: 'Compass'
        },
        
        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },
           
        // the value axis
        yAxis: {
            min: 0,
            max: 360,
            tickWidth: 1,
            tickPosition: 'outside',
            tickLength: 20,
            tickColor: '#999',
            tickInterval:45,
            labels: {
                rotation: 'auto',
                formatter:function(){
                    if(this.value == 360) { return 'N'; }
                    else if(this.value == 45) { return 'NE'; }
                    else if(this.value == 90) { return 'E'; }
                    else if(this.value == 135) { return 'SE'; }
                    else if(this.value == 180) { return 'S'; }
                    else if(this.value == 225) { return 'SW'; }
                    else if(this.value == 270) { return 'W'; }
                    else if(this.value == 315) { return 'NW'; }
                }
            },
            title: {
                text: 'Wind direction'
            }},
    
        series: [{
            name: 'Compass',
            data: [80],
            tooltip: {
                valueSuffix: ' direction'
            }
        }]
    
    }, 
// Add some life
  function (chart) {
    return;
      setInterval(function() {
      $(function() {
      $.get("livedata.php", function(data, textStatus) {
          $.each(data, function(index, wind) {
          var point = chart.series[0].points[0],
          newVal = WindSpeed;
          point.update(newVal);
          });
      });
      }, "json"); 
  }, 3000);
  })
}
