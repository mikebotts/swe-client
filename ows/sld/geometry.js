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
 * @date May 28, 2015
 * @public
 */
 
var Geometry = function () {

  // Privates
  var _x = null;
  var _y = null;
  var _z = null;
  var _t = null;
  var _propertyName = null;
  var _breaks = null;
  var _object = null;

  this.getPropertyName = function() {
    return _propertyName;
  }  

  this.setPropertyName = function(pn) {
    _propertyName = pn;
  }

  this.getT = function() {
    return _t;
  }
  
  this.setT = function(t) {
    _t = t;
  }

  this.getX = function() {
    return _x;
  }
  
  this.setX = function(x) {
    _x = x;
  }

  this.getY = function() {
    return _y;
  }
  
  this.setY = function(y) {
    _y = y;
  }

  this.getZ = function() {
    return _z;
  }
  
  this.setZ = function(z) {
    _z = z;
  }
  
  this.getBreaks = function () {
    return _breaks;
  }
  
  this.setBreaks = function(b) {
    _breaks = b;
  }

  this.getObject = function() {
    return _object;
  }  
  
  this.setObject = function(o) {
    _object = o;
  }
    
  return this;

} // Geometry