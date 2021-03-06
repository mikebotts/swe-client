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
 *
 * The Original Code is the "Space Time Toolkit".
 *
 * The Initial Developer of the Original Code is the VAST team at the
 * University of Alabama in Huntsville (UAH). <http://vast.uah.edu>
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 */

/**
 * @date June 1, 2015
 * @public
 */

var TimeExtent = function () {
  
  var _NOW_ACCURACY = 1000;
  var _NOW = Double.MIN_VALUE;
  var _UNKNOWN = Double.MAX_VALUE;
  
  var _baseTime = Number.NaN;
  var _timeBias = 0;
  var _timeStep = 0;
  var _leadTimeDelta = 0;
  var _lagTimeDelta = 0;
  var _baseAtNow = false;  // if true baseTime is associated to machine clock
  var _endNow = false;     // if true stopTime is associated to machine clock
  var _beginNow = false;   // if true startTime is associated to machine clock
  var _timeZone = 0;
  
  addMethod(this, "init", function(baseJulianTime) {
    _baseTime = baseJulianTime;
  });
    
  addMethod(this, "init", function(startTime, stopTime) {
    setStartTime(startTime);
    setStopTime(stopTime);
  });
  
  this.copy = function() {

    var timeExtent = new TimeExtent();
    
    timeExtent.baseTime = getBaseTime();
    timeExtent.timeBias = _timeBias;
    timeExtent.timeStep = _timeStep;
    timeExtent.leadTimeDelta = _leadTimeDelta;
    timeExtent.lagTimeDelta = _lagTimeDelta;
    timeExtent.baseAtNow = _baseAtNow;
    timeExtent.endNow = _endNow;
    timeExtent.beginNow = _beginNow;
    
    return timeExtent;
  };

  addMethod(this, "init", function(baseJulianTime, timeBiasSeconds, timeStepSeconds, leadTimeDeltaSeconds, lagTimeDeltaSeconds) {

    _baseTime = baseJulianTime;
    _timeBias = timeBiasSeconds;
    _timeStep = timeStepSeconds;
    _leadTimeDelta = Math.abs(leadTimeDeltaSeconds);
    _lagTimeDelta = Math.abs(lagTimeDeltaSeconds);
  });
  

  this.setBaseTime = function (baseJulianTime) {
    _baseTime = baseJulianTime;
  }

  this.setTimeBias = function (seconds) {
    _timeBias = seconds;
  }

  this.setTimeStep(seconds) {
    _timeStep = seconds;
  }

  this.setLeadTimeDelta = function(seconds) {
    _leadTimeDelta = Math.abs(seconds);
  }

  this.setLagTimeDelta = function (seconds) {
    _lagTimeDelta = Math.abs(seconds);
  }


  this.setDeltaTimes  = function(leadDeltaSeconds, lagDeltaSeconds)
  {
    _leadTimeDelta = Math.abs(_leadDeltaSeconds);
    _lagTimeDelta = Math.abs(_lagDeltaSeconds);
  }

  /**
   * To get baseTime without bias applied (unless baseAtNow is true)
   * @return
   */
  this.getBaseTime = function () {
    if (_baseAtNow)
      return this.getNow() + _timeBias;
    else
      return _baseTime;
  }


  /**
   * To get baseTime or absTime with bias applied
   * @return
   * NOTE:  Check the logic here.  This applies timeBias twice if baseAtNow == true.
   *       Is this even needed anymore.  Only two refs in project (including one in STT
   *       from my timeWidget, which I think I can remove)
   *       Consider removing and replacing with calls to getBaseTime();
   */
  this.getAdjustedTime = function () {
    return (this.getBaseTime() + _timeBias);
  }


  this.getTimeBias = function() {
    return _timeBias;
  }

  this.getTimeStep = function() {
    return _timeStep;
  }


  this.getLeadTimeDelta = function() {
    return _leadTimeDelta;
  }


  this.getLagTimeDelta = function() {
    return _lagTimeDelta;
  }


  this.getTimeRange = function () {
    return (this.getAdjustedLeadTime() - this.getAdjustedLagTime());
  }


  this.getAdjustedLeadTime = function () {
    if (endNow)
      return this.getNow() + _timeBias;
    else
      return (this.getBaseTime() + _timeBias + _leadTimeDelta);
  }


  this.getAdjustedLagTime = function() {
    if (_beginNow)
      return this.getNow() + _timeBias;
    else
      return (this.getBaseTime() + _timeBias - _lagTimeDelta);
  }
  
  
  this.isBaseAtNow = function() {
    return _baseAtNow;
  }


  this.setBaseAtNow = function( baseAtNow) {
    _baseAtNow = baseAtNow;
  }


  this.isBeginNow = function() {
    return _beginNow;
  }


  this.setBeginNow = function( beginNow) {
    _beginNow = beginNow;
  }


  this.isEndNow = function() {
    return _endNow;
  }


  this.setEndNow = function( endNow) {
    _endNow = endNow;
  }


  /**
   * Returns number of full time steps
   * @return
   */
  this.getNumberOfSteps = function() {
    if (_timeStep == 0.0)
      return 1;
    else
      return ((this.getAdjustedLeadTime() - this.getAdjustedLagTime()) / _timeStep);
  }
  
  
  /**
   * Calculates times based on current time settings, always assuring
   * that both endpoints are included even if an uneven time step occurs
   * at the end
   */
  this.getTimes = function () {
    var time = this.getAdjustedLeadTime();
    var lagTime = this.getAdjustedLagTime();

    // if step is 0 returns two extreme points
    if (_timeStep == 0.0) {
      return [time, lagTime];
    }
        
    var timeRange = Math.abs(time - lagTime);
    var remainder = timeRange % _timeStep;
    var steps = (timeRange / _timeStep) + 1;       

    var times = [];
    if (remainder != 0.0) {
      times = new Array(steps + 1);
      times[steps] = lagTime;
    }
    else
      times = new Array(steps);

    for (var i = 0; i < steps; i++)
      times[i] = time - i * _timeStep;
    
    return times;  
  }


  this.toString = function() {
    var tString = new String("TimeExtent:");
    tString += "\n  baseTime = " + (_baseAtNow ? "now" : _baseTime);
    tString += "\n  timeBias = " + _timeBias;
    tString += "\n  timeStep = " + _timeStep;
    tString += "\n  leadTimeDelta = " + _leadTimeDelta;
    tString += "\n  lagTimeDelta = " + _lagTimeDelta;
    return tString;
  }

  /**
   * Checks if time extents are equal
   * (i.e. stop=stop AND start=start)
   * @param timeExtent
   * @return
   */
  this.equals = function(timeExtent) {
    
    if (obj === null)
      return false;
    
    if (!(obj instanceof TimeExtent))
      return false;

    if (!_baseAtNow) {
      if (( this.getAdjustedLagTime() != timeExtent.getAdjustedLagTime() ) &&
         !( this.isBeginNow() && timeExtent.isBeginNow() ))
        return false;
      
      if (( this.getAdjustedLeadTime() != timeExtent.getAdjustedLeadTime() ) &&
         !( this.isEndNow() && timeExtent.isEndNow() ))
        return false;
    }
    else
    {
      if (!timeExtent.isBaseAtNow())
        return false;
      
      if (this.getLagTimeDelta() != timeExtent.getLagTimeDelta())
        return false;
      
      if (this.getLeadTimeDelta() != timeExtent.getLeadTimeDelta())
        return false;                   
    }
    
    return true;
  }
  
  
  /**
   * Checks if this timeExtent contains the given time
   * @param time
   * @return
   */
  this.containsTime = function(time) {
    var thisLag = this.getAdjustedLagTime();
    var thisLead = this.getAdjustedLeadTime();
    
    if (time < thisLag)
      return false;
    
    if (time > thisLead)
      return false;
    
    return true;
  }
  
  
  /**
   * Checks if this timeExtent contains the given timeExtent
   * @param timeExtent
   * @return
   */
  this.containsTimeExtent = function (timeExtent) {
    var thisLag = this.getAdjustedLagTime();
    var thisLead = this.getAdjustedLeadTime();
    var otherLag = timeExtent.getAdjustedLagTime();
    var otherLead = timeExtent.getAdjustedLeadTime();
    
    if (otherLag < thisLag)
      return false;
    
    if  (otherLag > thisLead)
      return false;
    
    if (otherLead < thisLag)
      return false;        
    
    if (otherLead > thisLead)
      return false;
    
    return true;
  }
  
  
  /**
   * Checks if this timeExtent intersects the given timeExtent
   * @param timeExtent
   * @return
   */
  this.intersects = function(timeExtent) {
    var thisLag = this.getAdjustedLagTime();
    var thisLead = this.getAdjustedLeadTime();
    var otherLag = timeExtent.getAdjustedLagTime();
    var otherLead = timeExtent.getAdjustedLeadTime();
    
    if (otherLag > thisLag && otherLag < thisLead)
      return true;
    
    if (otherLead > thisLag && otherLead < thisLead)
      return true;
    
    if (otherLag <= thisLag && otherLead >= thisLead)
      return true;
    
    return false;
  }
  
  
  /**
   * Check if time is null (i.e. baseTime is not set)
   * @return
   */
  this.isNull = function() {
    return (isNaN(_baseTime) && !_baseAtNow);
  }
  
  
  /**
   * Check if this is a single point in time
   * @return
   */
  this.isTimeInstant = function() {
    return (_leadTimeDelta == 0 && _lagTimeDelta == 0);
  }
  
  
  /**
   * Resets all variables so that extent is null
   */
  this.nullify = function() {
    _baseTime = Number.NaN;
    _timeBias = 0;
    _timeStep = 0;
    _leadTimeDelta = 0;
    _lagTimeDelta = 0;
    _baseAtNow = false;
    _endNow = false;
    _beginNow = false;
  }
  
  
  /**
   * Resizes this extent so that it contains the given time value
   * @param t time value (MUST be in same reference frame as the extent)
   */
  this.resizeToContain = function(t) {
    if (isNull()) {
      _baseTime = t;
      _timeBias = 0;
      return;
    }    
    
    var adjBaseTime = this.getAdjustedTime();
    if (t > this.getAdjustedLeadTime())
      _leadTimeDelta = t - _adjBaseTime;
    else if (t < this.getAdjustedLagTime())
      _lagTimeDelta = _adjBaseTime - t; 
  }
  
  
  /**
   * Return latest value for now. This would return a new 'now' value
   * only if previous call was made more than 1 second ago.
   * @return
   */
  var now = 0;

  this.getNow() {
    var exactNow = (new Date().getTime())/1000;
    if (exactNow - now > _NOW_ACCURACY)
      now = exactNow;
    
    return now;
  }
  
  
  /**
   * Helper method to get start time
   * @return
   */
  var this.getStartTime = function() {
    return this.getAdjustedLagTime();
  }
  
  
  /**
   * Helper method to set start time
   * @param startTime
   */
  this.setStartTime(startTime) {
    _beginNow = false;
    
    if (isNaN(_baseTime) || _baseAtNow) {
      _baseTime = startTime;
      _lagTimeDelta = 0.0;
      _baseAtNow = false;
    } else if (startTime > _baseTime) {
      var stopTime = _baseTime + _leadTimeDelta;
      _baseTime = startTime;
      _leadTimeDelta = Math.max(0.0, stopTime - _baseTime);
      _lagTimeDelta = 0.0;
    } else {
      _lagTimeDelta = _baseTime - startTime;
    }
  }


  /**
   * Helper method to get stop time
   * @return
   */
  var this.getStopTime = function() {
    return this.getAdjustedLeadTime();
  }
  
  
  /**
   * Helper method to set stop timeget
   * @param stopTime
   */
  this.setStopTime = function(stopTime) {
    _endNow = false;
    
    if (isNaN(baseTime) || _baseAtNow) {
      _baseTime = stopTime;
      _leadTimeDelta = 0.0;
      _baseAtNow = false;
    } else if (stopTime < _baseTime) {
      var startTime = _baseTime - _lagTimeDelta;
      _baseTime = stopTime;
      _lagTimeDelta = Math.max(0.0, _baseTime - startTime);
      _leadTimeDelta = 0.0;
    } else {
      _leadTimeDelta = stopTime - _baseTime;
    }
  }

  /*
  this.getIsoString = function(zone) {
    if (_baseAtNow) {
      var start = _beginNow ? "now" : "unknown";
      var stop = _endNow ? "now" : "unknown";
      var duration = DateTimeFormat.formatIsoPeriod(this.getTimeRange());
      return start + "/" + stop + "/" + duration;
    } else {
      var start = _beginNow ? "now" : DateTimeFormat.formatIso(this.getStartTime(), zone);
      var stop = _endNow ? "now" : DateTimeFormat.formatIso(this.getStopTime(), zone);
      return start + "/" + stop;
    }
  }
  */


  this.getTimeZone = function() {
    return _timeZone;
  }


  this.setTimeZone = function(timeZone) {
      _timeZone = timeZone;
  }
  
} // TimeExtent

    