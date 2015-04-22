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

var zNodes = [
  {id:1, pId:0, name:"Patrol Car 257", open:true, icon:"ztree/img/diy/policecar.png"},
  {id:2, pId:1, name:"Location", icon:"ztree/img/diy/location.png"},
  {id:3, pId:1, name:"Camera Look Rays", icon:"ztree/img/diy/lookrays.png"},
  {id:4, pId:1, name:"Video", icon:"ztree/img/diy/camera.png"},
  {id:5, pId:0, name:"Patrolman 308", open:true, icon:"ztree/img/diy/policeman.png"},
  {id:6, pId:5, name:"Location", icon:"ztree/img/diy/location.png"},
  {id:7, pId:5, name:"Camera Look Rays", icon:"ztree/img/diy/lookrays.png"},
  {id:8, pId:5, name:"Video", icon:"ztree/img/diy/camera.png"},
  {id:9, pId:0, name:"Live Weather", open:true, nocheck:true, icon:"ztree/img/diy/weather.png"},
  {id:10, pId:9, name:"Station 1", open:true, icon:"ztree/img/diy/weatherstation.png"},
  {id:11, pId:10, name:"Pressure", open:true, icon:"ztree/img/diy/barometer.png"},
  {id:12, pId:10, name:"Temperature", open:true, icon:"ztree/img/diy/temperature.png"},
  {id:13, pId:10, name:"Wind Direction", open:true, icon:"ztree/img/diy/winddirection.png"},
  {id:14, pId:10, name:"Wind Speed", open:true, icon:"ztree/img/diy/windspeed.png"},
  {id:15, pId:9, name:"Station 2", open:true,chkDisabled:true, icon:"ztree/img/diy/weatherstation.png"},
  {id:16, pId:15, name:"Pressure", open:true,chkDisabled:true, icon:"ztree/img/diy/barometer.png"},
  {id:17, pId:15, name:"Temperature", open:true,chkDisabled:true, icon:"ztree/img/diy/temperature.png"},
  {id:18, pId:15, name:"Wind Direction", open:true,chkDisabled:true, icon:"ztree/img/diy/winddirection.png"},
  {id:19, pId:15, name:"Wind Speed", open:true, chkDisabled:true, icon:"ztree/img/diy/windspeed.png"},  
];

var setting = {
  check: {
    enable: true,
    chkboxType: {"Y":"", "N":""}
  },
  view: {
    dblClickExpand: false
  },
  data: {
    simpleData: {
      enable: true
    }
  },
  callback: {
    beforeClick: beforeClick,
    onCheck: onCheck
  }
};

function beforeClick(treeId, treeNode) {
  var zTree = $.fn.zTree.getZTreeObj("dataObjectsTree");
  zTree.checkNode(treeNode, !treeNode.checked, null, true);
  return false;
}

function onCheck(e, treeId, treeNode) {
  
  var zTree = $.fn.zTree.getZTreeObj("dataObjectsTree"),
  nodes = zTree.getCheckedNodes(true);
  processCheckedNodes (nodes);
  nodes = zTree.getCheckedNodes(false);
  processUnCheckedNodes (nodes);

}

function processCheckedNodes(nodes) {
  for (var i=0, l=nodes.length; i<l; i++) {
    if (null === nodes[i].pId) {
      // Parent node
      switch (nodes[i].id) {
        case 1: // Police car live gps feed
          dataObjects[0].buildmarker = true;
          if (null === policecarsocket) {
            // It is possible that GPS feed is on because police car lookrays is checked!
            var feedURL = S(GPS_DESCRIPTOR_BASE_URL).getresultwsurl("urn:android:device:FA44CWM03715-sos", "http://sensorml.com/ont/swe/property/Location", "2015-03-07T20:20:00Z/now&replaySpeed=8");
            policecarsocket = getRTGPSFeed(feedURL, POLICECAR_GPS_FEED);
          }
          if (null === policecarOrientationSocket) {
            // It is possible that orientation feed is on because look rays is checked!
            var feedURL = S(GPS_DESCRIPTOR_BASE_URL).getresultwsurl("urn:android:device:FA44CWM03715-sos", "http://sensorml.com/ont/swe/property/Orientation", "2015-03-07T20:20:00Z/now&replaySpeed=8");
            policecarOrientationSocket = getRTOrientationFeed(feedURL,POLICECAR_GPS_FEED);
          }
          break;
        case 5: // Patrolman live gps feed (basically phone location)
          dataObjects[1].buildmarker = true;
          if (null === patrolmansocket) {
            // It is possible that GPS feed is on because patrolman lookrays is checked!
            var feedURL = S(GPS_DESCRIPTOR_BASE_URL).getresultwsurl("urn:android:device:04e4413b0a286002-sos", "http://sensorml.com/ont/swe/property/Location", "2015-03-07T21:20:01Z/now&replaySpeed=8");
            patrolmansocket = getRTGPSFeed(feedURL,PATROLMAN_GPS_FEED);
          }
          if (null===patrolmanOrientationSocket) {
            // It is possible that orientation feed is on because look rays is checked!
            var feedURL = S(GPS_DESCRIPTOR_BASE_URL).getresultwsurl("urn:android:device:04e4413b0a286002-sos", "http://sensorml.com/ont/swe/property/Orientation", "2015-03-07T21:20:01Z/now&replaySpeed=8");
            patrolmanOrientationSocket = getRTOrientationFeed(feedURL,PATROLMAN_GPS_FEED);
          }
          break;
      }
    } else {
      // Child node
      switch (nodes[i].pId) {
        case 1:
          switch (nodes[i].id) {
            case 2: // Police car location information
              if (null !== policeCarMarker) 
                policeCarMarker.openPopup();
              break;
            case 3: // Police car camera look rays
              dataObjects[0].lookrayson = true;
              if (null === policecarsocket) {
                // It is possible that GPS feed is on because police car is checked!
                var feedURL = S(GPS_DESCRIPTOR_BASE_URL).getresultwsurl("urn:android:device:FA44CWM03715-sos", "http://sensorml.com/ont/swe/property/Location", "2015-03-07T20:20:00Z/now&replaySpeed=8");
                policecarsocket = getRTGPSFeed(feedURL, POLICECAR_GPS_FEED);
              }
              if (null===policecarOrientationSocket) {
                // It is possible that orientation feed is on because police car is checked!
                var feedURL = S(GPS_DESCRIPTOR_BASE_URL).getresultwsurl("urn:android:device:FA44CWM03715-sos", "http://sensorml.com/ont/swe/property/Orientation", "2015-03-07T20:20:00Z/now&replaySpeed=8");
                policecarOrientationSocket = getRTOrientationFeed(feedURL,POLICECAR_GPS_FEED);
              }
              if (null === ptzSocket) {
                //log ("getPTZPanFeed:: " + PTZ_PAN_FEED);
                //ptzSocket = getPTZPanFeed(PTZ_PAN_FEED);
              }
              break;
            case 4: // Police car live camera feed
              document.getElementById("policecarcam").style.display="block";
              break;
          }
          break;
        case 5:  
          switch (nodes[i].id) {
            case 6: // Patrolman location information
              if (null !==  patrolManMarker) 
                patrolManMarker.openPopup();
              break;
            case 7: // Patrolman camera look rays
              dataObjects[1].lookrayson = true;
              if (null === patrolmansocket) {
                // It is possible that GPS feed is on because patrolman is checked!
                var feedURL = S(GPS_DESCRIPTOR_BASE_URL).getresultwsurl("urn:android:device:04e4413b0a286002-sos", "http://sensorml.com/ont/swe/property/Location", "2015-03-07T21:20:01Z/now&replaySpeed=8");
                patrolmansocket = getRTGPSFeed(feedURL,PATROLMAN_GPS_FEED);
              }
              if (null === patrolmanOrientationSocket) {
                // It is possible that orientation feed is on because patrolman is checked!
                var feedURL = S(GPS_DESCRIPTOR_BASE_URL).getresultwsurl("urn:android:device:04e4413b0a286002-sos", "http://sensorml.com/ont/swe/property/Orientation", "2015-03-07T21:20:01Z/now&replaySpeed=8");
                patrolmanOrientationSocket = getRTOrientationFeed(feedURL,PATROLMAN_GPS_FEED);
              }
              break;
            case 8: // Patrolman live camera feed
              document.getElementById("patrolmancam").style.display="block";
              break;
          }
          break;
        case 9:
          dataObjects[2].locationon = true;
          var feedURL = S(WEATHER_DESCRIPTOR_BASE_URL).getresultwsurl("urn:mysos:offering03", "http://sensorml.com/ont/swe/property/Weather", "now/2017-06-01");
          weatherStationSocket = getRTWeatherFeed(feedURL);
          break;
        case 10:
          switch (nodes[i].id) {
            case 11:
              dataObjects[2].pressureon = true;
              break;
            case 12:
              dataObjects[2].temperatureon = true;
              break;
            case 13:
              dataObjects[2].winddirectionon = true;
              document.getElementById("weather_winddirection").style.display = 'block';
              break;
            case 14:
              dataObjects[2].windspeedon = true;
              document.getElementById("weather_windspeed").style.display = 'block';
              break;
          }
          if (null === weatherStationSocket) {
            var feedURL = S(WEATHER_DESCRIPTOR_BASE_URL).getresultwsurl("urn:mysos:offering03", "http://sensorml.com/ont/swe/property/Weather", "now/2017-06-01");
            weatherStationSocket = getRTWeatherFeed(feedURL);
          }
          break;
      }
    }
  }  
}

function processUnCheckedNodes(nodes) {
  try {
  for (var i=0, l=nodes.length; i<l; i++) {
    if (null === nodes[i].pId) {
      // Parent node
      switch (nodes[i].id) {
        case 1: // Police car live gps feed
          dataObjects[0].buildmarker = false;
          if (!dataObjects[0].lookrayson) {
            // If police car look rays are on, then we need the car feed!
            if (null !== policecarsocket) {
              if (WebSocket.OPEN === policecarsocket.readyState) { 
                policecarsocket.close();
                policecarsocket = null;
              }
              if (null !== ptzSocket) {
                if (WebSocket.OPEN === ptzSocket.readyState) {
                  ptzSocket.close();
                  ptzSocket = null;
                }
              }
            }
          } else {
            // Turn off police car marker.
            if (null !== policeCarMarker) {
              removeMarker(policeCarMarker);
              policeCarMarker=null;
            }
          }
          break;
        case 5: // Patrolman live gps feed (basically phone location)
          dataObjects[1].buildmarker = false;
          if (!dataObjects[1].lookrayson) {
             // If patrolman look rays are on, then we need the car feed!
            if (null !== patrolmansocket) {
              if (WebSocket.OPEN === patrolmansocket.readyState) {
                patrolmansocket.close();
                patrolmansocket = null;
              } 
            }
          } else {
            // Turn off patrolman marker
            if (null !== patrolManMarker) {
              removeMarker(patrolManMarker);
              patrolManMarker=null;
            }
          }
          break;
      }
    } else {
      // Child node
      switch (nodes[i].pId) {
        case 1:
          switch (nodes[i].id) {
            case 2: // Police car location information
              if (null !== policeCarMarker) 
                policeCarMarker.closePopup();
              break;
            case 3: // Police car camera look rays
              dataObjects[0].lookrayson = false;
              if (null === policecarsocket) {
                // If police car is checked, then we still need orientation feed.
                if (null !== policecarOrientationSocket) {
                  if (WebSocket.OPEN === policecarOrientationSocket.readyState) {
                    policecarOrientationSocket.close();
                    policecarOrientationSocket = null;
                  }
                }                
              } else {
                // Police car socket is still alive but, we must turn off look rays
                if (null !== policeCarLookRaysMarker) {
                  removeMarker(policeCarLookRaysMarker);
                  policeCarLookRaysMarker=null;
                }
              }
              break;
            case 4: // Police car live camera feed
               document.getElementById("policecarcam").style.display="none";
               break;
          }
          break;
        case 5:  
          switch (nodes[i].id) {
            case 6: // Patrolman location information
              if (null !== patrolManMarker) 
                patrolManMarker.closePopup();
              break;
            case 7: // Patrolman camera look rays
              dataObjects[1].lookrayson = false;
              if (null === patrolmansocket) {
                // If patrolman is checked, then we still need orientation feed.
                if (null !== patrolmanOrientationSocket) {
                  if (WebSocket.OPEN === patrolmanOrientationSocket.readyState) {
                    patrolmanOrientationSocket.close();
                    patrolmanOrientationSocket = null;
                  }
                }
              } else {
                // Patrolman socket is still alive but, we must turn off look rays
                if (null !== patrolManLookRaysMarker) {
                  removeMarker(patrolManLookRaysMarker);
                  patrolManLookRaysMarker=null;
                }
              }
              break;
            case 8: // Patrolman live camera feed
              document.getElementById("patrolmancam").style.display="none";              
              break;
          }
          break;
        case 9: // Weather Station 1
          if (null !== weatherStationMarker) {
            removeMarker(weatherStationMarker);
            weatherStationMarker=null;
          }
          dataObjects[2].locationon = false;
          break;
        case 10:
          switch (nodes[i].id) {
            case 11:
              dataObjects[2].pressureon = false;
              if (null !== weatherStationPressureMarker) {
                removeMarker(weatherStationPressureMarker);
                weatherStationPressureMarker=null;
              }
              break;
            case 12:
              dataObjects[2].temperatureon = false;
              if (null !== weatherStationTemperatureMarker) {
                removeMarker(weatherStationTemperatureMarker);
                weatherStationTemperatureMarker=null;
              }
              break;
            case 13:
              dataObjects[2].winddirectionon = false;
              document.getElementById("weather_winddirection").style.display = 'none';
              break;
            case 14:
              dataObjects[2].windspeedon = false;
              document.getElementById("weather_windspeed").style.display = 'none';
              break;
          }
          if ((!dataObjects[2].windspeedon) && (!dataObjects[2].winddirectionon) &&
              (!dataObjects[2].pressureon) && (!dataObjects[2].temperatureon) &&
              (!dataObjects[2].locatioon)){
            if (null !== weatherStationSocket) {
              if (WebSocket.OPEN === weatherStationSocket.readyState) {
                weatherStationSocket.close();
                weatherStationSocket = null;
              }
            }    
          }
          break;
      }
    }
  }  
    
  } catch (e) {
    alert(e);
  }
}

function showMenu() {
  if (menuStatus==0) {      
  var selectedObj = $("#selectObjects");
  var selectedOffset = $("#selectObjects").offset();
  $("#menuContent").css({left:selectedOffset.left + "px", top:selectedOffset.top + selectedObj.outerHeight() + "px"}).slideDown("fast");

  $("body").bind("mousedown", onBodyDown);
  menuStatus=1;
  } else {
    hideMenu();
    menuStatus=0;
    
  }

}

function hideMenu() {
  $("#menuContent").fadeOut("fast");
  $("body").unbind("mousedown", onBodyDown);
}

function onBodyDown(event) {
  if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
    hideMenu();
  }
}

$(document).ready(function(){
  $.fn.zTree.init($("#dataObjectsTree"), setting, zNodes);
});