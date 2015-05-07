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
S.fn.getdata = function (nodeaction, nodedata, socketcol, socketdatacol){
  
  /* 
    The nodeaction object holds observables that it is dependent on.
    These observables hold an ID that maps back to the data observables 
    that holds all the details.
  */ 
  
    var actionobservables = nodeaction.observables,
        observables = null,
        observableid = [],
        dataurl = [];

    for (var i in nodedata) {
    // Just in case some other code touched my collection object, check hasOwnProperty!
      if (nodedata.hasOwnProperty(i)) {
        if (nodedata[i]['key'] === "observables") {
          var observables = nodedata[i]['value'];
          break;
        }        
      }
    } 
  
    for (var i in actionobservables) {
      if (actionobservables.hasOwnProperty(i)) {
        for (var j in observables) {
          if (observables.hasOwnProperty(j)) {
            if (observables[j].id === actionobservables[i].id) {
              observableid.push(observables[j].id);
              dataurl.push(observables[j].dataurl);
            }
          }
        }
      }
    }
  
  // Establish feeds
  dataurl.forEach(function(element,index,array){

    socketcol[observableid[index]] = S().openwsfeed(element,socketOnMessage,socketOnError,socketOnClose,observableid[index]);
  
  });
  
  function socketOnMessage(sockid, e) {

    var reader = new FileReader();
    reader.readAsText(e.data);
    reader.onload = function () {
      socketdatacol[sockid] = reader.result;    
    }    
  } // socketOnMessage()

  function socketOnClose(sockid, e) {

    socketcol[sockid] = null;
    socketdatacol[sockid] = null;
    delete socketcol[sockid];
    delete socketdatacol[sockid];
  
  } // socketOnClose()
  
  function socketOnError(sockid, e) {

    socketcol[sockid].close();
  
  } // socketOnError()

  return this;
  
}; // getdata
