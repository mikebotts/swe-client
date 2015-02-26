/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
            policecarsocket = getRTGPSFeed(POLICECAR_GPS_FEED);
          }
          if (null === policecarOrientationSocket) {
            // It is possible that orientation feed is on because look rays is checked!
            policecarOrientationSocket = getRTOrientationFeed(POLICECAR_ORIENTATION_FEED,POLICECAR_GPS_FEED);
          }
          break;
        case 5: // Patrolman live gps feed (basically phone location)
          dataObjects[1].buildmarker = true;
          if (null === patrolmansocket) {
            // It is possible that GPS feed is on because patrolman lookrays is checked!
            patrolmansocket = getRTGPSFeed(PATROLMAN_GPS_FEED);
          }
          if (null===patrolmanOrientationSocket) {
            // It is possible that orientation feed is on because look rays is checked!
            patrolmanOrientationSocket = getRTOrientationFeed(PATROLMAN_ORIENTATION_FEED,PATROLMAN_GPS_FEED);
          }
          break;
        case 9: // Weather live feed
          //NOOP
          break;
        default:
          throw new Error("Unknown data object");
      }
    } else {
      // Child node
      switch (nodes[i].pId) {
        case 1:
          switch (nodes[i].id) {
            case 2: // Police car location information
              if (null !== policeCarMarker) policeCarMarker.openPopup();
              break;
            case 3: // Police car camera look rays
              dataObjects[0].lookrayson = true;
              if (null === policecarsocket) {
                // It is possible that GPS feed is on because police car is checked!
                policecarsocket = getRTGPSFeed(POLICECAR_GPS_FEED);
              }
              if (null===policecarOrientationSocket) {
                // It is possible that orientation feed is on because police car is checked!
                policecarOrientationSocket = getRTOrientationFeed(POLICECAR_ORIENTATION_FEED,POLICECAR_GPS_FEED);
              }
              break;
            case 4: // Police car live camera feed
              document.getElementById("policecarcam").style.display="block";
              break;
            default:
              throw new Error("Unknown data object");
          }
          break;
        case 5:  
          switch (nodes[i].id) {
            case 6: // Patrolman location information
              if (null !==  patrolManMarker) patrolManMarker.openPopup();
              break;
            case 7: // Patrolman camera look rays
              dataObjects[1].lookrayson = true;
              if (null === patrolmansocket) {
                // It is possible that GPS feed is on because patrolman is checked!
                patrolmansocket = getRTGPSFeed(PATROLMAN_GPS_FEED);
              }
              if (null === patrolmanOrientationSocket) {
                // It is possible that orientation feed is on because patrolman is checked!
                patrolmanOrientationSocket = getRTOrientationFeed(PATROLMAN_ORIENTATION_FEED,PATROLMAN_GPS_FEED);
              }
              break;
            case 8: // Patrolman live camera feed
              document.getElementById("patrolmancam").style.display="block";
              break;
            default:
              throw new Error("Unknown data object");
          }
        case 9: // Weather Station 1
          //getRTWeatherFeed(WEATHER_RT_FEED,"location");
          break;
        
        case 10:  
          switch (nodes[i].id) {
            
            case 11:
            case 12:
              break;
            case 13: // Station 1 - Wind Direction
              /*if (0==windDirectionFeedPollTimer) {
                document.getElementById("weather_winddirection").style.display = 'block';
                getRTWeatherFeed(WEATHER_RT_FEED,"winddirection");                
              }*/
              break;
            case 14: // Station 1 - Wind Speed
              /*if (0==windSpeedFeedPollTimer) {
                document.getElementById("weather_windspeed").style.display = 'block';
                getRTWeatherFeed(WEATHER_RT_FEED,"windspeed");                
              }*/
              break;
            default:
              throw new Error("Unknown data object");
          }
      }
    }
  }  
}

function processUnCheckedNodes(nodes) {
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
            }
          } else {
            // Turn off police car marker.
            map.removeLayer(policeCarMarker);
            policeCarMarker.update(policeCarMarker);
            policeCarMarker=null;
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
            map.removeLayer(patrolManMarker);
            patrolManMarker.update(patrolManMarker);
            patrolManMarker=null;
          }
          break;
        case 9: // Weather live feed
          break;
        default:
          throw new Error("Unknown data object");
      }
    } else {
      // Child node
      switch (nodes[i].pId) {
        case 1:
        //alert ("Parent: " + nodes[i].pId + ", Child: " + nodes[i].id);
          switch (nodes[i].id) {
            case 2: // Police car location information
              if (null !== policeCarMarker) policeCarMarker.closePopup();
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
                map.removeLayer(livePolicecarLookRaysMarker);
                livePolicecarLookRaysMarker.update(livePolicecarLookRaysMarker);
                livePolicecarLookRaysMarker=null;
              }
              break;
            case 4: // Police car live camera feed
               document.getElementById("policecarcam").style.display="none";
              break;
            default:
              throw new Error("Unknown data object");
          }
          break;
        case 5:  
          switch (nodes[i].id) {
            case 6: // Patrolman location information
              if (null !== patrolManMarker) patrolManMarker.closePopup();
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
                map.removeLayer(livePatrolmanLookRaysMarker);
                livePatrolmanLookRaysMarker.update(livePatrolmanLookRaysMarker);
                livePatrolmanLookRaysMarker=null;
              }
              break;
            case 8: // Patrolman live camera feed
              document.getElementById("patrolmancam").style.display="none";              
              break;
            default:
              throw new Error("Unknown data object");
          }
          break;
        case 9: // Weather Station 1
          //clearInterval(weatherLocationPollTimer);
          //weatherLocationPollTimer = 0;            
          break;
        case 10:  
          switch (nodes[i].id) {
            case 11:
            case 12:
              break;
            case 13: // Station 1 - Wind Direction
              //clearInterval(windDirectionFeedPollTimer);
              //windDirectionFeedPollTimer = 0;            
              document.getElementById("weather_winddirection").style.display = 'none';
              break;
            case 14: // Station 1 - Wind Speed
              //clearInterval(windSpeedFeedPollTimer);
              //windSpeedFeedPollTimer = 0;            
              document.getElementById("weather_windspeed").style.display = 'none';
              break;
            default:
              throw new Error("Unknown data object");
          }
          break;
      }
    }
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