/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

//Mike's Nexus -- urn:android:device:04e4413b0a286002-sos
//Mani's HTC -- urn:android:device:FA44CWM03715-sos


var template = null;
var gpsFields = [], weatherFields = [], quatFields = [], weatherSensorLocations = [];
var INTERVALS = 0, MAX_INTERVALS = 60, POLL_INTERVAL = 100;
var WEATHER_DESCRIPTOR = 'http://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=DescribeSensor&procedure=urn:test:sensors:fakeweather&procedureDescriptionFormat=http://www.opengis.net/sensorml/2.0',
    GPS_DESCRIPTOR = 'http://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=GetResultTemplate&offering=urn:mysos:offering02&observedProperty=http://sensorml.com/ont/swe/property/Location',
    CAM_DESCRIPTOR = 'http://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=DescribeSensor&procedure=urn:test:sensors:fakecam&procedureDescriptionFormat=http://www.opengis.net/sensorml/2.0',
    quaternion_DESCRIPTOR = 'http://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResultTemplate&offering=urn:android:device:FA44CWM03715-sos&observedProperty=http://sensorml.com/ont/swe/property/OrientationQuaternion&temporalFilter=phenomenonTime,now/2015-06-01';
//var POLICECAR_GPS_FEED = 'http://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:mysos:offering02&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,now/2115-01-28T16:24:48Z',
var POLICECAR_GPS_FEED = 'http://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:FA44CWM03715-sos&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,now/2115-01-28T16:24:48Z',
    //POLICECAR_GPS_FEED = 'http://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:mysos:offering02&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenTime,now/2015-06-01',
    //POLICECAR_GPS_FEED = 'ws://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:mysos:offering02&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,now/2055-01-01',
    //PATROLMAN_GPS_FEED = 'http://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:mysos:offering01&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,now/2115-01-28T16:24:48Z',
    PATROLMAN_GPS_FEED = 'http://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:04e4413b0a286002-sos&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,now/2015-06-01',
    //PATROLMAN_GPS_FEED = 'ws://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:04e4413b0a286002-sos&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,now/2015-06-01',
    WEATHER_RT_FEED = 'http://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:mysos:offering03&observedProperty=http://sensorml.com/ont/swe/property/Weather&temporalFilter=phenomenonTime,now/2115-01-28T16:24:48Z',
    POLICECAR_CAM_FEED = 'http://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=d136b6ea-3951-4691-bf56-c84ec7d89d72-sos&observedProperty=http://sensorml.com/ont/swe/property/VideoFrame&temporalFilter=phenomenonTime,now/2115-01-28T16:24:48Z',
    PATROLMAN_CAM_FEED = 'http://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:04e4413b0a286002-sos&observedProperty=http://sensorml.com/ont/swe/property/VideoFrame&temporalFilter=phenomenonTime,now/2115-01-28T16:24:48Z',
    POLICECAR_QUAT_FEED = 'http://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:04e4413b0a286002-sos&observedProperty=http://sensorml.com/ont/swe/property/OrientationQuaternion&temporalFilter=phenomenonTime,now/2015-06-01',
    PATROLMAN_QUAT_FEED = 'http://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:04e4413b0a286002-sos&observedProperty=http://sensorml.com/ont/swe/property/OrientationQuaternion&temporalFilter=phenomenonTime,now/2015-06-01';
    
//http://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:mysos:offering02&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenTime,now/2015-06-01    
//var PATROL_CAR_PTZ_CAMERA_URL="http://bottsgeo.simple-url.com/axis-cgi/com/ptz.cgi";
//var PATROL_CAR_PTZ_CAMERA_URL="http://bottsgeo.simple-url.com:8080/sensorhub/sps?";
//var PATROL_CAR_PTZ_CAMERA_URL="http://192.168.1.38:2015/sensorhub/sps?";
//var PATROL_CAR_PTZ_CAMERA_URL="http://192.168.43.183:2015/sensorhub/sps?";
//  http://bottsgeo.simple-url.com:2015/sensorhub/sps
var PATROL_CAR_PTZ_CAMERA_URL="http://bottsgeo.simple-url.com:2015/sensorhub/sps?";

var PTZ_TASKING_COMMAND_REPLACE_TOKEN="{SWE_PTZ_TASKING_COMMAND}"; 
var PTZ_TASKING_COMMAND_BASE='<?xml version="1.0" encoding="UTF-8"?><sps:Submit service="SPS" version="2.0" xmlns:sps="http://www.opengis.net/sps/2.0" xmlns:swe="http://www.opengis.net/swe/2.0"><sps:procedure>d136b6ea-3951-4691-bf56-c84ec7d89d72</sps:procedure><sps:taskingParameters><sps:ParameterData><sps:encoding><swe:TextEncoding blockSeparator=" " collapseWhiteSpaces="true" decimalSeparator="." tokenSeparator=","/></sps:encoding><sps:values>' + PTZ_TASKING_COMMAND_REPLACE_TOKEN + '</sps:values></sps:ParameterData></sps:taskingParameters></sps:Submit>';
var policecarGPSFeedPollTimer=0, 
    patrolmanGPSFeedPollTimer=0,
    windDirectionFeedPollTimer=0,
    windSpeedFeedPollTimer=0,
    weatherLocationPollTimer=0,
    weatherTemperaturePollTimer=0,
    weatherBarometricPressurePollTimer=0,
    patrolmanQuaternionFeedPollTimer=0,
    policecarQuaternionFeedPollTimer=0;

var reader;

$( document ).ready(function() {

  $('#selectObjects').click(function (e) {
    e.preventDefault();
    showMenu();
  });
  
  /*
    Start Marker rotation code.
    This an extension to the Marker so that it can be rotated.
    Credits: 
      MIT-licensed code by Benjamin Becquet
      https://github.com/bbecquet/Leaflet.PolylineDecorator
  */
  
  L.RotatedMarker = L.Marker.extend({
    options: { angle: 0 },
    _setPos: function(pos) {
      L.Marker.prototype._setPos.call(this, pos);
      if (L.DomUtil.TRANSFORM) {
        // use the CSS transform rule if available
        this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.angle + 'deg)';
      } else if (L.Browser.ie) {
        // fallback for IE6, IE7, IE8
        var rad = this.options.angle * L.LatLng.DEG_TO_RAD,
        costheta = Math.cos(rad),
        sintheta = Math.sin(rad);
        this._icon.style.filter += ' progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\', M11=' +
          costheta + ', M12=' + (-sintheta) + ', M21=' + sintheta + ', M22=' + costheta + ')';
      }
    }
  });
  
  L.rotatedMarker = function(pos, options) {
      return new L.RotatedMarker(pos, options);
  };
  // End of Marker rotation code

  // Get weather sensor locations.  This one is hard-coded for the first demonstration.
  // The URL must be changed to something that gives locations of all the sensors.
  $.get(WEATHER_DESCRIPTOR,
    function(data) {
      // TODO: We need to change the logic here to loop through resulting data and store actual locations
      var station = new Object();
      station.name = "Station 1";
      station.lat = 34.73;
      station.lon = -86.585;
      weatherSensorLocations[0] = station;
      }, 'xml');  

  // Get data descriptor for quaternion feed
  $.get(quaternion_DESCRIPTOR,
    function(data) {
      template = $(data);
      template.find('coordinate').each(function (i, coordinate) {
        quatFields[i] = $(this);
      });
    }, 'xml');  
      
  // Get data descriptor for real-time weather feed
  $.get(WEATHER_DESCRIPTOR,
    function(data) {
      template = $(data);
      template.find('field').each(function (i, field) {
        weatherFields[i] = $(this);
      });
    }, 'xml');  
  
  // Get data descriptor for real-time GPS feed
  $.get(GPS_DESCRIPTOR,
    function(data) {
      template = $(data);
      template.find('field').each(function (i, field) {
        gpsFields[i] = $(this);
      });
    }, 'xml');
});

function send_ptz_command(ptzURL, ptzParams) {
  var http = new XMLHttpRequest();
  var params = PTZ_TASKING_COMMAND_BASE.replace(PTZ_TASKING_COMMAND_REPLACE_TOKEN,ptzParams);
  http.open("POST", ptzURL, true);

  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.setRequestHeader("Content-type", "text/xml");
  //http.setRequestHeader("Content-length", params.length);
  //http.setRequestHeader("Connection", "close");  
  http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState ==4 && http.status == 200) {
         // alert(http.responseText);
      }
  }
  http.send(params);  
}

function is(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
}

// Real-time quaternion feed
function getRTQuaternionFeed(feedSource) {
  // Query SOS Quaternion stream
  xhReq = new XMLHttpRequest();
  xhReq.open("GET", feedSource, true);
  xhReq.send(null);
  switch(feedSource) {
    case PATROLMAN_QUAT_FEED:
      patrolmanQuaternionFeedPollTimer = setInterval(processFeed, POLL_INTERVAL, quatFields, "QUATERNION", "PATROLMAN_QUAT_FEED", "N/A");
      break;
    case PATROLCAR_QUAT_FEED:
      patrolcarQuaternionFeedPollTimer = setInterval(processFeed, POLL_INTERVAL, quatFields, "QUATERNION", "POLICECAR_QUAT_FEED", "N/A");
      break;
     default:
      throw new Error("Unknown real-time quaternion feed source.");
  }
}

// Real-time GPS feed
function getRTGPSFeed(feedSource) {
  // Query SOS GPS stream
  xhReq = new XMLHttpRequest();
  xhReq.open("GET", feedSource, true);
  xhReq.send();
  switch(feedSource) {
    case POLICECAR_GPS_FEED:
      policecarGPSFeedPollTimer = setInterval(processFeed, POLL_INTERVAL, gpsFields, "GPS", "POLICECARFEED", "N/A");
      break;
    case PATROLMAN_GPS_FEED:
      patrolmanGPSFeedPollTimer = setInterval(processFeed, POLL_INTERVAL, gpsFields, "GPS", "PATROLMANFEED", "N/A");
      break;
     default:
      throw new Error("Unknown real-time GPS feed source.");
  }
}

/*function getRTGPSFeed(feedSource) {
  // Query SOS GPS stream
  reader = new FileReader();
  ws = new WebSocket(feedSource);
  ws.onmessage = function (event) {
      reader.readAsText(event.data);
  }
  ws.onerror = function (event) {
      ws.close();
  }
  switch(feedSource) {
    case POLICECAR_GPS_FEED:
      //policecarGPSFeedPollTimer = setInterval(processFeed, POLL_INTERVAL, gpsFields, "GPS", "POLICECARFEED", "N/A");
      reader.onload = processWebSocketFeed(gpsFields, "GPS", "POLICECARFEED", "N/A");
      break;
    case PATROLMAN_GPS_FEED:
      //patrolmanGPSFeedPollTimer = setInterval(processFeed, POLL_INTERVAL, gpsFields, "GPS", "PATROLMANFEED", "N/A");
      reader.onload = processWebSocketFeed(gpsFields, "GPS", "PATROLMANFEED", "N/A");
      break;
     default:
      throw new Error("Unknown real-time GPS feed source.");
  }
}
*/

// Real-time weather feed
function getRTWeatherFeed(feedSource, display) {
  // Query SOS GPS stream
  xhReq = new XMLHttpRequest();
  xhReq.open("GET", feedSource, true);
  xhReq.send();
  switch(display) {
    case "location" :
      weatherLocationPollTimer = setInterval(processFeed, POLL_INTERVAL, weatherFields, "WEATHER_STATION_LOCATION", "N/A", weatherSensorLocations);
      break;
    case "temperature" :
      weatherTemperaturePollTimer = setInterval(processFeed, POLL_INTERVAL, weatherFields, "WEATHER_TEMPERATURE", "TEMPERATURE", weatherSensorLocations);
      break;
    case "pressure" :
      weatherTemperaturePollTimer = setInterval(processFeed, POLL_INTERVAL, weatherFields, "WEATHER_BAROMETRIC_PRESSURE", "PRESSURE", weatherSensorLocations);
      break;
    case "windspeed" :
      windSpeedFeedPollTimer = setInterval(processFeed, POLL_INTERVAL, weatherFields, "WEATHER_WIND_SPEED", "N/A", "N/A");
      break;
    case "winddirection" :
      windDirectionFeedPollTimer = setInterval(processFeed, POLL_INTERVAL, weatherFields, "WEATHER_WIND_DIRECTION", "N/A", "N/A");
      break;
     default:
      throw new Error("Unknown weather data display type.");
  }
}

// Generic feed parser
function processFeed(recordDescriptor, typeofFeed, markerType, markerLocations) {

  var allMessages = xhReq.responseText;
  var endRec = allMessages.lastIndexOf("\n");
  var startRec = allMessages.lastIndexOf("\n", endRec-1) + 1;
  if (startRec < 0) startRec = 0;
  var rec = allMessages.substring(startRec, endRec);

  if (rec.length > 0) {
    response = interpretFeed(rec, recordDescriptor, typeofFeed, ',');
    switch (typeofFeed) {
      case "QUATERNION":
        var q = new SWEQuaternion(response.qX,response.qY,response.qZ, response.qW);
        q.normalize();
        var rotationAngle = q.extractAngle();
        console.log("Orientation: " + rotationAngle);
        //buildLookRaysMarker( ,rotationAngle, markerType);
        break;
      case "GPS":
        buildGPSMarker(response, markerType);
        break;
      case "WEATHER_STATION_LOCATION":
        buildWeatherStationMarker(weatherSensorLocations[0]);
        break;
      case "WEATHER_WIND_DIRECTION" :
        var chart=$("#weather_winddirection").highcharts();
        var point = chart.series[0].points[0];
        point.update(parseInt(response.winddirection));
        break;
      case "WEATHER_WIND_SPEED" :
        var chart=$("#weather_windspeed").highcharts();
        var series = chart.series[0];
        series.addPoint([Date.parse(response.time), parseInt(response.windspeed)], true, true);
        break;
      case "WEATHER_TEMPERATURE" :
      
      case "WEATHER_BAROMETRIC_PRESSURE":
        break;
      default:
        throw new Error("Cannot parse feed.  Unknown feed type.");
    }
    
  }
}

function buildWeatherStationMarker(sensorLocation) {
  if (livePoliceCarFeed === null) {
    weatherStationMarker = L.Marker(
                          [sensorLocation.lat, sensorLocation.lon], 
                          {icon: L.icon({ iconUrl: 'http://54.80.60.180:6080/images/weatherstationicon.png',
                                          iconSize: [34, 77],})}).addTo(map)
                        .bindPopup('<div id="pop-weatherStationName">Station ID: ' + sensorLocation.name + '</div>', { className: 'marker-popup' , closeButton: false});
  }
} // buildWeatherStationMarker

function buildLookRaysMarker(locationData, rotation, markerType) {
  
  var s_lat = locationData.lat, s_long = locationData.long, s_alt = locationData.alt, s_time = locationData.time;
  
  
  if (typeof s_lat === "undefined" || typeof s_long === "undefined") {
    throw new Error ("Latitude and/or Longitude for look rays is unavailable.");
    return;
  } /*Latitude or Longitude empty */ else {
    switch (markerType) {
      case "POLICECAR_QUAT_FEED" :
        if (livePolicecarQuaternionFeed === null) {
          livePolicecarQuaternionFeed = L.rotatedMarker(
                                [s_lat, s_long], 
                                {icon: L.icon({ iconUrl: 'http://54.80.60.180:6080/images/lookrays.png',
                                                iconSize: [64, 64],})}).addTo(map);
        } else {
          livePolicecarQuaternionFeed.setLatLng([s_lat, s_long]);
        }
        livePolicecarQuaternionFeed.options.angle = rotation;                              
        break;
      case "PATROLMAN_QUAT_FEED" :
        if (livePatrolmanQuaternionFeed === null) {
          livePatrolmanQuaternionFeed = L.rotatedMarker(
                                [s_lat, s_long], 
                                {icon: L.icon({ iconUrl: 'http://54.80.60.180:6080/images/lookrays.png',
                                                iconSize: [64, 64],})}).addTo(map);
        } else {
          livePatrolmanQuaternionFeed.setLatLng([s_lat, s_long]);
        }
        livePatrolmanQuaternionFeed.options.angle = rotation;                              
        break;
      default:
        throw new Error ("Cannot build marker.  Unknown quaternion marker type.");
    } // Switching based on marker type
  }  // Got Latitude or Longitude 
} // buildLookRaysMarker

function buildGPSMarker(data, markerType) {
  var s_lat = data.lat, s_long = data.long, s_alt = data.alt, s_time = data.time;
  
  if (typeof s_lat === "undefined" || typeof s_long === "undefined") {
    throw new Error ("Latitude and/or Longitude is unavailable.");
    return;
  } /*Latitude or Longitude empty */ else {
    switch (markerType) {
      case "POLICECARFEED" :
        if (livePoliceCarFeed === null) {
          livePoliceCarFeed = L.rotatedMarker(
                                [s_lat, s_long], 
                                {icon: L.icon({ iconUrl: 'http://54.80.60.180:6080/images/policecar.png',
                                                iconSize: [35, 75],})}).addTo(map)
                              .bindPopup('<div id="pop-livePoliceCarFeed">Latitude: ' + s_lat + '<br />Longitude: ' + s_long + '</div>', { className: 'marker-popup' , closeButton: false});
          //livePoliceCarFeed.options.angle = 90;                              
        } else {
          livePoliceCarFeed.setLatLng([s_lat, s_long]);
          $('#pop-livePoliceCarFeed').html('Latitude: ' + s_lat + '<br />Longitude: ' + s_long);
        }
        break;
      case "PATROLMANFEED" :
        if (livePatrolmanFeed === null) {
          livePatrolmanFeed = L.rotatedMarker(
                                [s_lat, s_long], 
                                {icon: L.icon({ iconUrl: 'http://54.80.60.180:6080/images/policeman.png',
                                                iconSize: [24, 24],})}).addTo(map)
                              .bindPopup('<div id="pop-livePatrolmanFeed">Latitude: ' + s_lat + '<br />Longitude: ' + s_long + '</div>', { className: 'marker-popup' , closeButton: false });
          //livePatrolmanFeed.options.angle = 90;                              
        } else {
          livePatrolmanFeed.setLatLng([s_lat, s_long]);
          $('#pop-livePatrolmanFeed').html('Latitude: ' + s_lat + '<br />Longitude: ' + s_long);
        }
        break;
      default:
        throw new Error ("Cannot build marker.  Unknown marker type.");
    } // Switching based on marker type
  }  // Got Latitude or Longitude 
} // buildGPSMaker

function interpretFeed(data, iFields, typeofFeed, delimiter) {
  vals = data.trim().split(delimiter);
  switch (typeofFeed) {
    case "QUATERNION":
      $(iFields).each(function (idx, field) {
          switch($(field).attr('name')) {
            case 'qx':
              q_x = vals[idx+1];
              break;
            case 'qy':
              q_y = vals[idx+1];
              break;
            case 'qz':
              q_z = vals[idx+1];
              break;
            case 'q0':
              q_w = vals[idx+1];
              break;
          }
        });
      return { qX: q_x, qY: q_y, qZ: q_z, qW: q_w };
      break;
    case "GPS":
      $(iFields).each(function (idx, field) {
          switch($(field).attr('name')) {
            case 'lat':
              s_lat = vals[idx];
              break;
            case 'lon':
              s_long = vals[idx];
              break;
            case 'alt':
              s_alt = vals[idx];
              break;
            case 'time':
              s_time = vals[idx];
              break;
          }
        });
      return { lat: s_lat, long: s_long, alt: s_alt, time: s_time };
      break;
    case "WEATHER_WIND_SPEED":
    case "WEATHER_WIND_DIRECTION" :
      $(iFields).each(function (idx, field) {
          switch($(field).attr('name')) {
            case 'time':
              s_time = vals[idx];
              break;
            case 'temperature':
              s_temperature = vals[idx];
              break;
            case 'pressure':
              s_pressure = vals[idx];
              break;
            case 'windSpeed':
              s_windspeed = vals[idx];
              break;
            case 'windDirection':
              s_winddirection = vals[idx];
              break;
          }
        });
      return { time: s_time, temperature: s_temperature, pressure: s_pressure, windspeed: s_windspeed, winddirection: s_winddirection };      
      break;
    default:
      throw new Error("Feed type unknown.  Unable to interpret feed.");
  }

}

function processWebSocketFeed(recordDescriptor, typeofFeed, markerType, markerLocations) {
  var rec = reader.result;
  if (null===rec)
    return;
  
  response = interpretFeed(rec, recordDescriptor, typeofFeed, ',');
  switch (typeofFeed) {
    case "QUATERNION":
      var q = new SWEQuaternion(response.qX,response.qY,response.qZ, response.qW);
      q.normalize();
      var rotationAngle = q.extractAngle();
      console.log("Orientation: " + rotationAngle);
      //buildLookRaysMarker( ,rotationAngle, markerType);
      break;
    case "GPS":
      buildGPSMarker(response, markerType);
      break;
    case "WEATHER_STATION_LOCATION":
      buildWeatherStationMarker(weatherSensorLocations[0]);
      break;
    case "WEATHER_WIND_DIRECTION" :
      var chart=$("#weather_winddirection").highcharts();
      var point = chart.series[0].points[0];
      point.update(parseInt(response.winddirection));
      break;
    case "WEATHER_WIND_SPEED" :
      var chart=$("#weather_windspeed").highcharts();
      var series = chart.series[0];
      series.addPoint([Date.parse(response.time), parseInt(response.windspeed)], true, true);
      break;
    case "WEATHER_TEMPERATURE" :
    
    case "WEATHER_BAROMETRIC_PRESSURE":
      break;
    default:
      throw new Error("Cannot parse feed.  Unknown feed type.");
  }
    
}

/*
// prepare reader
var reader = new FileReader();
reader.onload = function() {
    var rec = reader.result;
    //console.log(rec);
    document.getElementById("text").innerHTML = rec;
    var tokens = rec.trim().split(",");
    var lat = parseFloat(tokens[1]);
    var lon = parseFloat(tokens[2]);
    var alt = parseFloat(tokens[3]);
    marker.lonlat = new OpenLayers.LonLat(lon, lat).transform(epsg4326, map.getProjectionObject());
    markers.redraw();
}

// query SOS GPS stream
ws = new WebSocket("ws://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:mysos:offering02&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,now/2055-01-01");
ws.onmessage = function (event) {
    reader.readAsText(event.data);
}
ws.onerror = function (event) {
    ws.close();
}
*/
