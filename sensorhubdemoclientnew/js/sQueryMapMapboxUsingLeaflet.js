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
S.fn.mapmapboxusingleaflet = function (action, data){
  
  /* 
    The action object holds observables that it is dependent on.
    These observables hold an ID that maps back to the data observables 
    that holds all the details.
  */ 
  
    console.log(data);
    
    var actionobservables = action.observables,
        observables = null,
        styleicon = null,
        stylesize = null,
        observableid = [],
        templateurl = [],
        dataurl = [],
        templatetype = [];

    for (var i in data) {
    // Just in case some other code touched my collection object, check hasOwnProperty!
      if (data.hasOwnProperty(i)) {
        if (data[i]['key'] === "observables") {
          var observables = data[i]['value'];
          break;
        }        
      }
    } 
  
    for (var i in actionobservables) {
      if (actionobservables.hasOwnProperty(i)) {
        for (var j in observables) {
          if (observables.hasOwnProperty(j)) {
            if (observables[j].id === actionobservables[i].id) {
              observableid[observableid.length] = observables[j].id;
              templateurl[templateurl.length] = observables[j].templateurl;
              dataurl[dataurl.length] = observables[j].dataurl;
              templatetype[templatetype.length] = observables[j].templatetype;
            }
          }
        }
      }
    }
  
  // Get the templates
  templateurl.forEach(function(element, index, array){
    switch (templatetype[index]) {
      case "locationtemplate":
        S().getlocationdescriptor(element, function(t) {
          templates.push(S().getlocationdetails(t));
        });
        break
      case "orientationtemplate":
        S().getorientationdescriptor(element, function(t) {
          templates.push(S().getorientationdetails(t));
        });
        break
    }
  });
  
}; // mapmapboxusingleaflet