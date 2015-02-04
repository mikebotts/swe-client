$(function () {
  $(document).ready(function () {
    Highcharts.setOptions({
      global: {
        useUTC: true
      }
    });

    $('#weather_windspeed').highcharts({
      chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        marginTop:50, 
        /*
        events: {
          load: function () {

          // set up the updating of the chart each second
          var series = this.series[0];
          setInterval(function () {
            var x = (new Date()).getTime(), // current time
            y = Math.random();
            series.addPoint([x, y], true, true);
            }, 1000);
          }
        },
        */
        spacingTop: 0,
        spacingLeft: 0,
        spacingRight: 0,
        spacingBottom: 0              
      },
      title: {
        text: 'Station 1',
        margin: 10,
        style: {
          fontFamily: 'Arial',
        },          
      },
      subtitle: {
        text: 'Wind Speed',             
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
      },
      yAxis: {
        title: {
          text: 'm/s'
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>' +
          Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
          Highcharts.numberFormat(this.y, 2);
        }
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      series: [{
        name: 'Wind Speed',
        data: (function () {
          // generate an array of random data
          var data = [],
              time = (new Date()).getTime(),
              i;

          for (i = -20; i <= 0; i += 1) {
            data.push({
              x: time + i * 1000,
              y: Math.random()
            });
          }
          return data;
        }())
      }]
    });
  });
});