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

var Symbolizer = function() {

  // Private
  var _geometry = null;
  var _name = null;
  var _enabled = false;
  
  // Constructor
  var __construct = function(me) {
     geometry = new Geometry();
  }()

  
  this.getGeometry = function() {
    return _geometry;
  }

  this.setGeometry = function (g) {
    _geometry =  g;
  }
  
  this.setenabled = function(e) {
    _enabled = e;
  }
  
  this.getenabled = function() {
    return _enabled;
  }
   
  this.setname = function(n) {
    _name = n;
  }

  this.getname = function() {
    return _name;
  }

  return this;
  
};
 
 
