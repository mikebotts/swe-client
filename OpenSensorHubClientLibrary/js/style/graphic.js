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

var Graphic = function () {

  // Privates
  var _opacity = null;
  var _size = null;
  var _rotation = null;
  var _spacing = null;
  var _glyphs = [];

  // Getters & Setters
  this.getGlyphs = function () {
    return _glyphs;  
  }  
  
  this.setGlyphs = function (images) {
    _glyphs = images;
  }

  this.getOpacity = function() {
    return _opacity;
  }


  this.setOpacity = function(opacity) {
    _opacity = opacity;
  }


  this.getRotation = function () {
    return _rotation;
  }


  this.setRotation = function (rotation) {
    _rotation = rotation;
  }


  this.getSize = function() {
    return _size;
  }


  this.setSize = function(size) {
    _size = size;
  }


  this.getSpacing = function() {
    return _spacing;
  }


  this.setSpacing = function(spacing)
  {
    _spacing = spacing;
  }
  
  return this;
  
} // Graphic