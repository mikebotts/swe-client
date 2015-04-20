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
 * This is the callback supplied by the consumer that handles the returned orientation template XML.
 *
 * @orientationdescriptorcallback orientationDescriptorCallback
 * @param {string} Returned orientation descriptor
 */      

 /**
 * @param {orientationDescriptorCallback} orientationdescriptorcallback - The callback that handles the returned orientation template
 * @returns {Object} sQuery - Returns the sQuery object 
 * @public
 */
S.fn.getorientationdescriptor = function (url, orientationdescriptorcallback) {
  
  if ("function" === typeof orientationdescriptorcallback ) {

    // Request is asynchronous; callback function must be provided
    // and it must accept one parameter for the returned value.
    $.get(url,
    
      function(data) {  
      
        orientationdescriptorcallback(data);
      
      }, 'xml');
    
    return this;
  
  } else {

    throw new Error( _("callback_function_not_provided", {"function" : "getorientationdescriptor"} ) );

  }        
  
}; //getorientationdescriptor

/**
 * @param {string} xmlorientationdescriptor - The orientation template XML
 * @returns {Object} objorientationDetails - Returns the orientation data record format
 * @public
 */

S.fn.getorientationdetails = function (xmlorientationdescriptor) {
  
  if (this.is("XMLDocument",xmlorientationdescriptor)) {

    // Each node is referenced below to illustrate the XML structure 
    // although we could get to the node of interest directly
  
    var 
    
        $xmlorientationDescriptor = $( xmlorientationdescriptor ), 
        $xmlResultTemplateResponse = $xmlorientationDescriptor.find('GetResultTemplateResponse'),
        $xmlResultStructure = $xmlorientationDescriptor.find('resultStructure'),
        $xmlDataRecord = $xmlResultStructure.find('DataRecord'),
        $xmlTime = $xmlDataRecord.find("field[name='time']"),
        $xmlorientation = $xmlDataRecord.find("field[name='orient']"),
        $xmlorientationVector = $xmlorientation.find("Vector"),
        vectorCoordinateSystem = $xmlorientationVector.attr('referenceFrame'),
        $xmlorientationCoordinates = [],
        $xmlResultEncoding = $xmlResultTemplateResponse.find("resultEncoding"),
        objorientationDetails = new Object();
    
    objorientationDetails.tokenseparator = $xmlResultEncoding.find("TextEncoding").attr("tokenSeparator");
    objorientationDetails.decimalseparator = $xmlResultEncoding.find("TextEncoding").attr("decimalSeparator");
    objorientationDetails.coordinatesystem = vectorCoordinateSystem;

    // Save coordinates
    $xmlorientationVector.find('coordinate').each(function(i,coordinate) {
        $xmlorientationCoordinates[i] = $(this);
    });
    
    objorientationDetails.tokens = [];

    var objToken = new Object();
    objToken.name = 'time';
    objToken.zone = $xmlTime.find('Time').attr('referenceFrame');
    objToken.uom = $xmlTime.find('Time').find('uom').attr('xlink:href');
    objorientationDetails.tokens[0] = objToken;    

    for (var i = 0, l = $xmlorientationCoordinates.length; l > i; ++i) {
      var objToken = new Object();
      objToken.name = $xmlorientationCoordinates[i].attr('name');;
      objToken.definition = $xmlorientationCoordinates[i].find('Quantity').attr('definition');
      objToken.uom = $xmlorientationCoordinates[i].find('Quantity').find('uom').attr('code');
      objToken.coordinatesystem = vectorCoordinateSystem;
      objorientationDetails.tokens[i+1] = objToken;
    }   

    return objorientationDetails;
    
  } else {
    
    throw new Error( _("no_orientation_template_provided", {"function" : "getorientationdetails"} ) );

  } 

}; // getorientationdetails
