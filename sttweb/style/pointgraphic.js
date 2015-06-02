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
 
var ShapeType = {
  
  UNKNOWN : 0,
  SQUARE : 1,
  CIRCLE : 2,
  TRIANGLE : 3,
  STAR : 4,
  ICON : 5,
  SYMBOL : 6
}

var PointGraphic = function () {

  // Public
  this.shapetype = ShapeType.UNKNOWN;
  this.orientation = null;
  this.size = null;
  this.icon = null;
  this.iconwidth = null;
  this.iconheight = null;
  this.iconoffsetx = 0;
  this.iconoffsety = 0;
  this.weight = null;
  this.radius = null;
  this.fillcolor = null;
  this.color = null;
  this.opacity = null;
  this.fillopacity = null;
  this.symbol = null;
  
  return this;

} // PointGraphic

// Extends PrimitiveGraphic
PointGraphic.prototype = Object.create(PrimitiveGraphic.prototype);
