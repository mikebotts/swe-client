/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the License.
 *
 * The Initial Developer is Terravolv, Inc. Portions created by the Initial
 * Developer are Copyright (C) 2014-2015 the Initial Developer. All Rights Reserved.
 */

$( document ).ready(function() {

  // Police car
  var policeCar = new Object();
  policeCar.lat = 0;
  policeCar.lon = 0;
  policeCar.rotation = 0;
  policeCar.buildmarker = false;
  policeCar.lookrayson = false;
  dataObjects[0] = policeCar;
  
  // Patrolman
  var patrolMan = new Object();
  patrolMan.lat = 0;
  patrolMan.lon = 0;
  patrolMan.rotation = 0;
  patrolMan.buildmarker = false;
  patrolMan.lookrayson = false;
  dataObjects[1] = patrolMan;

  // Weather Station 1
  var weatherStation = new Object();
  weatherStation.name = "";
  weatherStation.temperature = 0;
  weatherStation.pressure = 0;
  weatherStation.lat = 0;
  weatherStation.lon = 0;
  weatherStation.locationon = false;
  weatherStation.temperatureon = false;
  weatherStation.pressureon = false;
  weatherStation.winddirectionon = false;
  weatherStation.windspeedon = false;
  dataObjects[2] = weatherStation;
  
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
      dataObjects[2].name = "Station 1";
      dataObjects[2].lat = 34.73;
      dataObjects[2].lon = -86.585;
      }, 'xml');  

  // Get data descriptor for PTZ pan feed
  $.get(PTZ_PAN_DESCRIPTOR,
    function(data) {
      template = $(data);
      template.find('field').each(function (i, field) {
        axisPanFields[i] = $(this);
      });
    }, 'xml');  
      
  // Get data descriptor for ORIENTATION feed
  $.get(ORIENTATION_DESCRIPTOR,
    function(data) {
      template = $(data);
      template.find('coordinate').each(function (i, coordinate) {
        orientationFields[i] = $(this);
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

function log(msg) {
  if (DEBUG_MODE) 
    $("<p style='padding:0;margin:0;'>" + msg + "</p>").appendTo("#dbg");
} // log

function send_ptz_command(ptzURL, ptzParams) {
  try {
    var http = new XMLHttpRequest();
    var params = PTZ_TASKING_COMMAND_BASE.replace(PTZ_TASKING_COMMAND_REPLACE_TOKEN,ptzParams);
    http.open("POST", ptzURL, true);
    http.setRequestHeader("Content-Type", "text/xml")
    http.send(params);  
  } catch (e) {
    log(e);
  }
} // send_ptz_command

function is(type, obj) {
  var clas = Object.prototype.toString.call(obj).slice(8, -1);
  return obj !== undefined && obj !== null && clas === type;
} // is

function getRTOrientationFeed(feedSource, feedType) {
  // Query SOS Orientation stream
  var reader = new FileReader();
  reader.onload = function () {
    var rec = reader.result;
    if (null===rec) {
    } else {
      switch(feedType) {
        case POLICECAR_GPS_FEED:
          processWebSocketFeed(rec, orientationFields, "ORIENTATION", "POLICECAR_ORIENTATION_FEED", "N/A");
          break;
        case PATROLMAN_GPS_FEED:
          processWebSocketFeed(rec, orientationFields, "ORIENTATION", "PATROLMAN_ORIENTATION_FEED", "N/A");
          break;
         default:
          throw new Error("Unknown real-time orientation feed source.");
      }
    }
  }
  var ws = new WebSocket(feedSource);
  ws.onmessage = function (event) {
      reader.readAsText(event.data);
  }
  ws.onerror = function (event) {
      ws.close();
  }
  ws.onclose = function (event) {
    switch(feedType) {
      case POLICECAR_GPS_FEED:
        currentPolicecarOrientation = 0;
        break;
      case PATROLMAN_GPS_FEED:
        currentPatrolmanOrientation = 0;
        break;
       default:
        throw new Error("Unknown real-time orientation feed source.");
    }
    
  }
  return ws;
} // getRTOrientationFeed

function getPTZPanFeed(feedSource) {
  // Query SOS PTZ Pan stream
  var reader = new FileReader();
  reader.onload = function () {
    var rec = reader.result;
    if (null===rec) {
    } else {
      processWebSocketFeed(rec, axisPanFields, "AXIS_PAN_ANGLE", "N/A", "N/A");  
    }
  }
  var ws = new WebSocket(feedSource);
  ws.onmessage = function (event) {
      reader.readAsText(event.data);
  }
  ws.onerror = function (event) {
      ws.close();
  }
  ws.onclose = function (event) {
      PTZ_PAN_ANGLE = 0;
      
  }
  return ws;
} // getPTZPanFeed

function getRTGPSFeed(feedSource) {
  // Query SOS GPS stream
  try {
    var reader = new FileReader();
    reader.onload = function () {
      var rec = reader.result;
      if (null !== rec) {
      switch(feedSource) {
          case POLICECAR_GPS_FEED:
            processWebSocketFeed(rec, gpsFields, "GPS", "POLICECARFEED", "N/A");
            if (dataObjects[0].buildmarker)
              buildGPSMarker(dataObjects[0],"POLICECARFEED");
            if ((dataObjects[0].lookrayson))
              buildGPSMarker(dataObjects[0],"POLICECARLOOKRAYFEED");
            break;
          case PATROLMAN_GPS_FEED:
            processWebSocketFeed(rec, gpsFields, "GPS", "PATROLMANFEED", "N/A");
            if (dataObjects[1].buildmarker)
              buildGPSMarker(dataObjects[1],"PATROLMANFEED");
            if ((dataObjects[1].lookrayson))
              buildGPSMarker(dataObjects[1],"PATROLMANLOOKRAYFEED");
            break;
          default:
            throw new Error("Unknown real-time GPS feed source.");
        }
      }
    }
    var ws = new WebSocket(feedSource);
    ws.onmessage = function (event) {
        reader.readAsText(event.data);
    }
    ws.onerror = function (event) {
        ws.close();
    }
    ws.onclose = function (event) {
      switch(feedSource) {
        case POLICECAR_GPS_FEED:
          removeMarker(policeCarMarker);
          policeCarMarker=null;
          break;
        case PATROLMAN_GPS_FEED:
          removeMarker(patrolManMarker);
          patrolManMarker=null;            
          break;
         default:
          throw new Error("Unknown real-time GPS feed source.");
      }
      
    }
    return ws;    
  } catch (e) {
    alert (e);
  }

} // getRTGPSFeed
 
function getRTWeatherFeed(feedSource) {
  // Query SOS weather stream
  var reader = new FileReader();
  reader.onload = function () {
    var rec = reader.result;
    if (null !== rec) {
      // We don't which one of the weather attributes client wants to view. Process all.
      if (dataObjects[2].locationon) {
        processWebSocketFeed(rec, weatherFields, "WEATHER_STATION_LOCATION", "N/A", dataObjects[2]);
      }
      if (dataObjects[2].temperatureon) { 
        processWebSocketFeed(rec, weatherFields, "WEATHER_TEMPERATURE", "TEMPERATURE", dataObjects[2]);
      }
      if (dataObjects[2].pressureon) { 
        processWebSocketFeed(rec, weatherFields, "WEATHER_BAROMETRIC_PRESSURE", "PRESSURE", dataObjects[2]);
      }
      if (dataObjects[2].windspeedon) {
        processWebSocketFeed(rec, weatherFields, "WEATHER_WIND_SPEED", "N/A", "N/A");
      }
      if (dataObjects[2].winddirectionon) {
        processWebSocketFeed(rec, weatherFields, "WEATHER_WIND_DIRECTION", "N/A", "N/A");
      }
    }
  }
  var ws = new WebSocket(feedSource);
  ws.onmessage = function (event) {
    reader.readAsText(event.data);
  }
  ws.onerror = function (event) {
    ws.close();
  }
  ws.onclose = function (event) {
    switch(feedSource) {
      case WEATHER_STATION_1_RT_FEED:
        // Close direction and speed charts
        dataObjects[2].locationon = false;
        dataObjects[2].temperatureon = false;
        dataObjects[2].pressureon = false;
        dataObjects[2].windspeedon = false;
        dataObjects[2].winddirectionon = false;
        dataObjects[2].temperature = 0;
        dataObjects[2].pressure = 0;
        document.getElementById("weather_winddirection").style.display = 'none';
        document.getElementById("weather_speed").style.display = 'none';
        
        // Remove station, temperature and pressure markers
        if (null !== weatherStationMarker) {
          removeMarker(weatherStationMarker);
          weatherStationMarker=null;
        }        
        if (null !== weatherStationTemperatureMarker) {
          removeMarker(weatherStationTemperatureMarker);
          weatherStationTemperatureMarker=null;
        }        
        if (null !== weatherStationPressureMarker) {
          removeMarker(weatherStationPressureMarker);
          weatherStationPressureMarker=null;
        }        
        break;
       default:
        throw new Error("Unknown real-time weather feed source.");
    }
    
  }
  return ws;
}  // getRTWeatherFeed

function removeMarker(thisMarker) {
  map.removeLayer(thisMarker);
  thisMarker.update(thisMarker);
} //removeMarker

function buildWeatherStationMarker(sensorLocation) {
  if (null === weatherStationMarker) {
    weatherStationMarker = L.marker(
                          [sensorLocation.lat, sensorLocation.lon], 
                          {icon: L.icon({ iconUrl: 'http://54.80.60.180:6080/images/weatherstationicon.png',
                                          iconSize: [34, 77],})}).addTo(map)
                        .bindPopup('<div id="pop-weatherStationName">Station ID: ' + sensorLocation.name + '</div>', { className: 'marker-popup' , closeButton: false});
  }
} // buildWeatherStationMarker

function buildWeatherTemperatureMarker(sensorLocation) {
  
  if (null === weatherStationTemperatureMarker) {
    weatherStationTemperatureMarker = L.marker(
                                      [sensorLocation.lat, sensorLocation.lon], 
                                      { icon: L.divIcon({ className: 'divIcon',
                                                         html: "Temperature: " + parseFloat(dataObjects[2].temperature).toFixed(2) + "\xB0",
                                                         iconAnchor: [70,-40],
                                                         iconSize: [200,40]
                                                        })}).addTo(map);
  } else {
    var icon = L.divIcon({
               html: "Temperature: " + parseFloat(dataObjects[2].temperature).toFixed(2) + "\xB0",
               className: 'divIcon',
               iconAnchor: [70,-40],
               iconSize: [200,40]
            });
    weatherStationTemperatureMarker.setIcon(icon);
    weatherStationTemperatureMarker.update(weatherStationTemperatureMarker);
  }

} //buildWeatherTemperatureMarker

function buildWeatherPressureMarker(sensorLocation) {

  if (null === weatherStationPressureMarker) {
    weatherStationPressureMarker = L.marker(
                                   [sensorLocation.lat, sensorLocation.lon], 
                                   { icon: L.divIcon({ className: 'divIcon',
                                                       html: "Pressure: " + parseFloat(dataObjects[2].pressure).toFixed(2) + " hPa",
                                                       iconAnchor: [70,-60],
                                                       iconSize: [200,40]
                                                     })}).addTo(map);
  } else {
    var icon = L.divIcon({
               html: "Pressure: " + parseFloat(dataObjects[2].pressure).toFixed(2) + " hPa",
               className: 'divIcon',
               iconAnchor: [70,-60],
               iconSize: [200,40]
            });
    weatherStationPressureMarker.setIcon(icon);
    weatherStationPressureMarker.update(weatherStationPressureMarker);
  }

} //buildWeatherPressureMarker

function buildGPSMarker(data, markerType) {
  var s_lat = data.lat, s_long = data.lon, rotation = data.rotation;
  
  if (typeof s_lat === "undefined" || typeof s_long === "undefined") {
    throw new Error ("Latitude and/or Longitude is unavailable.");
    return;
  } /*Latitude or Longitude empty */ else {
    switch (markerType) {
      case "POLICECARFEED" :
        if (policeCarMarker === null) {
          policeCarMarker = L.rotatedMarker(
                                [s_lat, s_long], 
                                {icon: L.icon({ iconUrl: 'http://54.80.60.180:6080/images/policecar.png',
                                                iconSize: [18,38],})}).addTo(map)
                              .bindPopup('<div id="pop-policeCarMarker">Latitude: ' + s_lat + '<br />Longitude: ' + s_long + '</div>', { className: 'marker-popup' , closeButton: false});
        } else {
          policeCarMarker.setLatLng([s_lat, s_long]);
          $('#pop-policeCarMarker').html('Latitude: ' + s_lat + '<br />Longitude: ' + s_long);
        }
        policeCarMarker.options.angle = parseFloat(rotation);                              
        break;
      case "PATROLMANFEED" :
        if (patrolManMarker === null) {
          patrolManMarker = L.rotatedMarker(
                                [s_lat, s_long], 
                                {icon: L.icon({ iconUrl: 'http://54.80.60.180:6080/images/policeman.png',
                                                iconSize: [24, 24],})}).addTo(map)
                              .bindPopup('<div id="pop-patrolManMarker">Latitude: ' + s_lat + '<br />Longitude: ' + s_long + '</div>', { className: 'marker-popup' , closeButton: false });
        } else {
          patrolManMarker.setLatLng([s_lat, s_long]);
          $('#pop-patrolManMarker').html('Latitude: ' + s_lat + '<br />Longitude: ' + s_long);
        }
        break;
      case "POLICECARLOOKRAYFEED" :
        if (policeCarLookRaysMarker === null) {
          policeCarLookRaysMarker = L.rotatedMarker(
                                [s_lat, s_long], 
                                {icon: L.icon({ iconUrl: 'http://54.80.60.180:6080/images/cameralookrays.png',
                                                iconSize: [26,51],})}).addTo(map);
        } else {
          policeCarLookRaysMarker.setLatLng([s_lat, s_long]);
        }
        policeCarLookRaysMarker.options.angle = parseFloat(rotation) + currentAxisCameraPanAngle + PTZ_ADJUSTMENT_ANGLE_TO_ZERO;                              
        break;
      case "PATROLMANLOOKRAYFEED" :
        if (patrolManLookRaysMarker === null) {
          patrolManLookRaysMarker = L.rotatedMarker(
                                [s_lat, s_long], 
                                {icon: L.icon({ iconUrl: 'http://54.80.60.180:6080/images/cameralookrays.png',
                                                iconSize: [26,51],})}).addTo(map);
        } else {
          patrolManLookRaysMarker.setLatLng([s_lat, s_long]);
        }
        patrolManLookRaysMarker.options.angle = parseFloat(rotation)+90;                              
        break;
      default:
        throw new Error ("Cannot build marker.  Unknown marker type.");
    } // Switching based on marker type
  }  // Got Latitude or Longitude 
} // buildGPSMarker

function interpretFeed(data, iFields, typeofFeed, delimiter) {
  vals = data.trim().split(delimiter);
  switch (typeofFeed) {
    case "ORIENTATION":
      $(iFields).each(function (idx, field) {
          switch($(field).attr('name')) {
            case 'heading':
              s_rotation = vals[idx+1];
              break;
            case 'pitch':
              s_pitch = vals[idx+1];
              break;
            case 'roll':
              s_roll = vals[idx+1];
              break;
          }
        });
        log(s_rotation);
      return { rotation: s_rotation, pitch: s_pitch, roll: s_roll };
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
    case "WEATHER_STATION_LOCATION":
      // Location has been hardwired for the demo.  Nothing to do here.
      break;
    case "AXIS_PAN_ANGLE":
      $(iFields).each(function (idx, field) {
          switch($(field).attr('name')) {
            case 'pan':
              s_pan = vals[idx];
              break;
            case 'time':
              s_time = vals[idx];
              break;
          }
        });
      return { angle: s_pan, time: s_time };
      break;
    case "WEATHER_BAROMETRIC_PRESSURE":
    case "WEATHER_TEMPERATURE":
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
  } // interpretFeed

}

function processWebSocketFeed(rec, recordDescriptor, typeofFeed, markerType, markerLocations) {
  //log (dataObjects[2].locationon + ", " + dataObjects[2].temperatureon + ", " + dataObjects[2].pressureon);
  response = interpretFeed(rec, recordDescriptor, typeofFeed, ',');
  switch (typeofFeed) {
    case "ORIENTATION":
      switch (markerType) {
        case "PATROLMAN_ORIENTATION_FEED":
          currentPatrolmanOrientation = response.rotation | 0;
          break;
        case "POLICECAR_ORIENTATION_FEED":
          currentPolicecarOrientation = response.rotation | 0;
          break;
      }
      break;
    case "AXIS_PAN_ANGLE":
      currentAxisCameraPanAngle = response.angle | 0;
      break;
    case "GPS":
      switch (markerType) {
        case "PATROLMANFEED":
          dataObjects[1].lat = response.lat;
          dataObjects[1].lon = response.long;
          dataObjects[1].rotation = currentPatrolmanOrientation;
          break;
        case "POLICECARFEED":
          dataObjects[0].lat = response.lat;
          dataObjects[0].lon = response.long;
          dataObjects[0].rotation = currentPolicecarOrientation;
          break;
      }
      break;
    case "WEATHER_STATION_LOCATION":
      buildWeatherStationMarker(dataObjects[2]);
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
      dataObjects[2].temperature = response.temperature;
      buildWeatherTemperatureMarker(dataObjects[2]);
      break;
    case "WEATHER_BAROMETRIC_PRESSURE":
      dataObjects[2].pressure = response.pressure;
      buildWeatherPressureMarker(dataObjects[2]);
      break;
    default:
      throw new Error("Cannot parse feed.  Unknown feed type.");
  }
    
} // processWebSocketFeed
