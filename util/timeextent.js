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

/**
 * @date June 1, 2015
 * @public
 */

var TimeExtent = function () {
  
  var _NOW_ACCURACY = 1000;
  var _NOW = Double.MIN_VALUE;
  var _UNKNOWN = Double.MAX_VALUE;
  
  var _baseTime = Double.NaN;
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
      return getNow() + _timeBias;
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
    return (getBaseTime() + _timeBias);
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
    return (getAdjustedLeadTime() - getAdjustedLagTime());
  }


  this.getAdjustedLeadTime = function () {
    if (endNow)
      return getNow() + _timeBias;
    else
      return (getBaseTime() + _timeBias + _leadTimeDelta);
  }


  this.getAdjustedLagTime = function() {
    if (beginNow)
      return getNow() + _timeBias;
    else
      return (getBaseTime() + _timeBias - _lagTimeDelta);
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
      return ((getAdjustedLeadTime() - getAdjustedLagTime()) / _timeStep);
  }
  
  
  /**
   * Calculates times based on current time settings, always assuring
   * that both endpoints are included even if an uneven time step occurs
   * at the end
   */
  this.getTimes = function () {
    var time = getAdjustedLeadTime();
    var lagTime = getAdjustedLagTime();

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
    tString += "\n  baseTime = " + (baseAtNow ? "now" : baseTime);
    tString += "\n  timeBias = " + timeBias;
    tString += "\n  timeStep = " + timeStep;
    tString += "\n  leadTimeDelta = " + leadTimeDelta;
    tString += "\n  lagTimeDelta = " + lagTimeDelta;
    return tString;
  }


  public boolean equals(Object obj)
  {
      if (obj == null)
              return false;
      
      if (!(obj instanceof TimeExtent))
              return false;
      
      return equals((TimeExtent)obj);
  }
  
  
  /**
   * Checks if time extents are equal (no null check)
   * (i.e. stop=stop AND start=start)
   * @param timeExtent
   * @return
   */
  public boolean equals(TimeExtent timeExtent)
  {
      if (!baseAtNow)
      {
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
  public boolean intersects(TimeExtent timeExtent)
  {
      double thisLag = this.getAdjustedLagTime();
      double thisLead = this.getAdjustedLeadTime();
      double otherLag = timeExtent.getAdjustedLagTime();
      double otherLead = timeExtent.getAdjustedLeadTime();
      
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
    return (Double.isNaN(_baseTime) && !_baseAtNow);
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
    _baseTime = Double.NaN;
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
  public void resizeToContain(double t)
  {
      if (isNull())
      {
          baseTime = t;
          timeBias = 0;
          return;
      }    
      
      double adjBaseTime = getAdjustedTime();
      if (t > getAdjustedLeadTime())
          leadTimeDelta = t - adjBaseTime;
      else if (t < getAdjustedLagTime())
          lagTimeDelta = adjBaseTime - t; 
  }
  
  
  /**
   * Return latest value for now. This would return a new 'now' value
   * only if previous call was made more than 1 second ago.
   * @return
   */
  private double now = 0;
  private double getNow()
  {
      double exactNow = System.currentTimeMillis()/1000;
      if (exactNow - now > NOW_ACCURACY)
          now = exactNow;
      
      return now;
  }
  
  
  /**
   * Helper method to get start time
   * @return
   */
  public double getStartTime()
  {
      return getAdjustedLagTime();
  }
  
  
  /**
   * Helper method to set start time
   * @param startTime
   */
  public void setStartTime(double startTime)
  {
      beginNow = false;
      
      if (Double.isNaN(baseTime) || baseAtNow)
      {
          baseTime = startTime;
          lagTimeDelta = 0.0;
          baseAtNow = false;
      }
      
      else if (startTime > baseTime)
      {
          double stopTime = baseTime + leadTimeDelta;
          baseTime = startTime;
          leadTimeDelta = Math.max(0.0, stopTime - baseTime);
          lagTimeDelta = 0.0;
      }
      
      else
      {
          lagTimeDelta = baseTime - startTime;
      }
  }


  /**
   * Helper method to get stop time
   * @return
   */
  public double getStopTime()
  {
      return getAdjustedLeadTime();
  }
  
  
  /**
   * Helper method to set stop time
   * @param stopTime
   */
  public void setStopTime(double stopTime)
  {
      endNow = false;
      
      if (Double.isNaN(baseTime) || baseAtNow)
      {
          baseTime = stopTime;
          leadTimeDelta = 0.0;
          baseAtNow = false;
      }
      
      else if (stopTime < baseTime)
      {
          double startTime = baseTime - lagTimeDelta;
          baseTime = stopTime;
          lagTimeDelta = Math.max(0.0, baseTime - startTime);
          leadTimeDelta = 0.0;
      }
      
      else
      {
          leadTimeDelta = stopTime - baseTime;
      }
  }

  
  public String getIsoString(int zone)
  {
      if (baseAtNow)
      {
          String start = beginNow ? "now" : "unknown";
          String stop = endNow ? "now" : "unknown";
          String duration = DateTimeFormat.formatIsoPeriod(getTimeRange());
          return start + "/" + stop + "/" + duration;
      }
      else
      {
          String start = beginNow ? "now" : DateTimeFormat.formatIso(getStartTime(), zone);
          String stop = endNow ? "now" : DateTimeFormat.formatIso(getStopTime(), zone);
          return start + "/" + stop;
      }
  }


  this.getTimeZone = function() {
    return _timeZone;
  }


  this.setTimeZone = function(timeZone) {
      _timeZone = timeZone;
  }
  
} // TimeExtent

    