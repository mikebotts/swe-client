/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var DEBUG_MODE = false;

var template = null;

var gpsFields = [], 
    weatherFields = [], 
    orientationFields = [], 
    weatherSensorLocations = [];

var WEATHER_DESCRIPTOR = 'http://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=DescribeSensor&procedure=urn:test:sensors:fakeweather&procedureDescriptionFormat=http://www.opengis.net/sensorml/2.0',
    GPS_DESCRIPTOR = 'http://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=GetResultTemplate&offering=urn:mysos:offering02&observedProperty=http://sensorml.com/ont/swe/property/Location',
    CAM_DESCRIPTOR = 'http://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=DescribeSensor&procedure=urn:test:sensors:fakecam&procedureDescriptionFormat=http://www.opengis.net/sensorml/2.0',
    ORIENTATION_DESCRIPTOR = 'http://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResultTemplate&offering=urn:android:device:FA44CWM03715-sos&observedProperty=http://sensorml.com/ont/swe/property/Orientation';

var POLICECAR_GPS_FEED = 'ws://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:FA44CWM03715-sos&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,2015-02-22T02:51:00Z/now&replaySpeed=3',
    POLICECAR_ORIENTATION_FEED = 'ws://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:FA44CWM03715-sos&observedProperty=http://sensorml.com/ont/swe/property/Orientation&temporalFilter=phenomenonTime,2015-02-22T02:51:00Z/now&replaySpeed=3',
    PATROLMAN_GPS_FEED = 'ws://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:04e4413b0a286002-sos&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,now/2015-06-01',
    //PATROLMAN_GPS_FEED = 'ws://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:FA44CWM03715-sos&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,2015-02-22T02:51:00Z/now&replaySpeed=3',
    PATROLMAN_ORIENTATION_FEED = 'ws://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:04e4413b0a286002-sos&observedProperty=http://sensorml.com/ont/swe/property/Orientation&temporalFilter=phenomenonTime,now/2015-06-01',
    //PATROLMAN_ORIENTATION_FEED = 'ws://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:FA44CWM03715-sos&observedProperty=http://sensorml.com/ont/swe/property/Orientation&temporalFilter=phenomenonTime,2015-02-22T02:51:00Z/now&replaySpeed=3',
    WEATHER_RT_FEED = 'ws://54.172.40.148:8080/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:mysos:offering03&observedProperty=http://sensorml.com/ont/swe/property/Weather&temporalFilter=phenomenonTime,now/2115-01-28T16:24:48Z';
    
var PATROL_CAR_PTZ_CAMERA_URL="http://bottsgeo.simple-url.com:2015/sensorhub/sps?";
var PTZ_TASKING_COMMAND_REPLACE_TOKEN="{SWE_PTZ_TASKING_COMMAND}"; 
var PTZ_TASKING_COMMAND_BASE='<?xml version="1.0" encoding="UTF-8"?><sps:Submit service="SPS" version="2.0" xmlns:sps="http://www.opengis.net/sps/2.0" xmlns:swe="http://www.opengis.net/swe/2.0"><sps:procedure>d136b6ea-3951-4691-bf56-c84ec7d89d72</sps:procedure><sps:taskingParameters><sps:ParameterData><sps:encoding><swe:TextEncoding blockSeparator=" " collapseWhiteSpaces="true" decimalSeparator="." tokenSeparator=","/></sps:encoding><sps:values>' + PTZ_TASKING_COMMAND_REPLACE_TOKEN + '</sps:values></sps:ParameterData></sps:taskingParameters></sps:Submit>';

var dataObjects = [];
var menuStatus=0;

var policecarsocket=null,
    policecarOrientationSocket=null,
    patrolmansocket=null,
    patrolmanOrientationSocket=null;

var currentPatrolmanOrientation=0,
    currentPolicecarOrientation=0,
    currentPolicecarCameraOrientation=0;

var policeCarMarker = null,
    patrolManMarker = null,
    liveWeatherMarker = null,
    livePolicecarLookRaysMarker = null,
    livePatrolmanLookRaysMarker = null;
          
var osm_StreetMapURL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    osm_StreetMapAttrib = '',
    osm_SatelliteMapAttrib = '',
    osm_StreetMap = L.tileLayer(osm_StreetMapURL, {maxZoom: 18, attribution: osm_StreetMapAttrib, id: 'examples.map-street'});
    ggl_SatelliteHybridMap = new L.Google('HYBRID'),
    ggl_SatelliteMap = new L.Google('SATELLITE'),
    ggl_RoadMap = new L.Google('ROADMAP'),
    map = new L.Map('map').setView(new L.LatLng(34.73, -86.585), 12);




    