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
 
var ShapeType = {
  
  UNKNOWN : 0,
  SQUARE : 1,
  CIRCLE : 2,
  TRIANGLE : 3,
  STAR : 4
}

var PointGraphic = function () {

  this.orientation = null;
  this.size = null;
  this.shapetype = ShapeType.UNKNOWN;
  this.icon = null;
  this.iconwidth = null;
  this.iconheight = null;
  this.iconoffsetx = 0;
  this.iconoffsety = 0;
  
  return this;

};

PointGraphic.prototype = Object.create(PrimitiveGraphic.prototype);
