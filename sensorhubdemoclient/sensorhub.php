<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

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
        <div id="policecarcam_header_right"><a href="#" onclick='document.getElementById("policecarcam").style.display="none"; return false;'>Close</a></div>
      </div>
      <div id="policecarcam_video_container">
        <div id="policecarcam_video_left">
          <iframe frameborder="0" scrolling="0" width="355" height="242" src="http://54.80.60.180:6080/police_car_ptz_camera.htm">
          </iframe>
        </div>
        <div id="policecarcam_video_right">
          <div id="ptz_container">
            <div id="pan_nw" class="box"><img src="images/ptz_blank.png" border:0/></div>
            <div id="pan_n"  class="box" onclick='send_ptz_command(PATROL_CAR_PTZ_CAMERA_URL,"rtilt,2"); return false;'><img src="images/ptz_n.png" border:0/></div>
            <div id="pan_ne" class="box"><img src="images/ptz_blank.png" border:0/></div>
            <div id="pan_w"  class="box" onclick='send_ptz_command(PATROL_CAR_PTZ_CAMERA_URL,"rpan,-5"); return false;'><img src="images/ptz_w.png" border:0/></div>
            <div id="pan_c"  class="box" onclick='send_ptz_command(PATROL_CAR_PTZ_CAMERA_URL,"zoom 1"); return false;'><img src="images/ptz_blank.png" border:0/></div>
            <div id="pan_e"  class="box" onclick='send_ptz_command(PATROL_CAR_PTZ_CAMERA_URL,"rpan,5"); return false;'><img src="images/ptz_e.png" border:0/></div>
            <div id="pan_sw" class="box" onclick='send_ptz_command(PATROL_CAR_PTZ_CAMERA_URL,"rzoom,200"); return false;'><img src="images/ptz_zoomin.png" border:0/></div>
            <div id="pan_s"  class="box" onclick='send_ptz_command(PATROL_CAR_PTZ_CAMERA_URL,"rtilt,-2"); return false;'><img src="images/ptz_s.png" border:0/></div>
            <div id="pan_se" class="box" onclick='send_ptz_command(PATROL_CAR_PTZ_CAMERA_URL,"rzoom,-200"); return false;'><img src="images/ptz_zoomout.png" border:0/></div>
          </div>
          <ul class="navigation">
            <a class="main" href="#url">Presets</a>
            <li class="n2"><a href="#" onclick='send_ptz_command(PATROL_CAR_PTZ_CAMERA_URL,"gotoserverpresetname,Back"); return false;'>Back</a></li>
            <li class="n1"><a href="#" onclick='send_ptz_command(PATROL_CAR_PTZ_CAMERA_URL,"gotoserverpresetname,Forward"); return false;'>Forward</a></li>
            <li class="n4"><a href="#" onclick='send_ptz_command(PATROL_CAR_PTZ_CAMERA_URL,"gotoserverpresetname,Left"); return false;'>Left</a></li>
            <li class="n3"><a href="#" onclick='send_ptz_command(PATROL_CAR_PTZ_CAMERA_URL,"gotoserverpresetname,Right"); return false;'>Right</a></li>
            <li class="n5"><a href="#" onclick='send_ptz_command(PATROL_CAR_PTZ_CAMERA_URL,"gotoserverpresetname,zero"); return false;'>Zero</a></li>
          </ul>          
        </div>
      </div>
    </div>
    
    <div id="patrolmancam">
      <div id="patrolman_cam_header_container">
        <div id="patrolmancam_header_left">PATROLMAN CAMERA</div>
        <div id="patrolmancam_header_right"><a href="#" onclick='document.getElementById("patrolmancam").style.display="none"; return false;'>Close </a></div>
      </div>
      <iframe frameborder="0" scrolling="0" width="400" height="300" src="http://54.80.60.180:6080/patrolman_camera.htm">
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
    
      var osm_StreetMapURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      osm_StreetMapAttrib = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      osm_SatelliteMapAttrib = 'Map data © OpenWeatherMap',
      osm_SatelliteMapURL = 'http://{s}.tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png',
      osm_StreetMap = L.tileLayer(osm_StreetMapURL, {maxZoom: 18, attribution: osm_StreetMapAttrib, id: 'examples.map-street'});
      osm_SatelliteMap = L.tileLayer(osm_SatelliteMapURL,{maxZoom: 18, attribution: osm_SatelliteMapAttrib, id: 'examples.map-openweather'});
      
      var map = new L.Map('map').addLayer(osm_StreetMap).setView(new L.LatLng(34.73, -86.585), 12);
      
      map.addLayer(osm_StreetMap);
      map.addLayer(osm_SatelliteMap);
      
      var layersControl = new L.Control.Layers({
        'Streets': osm_StreetMap,
        'Satellite': osm_SatelliteMap
      });
      
      map.addControl(layersControl);  
      
      var livePoliceCarFeed = null,
          livePatrolmanFeed = null,
          liveWeatherFeed = null;

    </script>
    <script src="js/init.js"></script>
    <script src="js/init_stream.js"></script>
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
