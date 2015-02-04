<?php
date_default_timezone_set('America/Chicago');

if (empty($_REQUEST['load'])) die;

$response = array();
switch($_REQUEST['load']) {
  case 'OrlandoFL':
    $response['temp'] = rand(60, 100);
    $response['location_readable'] = 'Orlando, FL';
    break;
  case 'HuntsvilleAL':
    $response['temp'] = rand(40, 90);
    $response['location_readable'] = 'Huntsville, FL';
    break;
  case 'GuntersvilleAL':
    $response['temp'] = rand(40, 90);
    $response['location_readable'] = 'Guntersville, AL';
    break;
}
if (!count($response)) die;
if ($response['temp'] <= 100) $response['weather'] = 'Hot!';
if ($response['temp'] <=  90) $response['weather'] = 'Warm!';
if ($response['temp'] <=  80) $response['weather'] = 'Mild!';
if ($response['temp'] <=  70) $response['weather'] = 'Cool!';
if ($response['temp'] <=  60) $response['weather'] = 'Chilly!';
if ($response['temp'] <=  50) $response['weather'] = 'Cold!';
die(json_encode($response));
