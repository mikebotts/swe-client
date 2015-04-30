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

var DEBUG_MODE = false;

var PTZ_ADJUSTMENT_ANGLE_TO_ZERO = -67.25;

var template = null;

var gpsFields         = [], 
    weatherFields     = [], 
    orientationFields = [],
    axisPanFields     = [];

var SERVER_BOTTS_GEO = 'bottsgeo.com:8181',
    SERVER_SENSIA = 'sensiasoft.net:8181',
    //SERVER_PTZ = 'bottsgeo.simple-url.com:2015';
    SERVER_PTZ = '172.20.10.7:2015';
    //SERVER_PTZ = '172.56.4.247:2015';
    
var MIKES_NEXUS = 'urn:android:device:04e4413b0a286002-sos',
	MANIS_ANDROID = 'urn:android:device:FA44CWM03715-sos',
	TIMS_ANDROID = 'urn:android:device:060693280a28e015-sos',
	AXIS_CAMERA = 'd136b6ea-3951-4691-bf56-c84ec7d89d72-sos';
	
	
var WEATHER_DESCRIPTOR_BASE_URL               =  'http://' + SERVER_SENSIA + '/sensorhub/sos?service=SOS&version=2.0',
    GPS_DESCRIPTOR_BASE_URL                   =  'http://' + SERVER_BOTTS_GEO + '/sensorhub/sos?service=SOS&version=2.0',
    CAM_DESCRIPTOR_BASE_URL                   =  'http://' + SERVER_SENSIA + '/sensorhub/sos?service=SOS&version=2.0',
    ORIENTATION_DESCRIPTOR_BASE_URL           =  'http://' + SERVER_BOTTS_GEO + '/sensorhub/sos?service=SOS&version=2.0',
    PTZ_PAN_DESCRIPTOR_BASE_URL               =  'http://' + SERVER_BOTTS_GEO + '/sensorhub/sos?service=SOS&version=2.0';
    
var WEATHER_DESCRIPTOR_REQUEST                =  '&request=DescribeSensor',
    GPS_DESCRIPTOR_REQUEST                    =  '&request=GetResultTemplate',
    CAM_DESCRIPTOR_REQUEST                    =  '&request=DescribeSensor',
    ORIENTATION_DESCRIPTOR_REQUEST            =  '&request=GetResultTemplate',
    PTZ_PAN_DESCRIPTOR_REQUEST                =  '&request=GetResultTemplate',
    WEATHER_DESCRIPTOR_PROCEDURE              =  '&procedure=urn:test:sensors:fakeweather',
    //GPS_DESCRIPTOR_DESCRIPTOR_OFFERING        =  '&offering=' + MANIS_ANDROID,
    GPS_DESCRIPTOR_DESCRIPTOR_OFFERING        =  '&offering=' + MIKES_NEXUS,
    CAM_DESCRIPTOR_PROCEDURE                  =  '&procedure=urn:test:sensors:fakecam',
    ORIENTATION_DESCRIPTOR_OFFERING           =  '&offering=' + MIKES_NEXUS,
    PTZ_PAN_DESCRIPTOR_OFFERING               =  '&offering=' + AXIS_CAMERA,
    WEATHER_DESCRIPTOR_DESCRIPTION_FORMAT     =  '&procedureDescriptionFormat=http://www.opengis.net/sensorml/2.0',
    GPS_DESCRIPTOR_OBSERVED_PROPERTY          =  '&observedProperty=http://sensorml.com/ont/swe/property/Location',
    CAM_DESCRIPTOR_DESCRIPTION_FORMAT         =  '&procedureDescriptionFormat=http://www.opengis.net/sensorml/2.0',
    ORIENTATION_DESCRIPTOR_OBSERVED_PROPERTY  =  '&observedProperty=http://sensorml.com/ont/swe/property/Orientation',
    PTZ_PAN_DESCRIPTOR_OBSERVED_PROPERTY      =  '&observedProperty=http://sensorml.com/ont/swe/property/Pan';
    
var WEATHER_DESCRIPTOR      =  WEATHER_DESCRIPTOR_BASE_URL + WEATHER_DESCRIPTOR_REQUEST + WEATHER_DESCRIPTOR_PROCEDURE + WEATHER_DESCRIPTOR_DESCRIPTION_FORMAT,
    GPS_DESCRIPTOR          =  GPS_DESCRIPTOR_BASE_URL + GPS_DESCRIPTOR_REQUEST + GPS_DESCRIPTOR_DESCRIPTOR_OFFERING + GPS_DESCRIPTOR_OBSERVED_PROPERTY,
    CAM_DESCRIPTOR          =  CAM_DESCRIPTOR_BASE_URL + CAM_DESCRIPTOR_REQUEST + CAM_DESCRIPTOR_PROCEDURE + CAM_DESCRIPTOR_DESCRIPTION_FORMAT,
    ORIENTATION_DESCRIPTOR  =  ORIENTATION_DESCRIPTOR_BASE_URL + ORIENTATION_DESCRIPTOR_REQUEST + ORIENTATION_DESCRIPTOR_OFFERING + ORIENTATION_DESCRIPTOR_OBSERVED_PROPERTY,
    PTZ_PAN_DESCRIPTOR      =  PTZ_PAN_DESCRIPTOR_BASE_URL + PTZ_PAN_DESCRIPTOR_REQUEST + PTZ_PAN_DESCRIPTOR_OFFERING + PTZ_PAN_DESCRIPTOR_OBSERVED_PROPERTY;

var POLICECAR_BASE_URL                      = 'ws://' + SERVER_BOTTS_GEO + '/sensorhub/sos?service=SOS&version=2.0&request=GetResult',
    PATROLMAN_BASE_URL                      = 'ws://' + SERVER_BOTTS_GEO + '/sensorhub/sos?service=SOS&version=2.0&request=GetResult',
    //POLICECAR_OFFERING                      = '&offering=' + MIKES_NEXUS,
    POLICECAR_OFFERING                      = '&offering=' + TIMS_ANDROID,
    //POLICECAR_OFFERING                      = '&offering=' + MANIS_ANDROID,
    //PATROLMAN OFFERING                      = '&offering=' + MANIS_ANDROID,
    PATROLMAN_OFFERING                      = '&offering=' + MIKES_NEXUS;
    
    
var POLICECAR_GPS_OBSERVED_PROPERTY         = '&observedProperty=http://sensorml.com/ont/swe/property/Location',
    PATROLMAN_GPS_OBSERVED_PROPERTY         = '&observedProperty=http://sensorml.com/ont/swe/property/Location',
    POLICECAR_ORIENTATION_OBSERVED_PROPERTY = '&observedProperty=http://sensorml.com/ont/swe/property/Orientation',
    PATROLMAN_ORIENTATION_OBSERVED_PROPERTY = '&observedProperty=http://sensorml.com/ont/swe/property/Orientation';
    
var WEATHERSTATION_1_BASE_URL               = 'ws://' + SERVER_SENSIA + '/sensorhub/sos?service=SOS&version=2.0&request=GetResult',
    WEATHERSTATION_1_OFFERING               = '&offering=urn:mysos:offering03',
    WEATHERSTATION_1_OBSERVED_PROPERTY      = '&observedProperty=http://sensorml.com/ont/swe/property/Weather';
    
    // Change temporal filter a little so that each GetResults URL is slightly different.
    // We need this because some case statements are based on URLs and will conflict with each other
    // if all the parameters are the same. We came across this situation when we made the police car feed
    // and patrol man feed use the same device.
var POLICECAR_TEMPORAL_FILTER               = '&temporalFilter=phenomenonTime,now/2015-09-01',
    PATROLMAN_TEMPORAL_FILTER               = '&temporalFilter=phenomenonTime,now/2015-00-02',
    TEMPORAL_FILTER                         = '&temporalFilter=phenomenonTime,now/2015-09-03',
    TEMPORAL_FILTER_PLAYBACK_1             = '&temporalFilter=phenomenonTime,2015-03-07T20:20:00Z/now&replaySpeed=1',
    TEMPORAL_FILTER_PLAYBACK_2             = '&temporalFilter=phenomenonTime,2015-03-07T21:20:01Z/now&replaySpeed=1';


var PTZ_PAN_BASE_URL           = 'ws://' + SERVER_BOTTS_GEO + '/sensorhub/sos?service=SOS&version=2.0&request=GetResult',
    PTZ_PAN_OFFERING           = '&offering=' + AXIS_CAMERA,
    PTZ_PAN_OBSERVED_PROPERTY  = '&observedProperty=http://sensorml.com/ont/swe/property/Pan';

// Live temporal feeds    
var POLICECAR_GPS_FEED          = POLICECAR_BASE_URL + POLICECAR_OFFERING + POLICECAR_GPS_OBSERVED_PROPERTY + TEMPORAL_FILTER,
    POLICECAR_ORIENTATION_FEED  = POLICECAR_BASE_URL + POLICECAR_OFFERING + POLICECAR_ORIENTATION_OBSERVED_PROPERTY + TEMPORAL_FILTER,
    PATROLMAN_GPS_FEED          = PATROLMAN_BASE_URL + PATROLMAN_OFFERING + PATROLMAN_GPS_OBSERVED_PROPERTY + TEMPORAL_FILTER,
    PATROLMAN_ORIENTATION_FEED  = PATROLMAN_BASE_URL + PATROLMAN_OFFERING + PATROLMAN_ORIENTATION_OBSERVED_PROPERTY + TEMPORAL_FILTER,
    PTZ_PAN_FEED                = PTZ_PAN_BASE_URL + PTZ_PAN_OFFERING + PTZ_PAN_OBSERVED_PROPERTY + TEMPORAL_FILTER,
    WEATHER_STATION_1_RT_FEED   = WEATHERSTATION_1_BASE_URL + WEATHERSTATION_1_OFFERING + WEATHERSTATION_1_OBSERVED_PROPERTY + TEMPORAL_FILTER;

// Playback temporal feeds    
//var POLICECAR_GPS_FEED          = POLICECAR_BASE_URL + POLICECAR_OFFERING + POLICECAR_GPS_OBSERVED_PROPERTY + TEMPORAL_FILTER_PLAYBACK_1,
//    POLICECAR_ORIENTATION_FEED  = POLICECAR_BASE_URL + POLICECAR_OFFERING + POLICECAR_ORIENTATION_OBSERVED_PROPERTY + TEMPORAL_FILTER_PLAYBACK_1,
//    PATROLMAN_GPS_FEED          = PATROLMAN_BASE_URL + PATROLMAN_OFFERING + PATROLMAN_GPS_OBSERVED_PROPERTY + TEMPORAL_FILTER_PLAYBACK_2,
//    PATROLMAN_ORIENTATION_FEED  = PATROLMAN_BASE_URL + PATROLMAN_OFFERING + PATROLMAN_ORIENTATION_OBSERVED_PROPERTY + TEMPORAL_FILTER_PLAYBACK_2,
//    PTZ_PAN_FEED                = PTZ_PAN_BASE_URL + PTZ_PAN_OFFERING + PTZ_PAN_OBSERVED_PROPERTY + TEMPORAL_FILTER_PLAYBACK_1,
//    WEATHER_STATION_1_RT_FEED   = WEATHERSTATION_1_BASE_URL + WEATHERSTATION_1_OFFERING + WEATHERSTATION_1_OBSERVED_PROPERTY + TEMPORAL_FILTER;
    
var PATROL_CAR_PTZ_CAMERA_URL         = "http://" + SERVER_PTZ + "/sensorhub/sps?",
    PTZ_TASKING_COMMAND_REPLACE_TOKEN = "{SWE_PTZ_TASKING_COMMAND}",
    PTZ_TASKING_COMMAND_BASE          = '<?xml version="1.0" encoding="UTF-8"?><sps:Submit service="SPS" version="2.0" xmlns:sps="http://www.opengis.net/sps/2.0" xmlns:swe="http://www.opengis.net/swe/2.0"><sps:procedure>d136b6ea-3951-4691-bf56-c84ec7d89d72</sps:procedure><sps:taskingParameters><sps:ParameterData><sps:encoding><swe:TextEncoding blockSeparator=" " collapseWhiteSpaces="true" decimalSeparator="." tokenSeparator=","/></sps:encoding><sps:values>' + PTZ_TASKING_COMMAND_REPLACE_TOKEN + '</sps:values></sps:ParameterData></sps:taskingParameters></sps:Submit>';

var dataObjects = [];
var menuStatus  = 0;

var policecarsocket             = null,
    policecarOrientationSocket  = null,
    patrolmansocket             = null,
    patrolmanOrientationSocket  = null,
    weatherStationSocket        = null,
    ptzSocket                   = null;

var currentPatrolmanOrientation = 0,
    currentPolicecarOrientation = 0,
    currentAxisCameraPanAngle   = 0;

var policeCarMarker                 = null,
    patrolManMarker                 = null,
    policeCarLookRaysMarker         = null,
    patrolManLookRaysMarker         = null,
    weatherStationMarker            = null,
    weatherStationTemperatureMarker = null,
    weatherStationPressureMarker    = null;
          
var osm_StreetMapURL        = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    osm_StreetMapAttrib     = '',
    osm_SatelliteMapAttrib  = '',
    osm_StreetMap           = L.tileLayer(osm_StreetMapURL, {maxZoom: 18, attribution: osm_StreetMapAttrib, id: 'swe.map-street'});
    ggl_SatelliteHybridMap  = new L.Google('HYBRID'),
    ggl_SatelliteMap        = new L.Google('SATELLITE'),
    ggl_RoadMap             = new L.Google('ROADMAP'),
    // Huntsville  34.727024, -86.655947
    //map                     = new L.Map('map').setView(new L.LatLng(34.73, -86.585), 12);
    map                     = new L.Map('map').setView(new L.LatLng(34.727024, -86.655947), 12);
    // Ft Payne
    //map                     = new L.Map('map').setView(new L.LatLng(34.443525, -85.720135), 12);




    