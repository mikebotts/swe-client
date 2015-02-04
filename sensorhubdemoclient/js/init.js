var CONSOLE_DEBUG = true;
$( document ).ready(function() {

  $('#selectObjects').click(function (e) {
    e.preventDefault();
    showMenu();
  });
});
function callDemo(location) {
  _con('callDemo start on ' + location);
  var el = $('#pop-' + location);
  el.html('Loading ...');
  $.get( "mock/temp.php", { load: location  },
    function (data) {
      _con(data);
      var html = 'It is ' + data.temp + ' and it is ' + data.weather;
      el.html(html);
      makeGuage('pop-' + location + '-guage', data.temp);
      _con(location + ' html=' + html);
    }, 'json');
  _con('callDemo end on ' + location);
}
function refreshAllPoints() {
  _con('refreshAllPoints done');
  callDemo('HuntsvilleAL');
  callDemo('GuntersvilleAL');
  callDemo('OrlandoFL');
  _con('refreshAllPoints done');
}
function _con(obj) {
  if (CONSOLE_DEBUG) console.log(obj);
}
map.on('popupopen', mapPopupOpen);
function mapPopupOpen(e) {
  _con('mapPopupOpen start');
  _con(e);
  _con('mapPopupOpen end');
}
