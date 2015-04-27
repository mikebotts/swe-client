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
 
SWEQuaternion = function ( x, y, z, w ) {

  this._x = x || 0;
  this._y = y || 0;
  this._z = z || 0;
  this._w = ( w !== undefined ) ? w : 1;

};

 SWEQuaternion.prototype = {
 
  constructor: SWEQuaternion,
   
  _x:0, _y:0, _z:0, _w:0,
   
  get x () {
    return this._x;
  },

  set x(value) {
    this._x = value;
  },

  get y () {
    return this._y;
  },

  set y(value) {
    this._y = value;
  },

  get z () {
    return this._z;
  },

  set z(value) {
    this._z = value;
  },

  get w () {
    return this._w;
  },

  set w(value) {
    this._w = value;
  },
  
  set: function ( x, y, z, w ) {

    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
    return this;

  },  

  length: function () {

    return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

  },

  normalize: function () {

    var l = this.length();

    if ( l === 0 ) {

    this._x = 0;
    this._y = 0;
    this._z = 0;
    this._w = 1;

    } else {

    l = 1 / l;

    this._x = this._x * l;
    this._y = this._y * l;
    this._z = this._z * l;
    this._w = this._w * l;

    }
    return this;

  },
  
  extractAngle: function () {
    this.normalize();
    return ((Math.acos(this._w) * 2.0)*180)/3.14159265;
  }
 
 };
 