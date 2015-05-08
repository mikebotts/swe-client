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
 * @param {string} xmllocationdescriptor - The location template XML
 * @returns {Object} objLocationDetails - Returns the location data record format
 * @public
 */
S.fn.getstyle = function (styledef, styleobject){
  
  switch (styledef.text) {
    
    case "leaflet_marker_icon_image" :
    
      // create the leaflet marker icon object and save it into styleobject
      styleobject[styledef.id] = L.icon({
        iconUrl  : styledef.iconurl,
        iconSize : [styledef.iconsize]
      });
      
      break;
      
    default:
      
      throw new Error("Unknown style defintion");
   
  }

  return this;
  
}; // getstyle