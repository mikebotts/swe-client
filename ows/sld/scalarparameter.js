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

var ScalarParamter = function() {

  // Privates
  var _propertyName = null;
  var _constantValue = null;
  var _mappingFunction = null;
  var _constant = true;

  // Getters and Setters
  this.isConstant = function() {
    return _constant;
  }

  this.setConstant = function(c) {
    _constant = c;
  }

  this.getConstantValue = function() {
    return _constantValue;
  }

  this.setConstantValue = function(cv) {
    _constantValue = cv;
    _constant = false;
  }  

  this.getMappedValue = function() {
    return this.getConstantValue();
  }
  
  this.getMappingFunction = function() {
    return _mappingFunction;
  }  

  this.setMappingFunction = function (mf) {
    _mappingFunction = mf;
    _constant = false;
  }  

  this.getPropertyName = function () {
    return _propertyName;
  }
  
  this.setPropertyName = function(pn) {
    _propertyName = pn;
    _constant = false;
  }

  return this;
  
}  // ScalarParameter
