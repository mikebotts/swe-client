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
 * @public
 */
 
var PointStyler = function () {

  // Private
  var _symbolizer = null;
  var _point = null;
  
  // Constructor
  __construct = function () {
    _point = new PointGraphic();
  } ();

  this.setSymbolizer = function(symbolizer) {
    _symbolizer = symbolizer;
  }  
  
  this.getSymbolizer = function () {
    return _symbolizer;
  }
  
  this.getPoint = function() {
    
    // Merge data with symbology and return renderer independent point graphic
    
    return _point;
  }
  
  return this;

} // PointStyler

