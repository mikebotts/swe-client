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
 * This is the callback supplied by the consumer that handles the returned location template XML.
 *
 * @locationdescriptorcallback locationDescriptorCallback
 * @param {string} Returned location descriptor
 */      

 /**
 * @param {locationDescriptorCallback} locationdescriptorcallback - The callback that handles the returned location template
 * @returns {Object} sQuery - Returns the sQuery object 
 * @public
 */
S.fn.getlocationdescriptor = function (url, locationdescriptorcallback) {
  
  if ("function" === typeof locationdescriptorcallback ) {

    // Request is asynchronous; callback function must be provided
    // and it must accept one parameter for the returned value.
    $.get(url,
    
      function(data) {  
      
        locationdescriptorcallback(data);
      
      }, 'xml');
    
    return this;
  
  } else {

    throw new Error( _("callback_function_not_provided", {"function" : "getlocationdescriptor"} ) );

  }        
  
}; //getlocationdescriptor

/**
 * @param {string} xmllocationdescriptor - The location template XML
 * @returns {Object} objLocationDetails - Returns the location data record format
 * @public
 */

S.fn.getlocationdetails = function (xmllocationdescriptor) {
  
  if (this.is("XMLDocument",xmllocationdescriptor)) {

    // Each node is referenced below to illustrate the XML structure 
    // although we could get to the node of interest directly
  
    var 
    
        $xmlLocationDescriptor = $( xmllocationdescriptor ), 
        $xmlResultTemplateResponse = $xmlLocationDescriptor.find('GetResultTemplateResponse'),
        $xmlResultStructure = $xmlLocationDescriptor.find('resultStructure'),
        $xmlDataRecord = $xmlResultStructure.find('DataRecord'),
        $xmlTime = $xmlDataRecord.find("field[name='time']"),
        $xmlLocation = $xmlDataRecord.find("field[name='location']"),
        $xmlLocationVector = $xmlLocation.find("Vector"),
        vectorCoordinateSystem = $xmlLocationVector.attr('referenceFrame'),
        $xmlLocationCoordinates = [],
        $xmlResultEncoding = $xmlResultTemplateResponse.find("resultEncoding"),
        objLocationDetails = new Object();
    
    objLocationDetails.tokenseparator = $xmlResultEncoding.find("TextEncoding").attr("tokenSeparator");
    objLocationDetails.decimalseparator = $xmlResultEncoding.find("TextEncoding").attr("decimalSeparator");
    objLocationDetails.coordinatesystem = vectorCoordinateSystem;

    // Save coordinates
    $xmlLocationVector.find('coordinate').each(function(i,coordinate) {
        $xmlLocationCoordinates[i] = $(this);
    });
    
    objLocationDetails.tokens = [];

    var objToken = new Object();
    objToken.name = 'time';
    objToken.zone = $xmlTime.find('Time').attr('referenceFrame');
    objToken.uom = $xmlTime.find('Time').find('uom').attr('xlink:href');
    objLocationDetails.tokens[0] = objToken;    

    for (var i = 0, l = $xmlLocationCoordinates.length; l > i; ++i) {
      var objToken = new Object();
      objToken.name = $xmlLocationCoordinates[i].attr('name');;
      objToken.definition = $xmlLocationCoordinates[i].find('Quantity').attr('definition');
      objToken.uom = $xmlLocationCoordinates[i].find('Quantity').find('uom').attr('code');
      objToken.coordinatesystem = vectorCoordinateSystem;
      objLocationDetails.tokens[i+1] = objToken;
    }   

    return objLocationDetails;
    
  } else {
    
    throw new Error( _("no_location_template_provided", {"function" : "getlocationdetails"} ) );

  } 

}; // getlocationdetails
