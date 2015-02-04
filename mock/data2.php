<?php
date_default_timezone_set('America/Chicago');

if (!empty($_REQUEST['lat'])) $lat = (float)$_REQUEST['lat'];
if (!empty($_REQUEST['long'])) $long = (float)$_REQUEST['long'];

if (!isset($lat)) $lat = 34.706;
if (!isset($long)) $long = -86.672;

if (!empty($_REQUEST['step'])) {
  $lat += (rand(1, 10) / 1000);
  $long += (rand(1, 10) / 1000);
  if ($lat >= 34.80 || abs($long) >= 87.1) {
    $lat = 34.75;
    $long = -86.60;
  }
}

$alt = rand(90, 150);

# 2014-11-21T17:30:47.507Z
$time = date('c');

print "$alt,$lat,$long,$time";
