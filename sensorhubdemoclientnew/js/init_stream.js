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
        log("Rotation transform - > " + this._icon.style[L.DomUtil.TRANSFORM]);
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

  try {
    var url = S(WEATHER_DESCRIPTOR_BASE_URL).getresulttemplateurl('urn:mysos:offering03', 'http://sensorml.com/ont/swe/property/Weather');
    S().getweatherdescriptor(url, function(t) {
      weatherDetails = S().getweatherdetails(t);
      dataObjects[2].name = "Station 1";
      dataObjects[2].lat = 34.73;
      dataObjects[2].lon = -86.585;
    });
  } catch (e) {
    alert(e);
  }

  try {
    var url = S(ORIENTATION_DESCRIPTOR_BASE_URL).getresulttemplateurl('urn:android:device:FA44CWM03715-sos', 'http://sensorml.com/ont/swe/property/Orientation');
    S().getorientationdescriptor(url, function(t) {
      orientationDetails = S().getorientationdetails(t);
    });
  } catch (e) {
    alert(e);
  }

  try {
    var url = S(GPS_DESCRIPTOR_BASE_URL).getresulttemplateurl('urn:android:device:FA44CWM03715-sos', 'http://sensorml.com/ont/swe/property/Location');
    S().getlocationdescriptor(url, function(t) {
      gpsDetails = S().getlocationdetails(t);
    });
  } catch (e) {
    alert(e);
  }
  
 });

function log(msg) {
  if (DEBUG_MODE) 
    $("<p style='padding:0;margin:0;'>" + msg + "</p>").appendTo("#dbg");
    var d = $('#dbg');
    d.scrollTop(d.prop("scrollHeight"));    
} // log

function send_ptz_command(ptzURL, ptzParams) {
  try {
    var http = new XMLHttpRequest();
    var params = PTZ_TASKING_COMMAND_BASE.replace(PTZ_TASKING_COMMAND_REPLACE_TOKEN,ptzParams);
    http.open("POST", ptzURL, true);
    http.setRequestHeader("Content-Type", "text/xml");
    http.send(params);  
  } catch (e) {
    log(e);
  }
} // send_ptz_command

function processOrientationSocketOnMessage(feedType, e) {
  var reader = new FileReader();
  reader.readAsBinaryString(e.data);
  reader.onload = function () {
    var rec = reader.result;
    if (null !== rec) {
      switch(feedType) {
        case POLICECAR_GPS_FEED:
          processWebSocketFeed(rec, orientationDetails, "ORIENTATION", "POLICECAR_ORIENTATION_FEED", "N/A");
          break;
        case PATROLMAN_GPS_FEED:
          processWebSocketFeed(rec, orientationDetails, "ORIENTATION", "PATROLMAN_ORIENTATION_FEED", "N/A");
          break;
        default:
          throw new Error("Unknown real-time orientation feed source.");
      }
    }
  }
} //processOrientationSocketOnMessage()

function processOrientationSocketOnClose(feedType, e) {
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
} //processOrientationSocketOnClose()

function getRTOrientationFeed(feedSource, feedType) {
  return S().openwsfeed(feedSource,processOrientationSocketOnMessage,null,processOrientationSocketOnClose,feedType);
} // getRTOrientationFeed

function processLocationSocketOnMessage(feedType,e) {
  alert("processLocationSocketOnMessage: " + arguments.length);
  var reader = new FileReader();
  reader.readAsBinaryString(e.data);
  reader.onload = function () {
    var rec = reader.result;
    if (null !== rec) {
      switch(feedType) {
        case POLICECAR_GPS_FEED:
          processWebSocketFeed(rec, gpsDetails, "GPS", "POLICECARFEED", "N/A");
          if (dataObjects[0].buildmarker)
            buildGPSMarker(dataObjects[0],"POLICECARFEED");
          if ((dataObjects[0].lookrayson))
            buildGPSMarker(dataObjects[0],"POLICECARLOOKRAYFEED");
          break;
        case PATROLMAN_GPS_FEED:
          processWebSocketFeed(rec, gpsDetails, "GPS", "PATROLMANFEED", "N/A");
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
}

function processLocationSocketOnClose(feedType) {
  switch(feedType) {
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

function getRTGPSFeed(feedSource, feedType) {
  return S().openwsfeed(feedSource,processLocationSocketOnMessage,null,processLocationSocketOnClose,feedType);
} // getRTGPSFeed


function processWeatherFeedSocketOnMessage(feedSource, e) {
  var reader = new FileReader();
  reader.readAsBinaryString(e.data);
  reader.onload = function () {
    var rec = reader.result;
    if (null !== rec) {
      // We don't which one of the weather attributes client wants to view. Process all.
      if (dataObjects[2].locationon) {
        processWebSocketFeed(rec, weatherDetails, "WEATHER_STATION_LOCATION", "N/A", dataObjects[2]);
      }
      if (dataObjects[2].temperatureon) { 
        processWebSocketFeed(rec, weatherDetails, "WEATHER_TEMPERATURE", "TEMPERATURE", dataObjects[2]);
      }
      if (dataObjects[2].pressureon) { 
        processWebSocketFeed(rec, weatherDetails, "WEATHER_BAROMETRIC_PRESSURE", "PRESSURE", dataObjects[2]);
      }
      if (dataObjects[2].windspeedon) {
        processWebSocketFeed(rec, weatherDetails, "WEATHER_WIND_SPEED", "N/A", "N/A");
      }
      if (dataObjects[2].winddirectionon) {
        processWebSocketFeed(rec, weatherDetails, "WEATHER_WIND_DIRECTION", "N/A", "N/A");
      }
    }
  }
}

function processWeatherFeedSocketOnClose(feedSource, e) {
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

function getRTWeatherFeed(feedSource) {
  return S().openwsfeed(feedSource,processWeatherFeedSocketOnMessage,null,processWeatherFeedSocketOnClose,feedSource);
} // getRTWeatherFeed


function removeMarker(thisMarker) {
  map.removeLayer(thisMarker);
  thisMarker.update(thisMarker);
} //removeMarker

function buildWeatherStationMarker(sensorLocation) {
  if (null === weatherStationMarker) {
    weatherStationMarker = L.marker(
                          [sensorLocation.lat, sensorLocation.lon], 
                          {icon: L.icon({ iconUrl: 'http://localhost/sensorhub/images/weatherstationicon.png',
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
                                {icon: L.icon({ iconUrl: 'http://localhost/sensorhub/images/policecar.png',
                                                iconSize: [18,38],})}).addTo(map)
                              .bindPopup('<div id="pop-policeCarMarker">Latitude: ' + s_lat + '<br />Longitude: ' + s_long + '</div>', { className: 'marker-popup' , closeButton: false});
        } else {
          policeCarMarker.setLatLng([s_lat, s_long]);
          $('#pop-policeCarMarker').html('Latitude: ' + s_lat + '<br />Longitude: ' + s_long);
        }
        //log("Police car rotation->" + parseFloat(rotation));
        policeCarMarker.options.angle = parseFloat(rotation);                              
        //policeCarMarker.options.angle = -45;                              
        break;
      case "PATROLMANFEED" :
        if (patrolManMarker === null) {
          patrolManMarker = L.rotatedMarker(
                                [s_lat, s_long], 
                                {icon: L.icon({ iconUrl: 'http://localhost/sensorhub/images/policeman.png',
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
                                {icon: L.icon({ iconUrl: 'http://localhost/sensorhub/images/cameralookrays.png',
                                                iconSize: [26,51],})}).addTo(map);
        } else {
          policeCarLookRaysMarker.setLatLng([s_lat, s_long]);
        }
        //log("Police car look ray marker rotation->" + parseFloat(rotation) + " currentAxisCameraPanAngle->" + currentAxisCameraPanAngle + " PTZ_ADJUSTMENT_ANGLE_TO_ZERO->" + PTZ_ADJUSTMENT_ANGLE_TO_ZERO);
        policeCarLookRaysMarker.options.angle = parseFloat(rotation) + currentAxisCameraPanAngle + PTZ_ADJUSTMENT_ANGLE_TO_ZERO;                              
        break;
      case "PATROLMANLOOKRAYFEED" :
        if (patrolManLookRaysMarker === null) {
          patrolManLookRaysMarker = L.rotatedMarker(
                                [s_lat, s_long], 
                                {icon: L.icon({ iconUrl: 'http://localhost/sensorhub/images/cameralookrays.png',
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

function processWebSocketFeed(rec, recordDescriptor, typeofFeed, markerType, markerLocations) {
  response = S().interpretfeed(rec, recordDescriptor);
  switch (typeofFeed) {
    case "ORIENTATION":
      switch (markerType) {
        case "PATROLMAN_ORIENTATION_FEED":
          currentPatrolmanOrientation = response.heading | 0;
          break;
        case "POLICECAR_ORIENTATION_FEED":
          currentPolicecarOrientation = response.heading | 0;
          break;
      }
      break;
    case "AXIS_PAN_ANGLE":
//      log ("AXIS Pan angle: " + response.angle);
      //currentAxisCameraPanAngle = response.angle | 0;
      currentAxisCameraPanAngle = 0;
      break;
    case "GPS":
      switch (markerType) {
        case "PATROLMANFEED":
          dataObjects[1].lat = response.lat;
          dataObjects[1].lon = response.lon;
          dataObjects[1].rotation = currentPatrolmanOrientation;
          break;
        case "POLICECARFEED":
          dataObjects[0].lat = response.lat;
          dataObjects[0].lon = response.lon;
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
