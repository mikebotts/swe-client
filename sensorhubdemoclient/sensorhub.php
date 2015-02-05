<!DOCTYPE html>
<html>
  <head>
    <title>SensorHub Demo 1</title>
    <meta charset="utf-8" />
    <meta name="viewport"   content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet"  href="leaflet/leaflet.css"  type="text/css"/>
    <link rel="stylesheet"  href="zTree/zTreeStyle.css" type="text/css">   
    <link rel="stylesheet"  href="css/sensors.css"      type="text/css"/>
  </head>
  <body style="margin: 0;">
    <div id="map"></div>
    
    <!-- The controls tag can probably go.  I remove it after other things are done -->
    <div id="controls" style="margin-top: 10px; display: none;">
      <button id="refresh">Refresh All Data Points</button>
    </div>
    
    <div id="dataObjectSelector">
      <button id="selectObjects">Select Data Objects</button>
    </div>
    
    <div id="weather_winddirection"></div>
    <div id="weather_windspeed"></div>

    <!-- After the demo, these DIVs will be dynamically created based on which video feed is needed -->
    <div id="policecarcam">
      <div id="policecar_cam_header_container">
        <div id="policecarcam_header_left">POLICE CAR CAMERA</div>
        <div id="policecarcam_header_right"><a href="#"  onclick='document.getElementById("policecarcam").style.display="none"; return false;'>Close</a></div></div>
        <div id="policecarcam_video_container">
          <div id="policecarcam_video_left">
            <video  src="http://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:mysos:offering04&observedProperty=http://sensorml.com/ont/swe/property/VideoFrame&temporalFilter=phenTime,now" type="video/mp4" controls="true"
            style="border:1px solid blue;width:420px"/>
          </div>
          <div id="policecarcam_video_right">
            <div id="ptz_container">
              <div id="pan_nw" class="box" onclick='send_ptz_command(PTZ_CAMERA_URL,"pan=102"); return false;'><img src="images/ptz_nw.png" border:0/></div>
              <div id="pan_n"  class="box"><img src="images/ptz_n.png" border:0/></div>
              <div id="pan_ne" class="box"><img src="images/ptz_ne.png" border:0/></div>
              <div id="pan_w"  class="box"><img src="images/ptz_w.png" border:0/></div>
              <div id="pan_c"  class="box" onclick='send_ptz_command(PTZ_CAMERA_URL,"gotoserverpresetname=Drive_wide"); return false;'><img src="images/ptz_center.png" border:0/></div>
              <div id="pan_e"  class="box"><img src="images/ptz_e.png" border:0/></div>
              <div id="pan_sw" class="box"><img src="images/ptz_sw.png" border:0/></div>
              <div id="pan_s"  class="box"><img src="images/ptz_s.png" border:0/></div>
              <div id="pan_se" class="box"><img src="images/ptz_se.png" border:0/></div>
              <div id="ptz_zi" class="box"><img src="images/ptz_zoomin.png" border:0/></div>
              <div id="ptz_na" class="box"><img src="images/ptz_blank.png" border:0/></div>
              <div id="ptz_zo" class="box"><img src="images/ptz_zoomout.png" border:0/></div>
            </div>
          </div>
        </div>
      </div>
    
    <div id="patrolmancam">
      <div id="patrolman_cam_header_container">
        <div id="patrolmancam_header_left">PATROLMAN CAMERA</div>
        <div id="patrolmancam_header_right"><a href="#" onclick='document.getElementById("patrolmancam").style.display="none"; return false;'>Close </a></div>
      </div>
      <iframe frameborder="0" scrolling="0" width="800" height="600" src="http://54.80.60.180:6080/img_video.htm">
      </iframe>
   </div>
    
    <div id="menuContent" class="menuContent">
      <ul id="dataObjectsTree" class="ztree"></ul>
    </div>
    
    <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
    <script src="js/drag_div_no_jquery_ui.js"></script>
    <script src="leaflet/leaflet.js"></script>
    <script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v0.0.4/Leaflet.fullscreen.min.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v0.0.4/leaflet.fullscreen.css' rel='stylesheet' />  
    <script src="http://code.highcharts.com/highcharts.js"></script>
    <script src="http://code.highcharts.com/highcharts-more.js"></script>
    <script type="text/javascript" src="zTree/jquery.ztree.core-3.5.js"></script>
    <script type="text/javascript" src="zTree/jquery.ztree.excheck-3.5.js"></script>
    <script>

    var map = L.map('map').setView([34.73, -86.585], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'examples.map-i875mjb7'
      }).addTo(map);
      
      var livePoliceCarFeed = null,
          livePatrolmanFeed = null;

    </script>
    <script src="js/init.js"></script>
    <script src="js/init_stream.js"></script>
    <script src="js/highchart_init.js"></script>
    <script src="js/ztree_init.js"></script>
    <script src="js/drag_div_no_jquery_ui.js"></script>
    <script src="js/weather_wind_direction.js"></script>
    <script src="js/weather_wind_speed.js"></script>
    <script>
      L.control.fullscreen().addTo(map);
      // All DIVs that need to be draggable can be placed here!
      $("#policecarcam").drags();
      $("#patrolmancam").drags();
      $("#menuContent").drags();
      $("#weather_winddirection").drags();
      $("#weather_windspeed").drags(); 
    </script>
  </body>
</html>
