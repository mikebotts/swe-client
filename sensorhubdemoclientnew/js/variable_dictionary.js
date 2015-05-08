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

var myevent = $.Event('myevent');
myevent.name = 'My Event';


var DEBUG_MODE = true;

var PTZ_ADJUSTMENT_ANGLE_TO_ZERO = -67.25;

var template = null;

var sockets = {};
var socketdata = {};
var templates = {};
var socketparseddata = {};

var weatherDetails = null,
    gpsDetails = null,
    orientationDetails = null;    

var SENSORHUB_SERVER_1 = 'bottsgeo.com:8181',
    SENSORHUB_SERVER_2 = 'ec2-52-16-177-252.eu-west-1.compute.amazonaws.com:8181',
    //SENSORHUB_SERVER_3 = 'bottsgeo.simple-url.com:2015';
    SENSORHUB_SERVER_3 = '172.20.10.7:2015';
    
var WEATHER_DESCRIPTOR_BASE_URL               =  'http://' + SENSORHUB_SERVER_2 + '/sensorhub',
    GPS_DESCRIPTOR_BASE_URL                   =  'http://' + SENSORHUB_SERVER_1 + '/sensorhub',
    CAM_DESCRIPTOR_BASE_URL                   =  'http://' + SENSORHUB_SERVER_2 + '/sensorhub',
    ORIENTATION_DESCRIPTOR_BASE_URL           =  'http://' + SENSORHUB_SERVER_1 + '/sensorhub',
    PTZ_PAN_DESCRIPTOR_BASE_URL               =  'http://' + SENSORHUB_SERVER_1 + '/sensorhub';

var POLICECAR_BASE_URL                      = 'ws://' + SENSORHUB_SERVER_1 + '/sensorhub/sos?service=SOS&version=2.0&request=GetResult',
    PATROLMAN_BASE_URL                      = 'ws://' + SENSORHUB_SERVER_1 + '/sensorhub/sos?service=SOS&version=2.0&request=GetResult',
    //POLICECAR_OFFERING                      = '&offering=urn:android:device:04e4413b0a286002-sos',urn:android:device:FA44CWM03715
    POLICECAR_OFFERING                      = '&offering=urn:android:device:FA44CWM03715-sos',
    //POLICECAR_OFFERING                      = '&offering=urn:android:device:04e4413b0a286002-sos',
    PATROLMAN_OFFERING                      = '&offering=urn:android:device:04e4413b0a286002-sos',
    POLICECAR_GPS_OBSERVED_PROPERTY         = '&observedProperty=http://sensorml.com/ont/swe/property/Location',
    PATROLMAN_GPS_OBSERVED_PROPERTY         = '&observedProperty=http://sensorml.com/ont/swe/property/Location',
    POLICECAR_ORIENTATION_OBSERVED_PROPERTY = '&observedProperty=http://sensorml.com/ont/swe/property/Orientation',
    PATROLMAN_ORIENTATION_OBSERVED_PROPERTY = '&observedProperty=http://sensorml.com/ont/swe/property/Orientation',
    WEATHERSTATION_1_BASE_URL               = 'ws://' + SENSORHUB_SERVER_2 + '/sensorhub/sos?service=SOS&version=2.0&request=GetResult',
    WEATHERSTATION_1_OFFERING               = '&offering=urn:mysos:offering03',
    WEATHERSTATION_1_OBSERVED_PROPERTY      = '&observedProperty=http://sensorml.com/ont/swe/property/Weather',
    // Change temporal filter a little so that each GetResults URL is slightly different.
    // We need this because some case statements are based on URLs and will conflict with each other
    // if all the parameters are the same. We came across this situation when we made the police car feed
    // and patrol man feed use the same device.
    POLICECAR_TEMPORAL_FILTER               = '&temporalFilter=phenomenonTime,now/2015-06-01',
    PATROLMAN_TEMPORAL_FILTER               = '&temporalFilter=phenomenonTime,now/2016-06-01',
    TEMPORAL_FILTER                         = '&temporalFilter=phenomenonTime,now/2017-06-01',
    TEMPRORAL_FILTER_PLAYBACK_1             = '&temporalFilter=phenomenonTime,2015-03-10T20:00:00Z/now&replaySpeed=8',
    TEMPRORAL_FILTER_PLAYBACK_2             = '&temporalFilter=phenomenonTime,2015-03-10T20:00:01Z/now&replaySpeed=8';


var PTZ_PAN_BASE_URL           = 'ws://' + SENSORHUB_SERVER_1 + '/sensorhub/sos?service=SOS&version=2.0&request=GetResult',
    PTZ_PAN_OFFERING           = '&offering=d136b6ea-3951-4691-bf56-c84ec7d89d72-sos',
    PTZ_PAN_OBSERVED_PROPERTY  = '&observedProperty=http://sensorml.com/ont/swe/property/Pan';
    
var POLICECAR_GPS_FEED          = POLICECAR_BASE_URL + POLICECAR_OFFERING + POLICECAR_GPS_OBSERVED_PROPERTY + TEMPRORAL_FILTER_PLAYBACK_1,
    POLICECAR_ORIENTATION_FEED  = POLICECAR_BASE_URL + POLICECAR_OFFERING + POLICECAR_ORIENTATION_OBSERVED_PROPERTY + TEMPRORAL_FILTER_PLAYBACK_1,
    PATROLMAN_GPS_FEED          = PATROLMAN_BASE_URL + PATROLMAN_OFFERING + PATROLMAN_GPS_OBSERVED_PROPERTY + TEMPRORAL_FILTER_PLAYBACK_2,
    PATROLMAN_ORIENTATION_FEED  = PATROLMAN_BASE_URL + PATROLMAN_OFFERING + PATROLMAN_ORIENTATION_OBSERVED_PROPERTY + TEMPRORAL_FILTER_PLAYBACK_2,
    PTZ_PAN_FEED                = PTZ_PAN_BASE_URL + PTZ_PAN_OFFERING + PTZ_PAN_OBSERVED_PROPERTY + TEMPRORAL_FILTER_PLAYBACK_1,
    WEATHER_STATION_1_RT_FEED   = WEATHERSTATION_1_BASE_URL + WEATHERSTATION_1_OFFERING + WEATHERSTATION_1_OBSERVED_PROPERTY + TEMPORAL_FILTER;
    
var PATROL_CAR_PTZ_CAMERA_URL         = "http://" + SENSORHUB_SERVER_3 + "/sensorhub/sps?",
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
    map                     = new L.Map('map').setView(new L.LatLng(34.73, -86.585), 12);




    