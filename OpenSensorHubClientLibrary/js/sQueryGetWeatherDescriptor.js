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
 * This is the callback supplied by the consumer that handles the returned weather template XML.
 *
 * @weatherdescriptorcallback weatherDescriptorCallback
 * @param {string} Returned weather descriptor
 */      

 /**
 * @param {weatherDescriptorCallback} weatherdescriptorcallback - The callback that handles the returned weather template
 * @returns {Object} sQuery - Returns the sQuery object 
 * @public
 */
S.fn.getweatherdescriptor = function (url, weatherdescriptorcallback) {
  
  if ("function" === typeof weatherdescriptorcallback ) {

    // Request is asynchronous; callback function must be provided
    // and it must accept one parameter for the returned value.
    $.get(url,
    
      function(data) {  
      
        weatherdescriptorcallback(data);
      
      }, 'xml');
    
    return this;
  
  } else {

    throw new Error( _("callback_function_not_provided", {"function" : "getweatherdescriptor"} ) );

  }        
  
}; //getweatherdescriptor

/**
 * @param {string} xmlweatherdescriptor - The weather template XML
 * @returns {Object} objweatherDetails - Returns the weather data record format
 * @public
 */

S.fn.getweatherdetails = function (xmlweatherdescriptor) {
  
  if (this.is("XMLDocument",xmlweatherdescriptor)) {

    // Each node is referenced below to illustrate the XML structure 
    // although we could get to the node of interest directly
  
    var 
        $xmlweatherDescriptor = $( xmlweatherdescriptor ), 
        $xmlResultTemplateResponse = $xmlweatherDescriptor.find('GetResultTemplateResponse'),
        $xmlResultStructure = $xmlweatherDescriptor.find('resultStructure'),
        $xmlDataRecord = $xmlResultStructure.find('DataRecord'),
        $xmlTime = $xmlDataRecord.find("field[name='time']"),
        $xmlTemperature = $xmlDataRecord.find("field[name='temperature']"),
        $xmlPressure = $xmlDataRecord.find("field[name='pressure']"),
        $xmlWindSpeed = $xmlDataRecord.find("field[name='windSpeed']"),
        $xmlWindDirection = $xmlDataRecord.find("field[name='windDirection']"),
        $xmlResultEncoding = $xmlResultTemplateResponse.find("resultEncoding");
    
    var objweatherDetails = new Object();
    var objToken = null;
    objweatherDetails.tokens = [];
    
    objweatherDetails.tokenseparator = $xmlResultEncoding.find("TextEncoding").attr("tokenSeparator");
    objweatherDetails.decimalseparator = $xmlResultEncoding.find("TextEncoding").attr("decimalSeparator");

    objToken = new Object();
    objToken.name = 'time';
    objToken.zone = '';
    objToken.uom = $xmlTime.find('Time').find('uom').attr('xlink:href');
    objweatherDetails.tokens[0] = objToken;    

    objToken = new Object();
    objToken.name = 'temperature';
    objToken.definition = $xmlTemperature.find('Quantity').attr('definition');
    objToken.uom = $xmlTemperature.find('Quantity').find('uom').attr('code');
    objweatherDetails.tokens[1] = objToken;

    objToken = new Object();
    objToken.name = 'pressure';
    objToken.definition = $xmlPressure.find('Quantity').attr('definition');
    objToken.uom = $xmlPressure.find('Quantity').find('uom').attr('code');
    objweatherDetails.tokens[2] = objToken;

    objToken = new Object();
    objToken.name = 'windSpeed';
    objToken.definition = $xmlWindSpeed.find('Quantity').attr('definition');
    objToken.uom = $xmlWindSpeed.find('Quantity').find('uom').attr('code');
    objweatherDetails.tokens[3] = objToken;

    objToken = new Object();
    objToken.name = 'windDirection';
    objToken.definition = $xmlWindDirection.find('Quantity').attr('definition');
    objToken.uom = $xmlWindDirection.find('Quantity').find('uom').attr('code');
    objweatherDetails.tokens[4] = objToken;
    
    return objweatherDetails;
    
  } else {
    
    throw new Error( _("no_weather_template_provided", {"function" : "getweatherdetails"} ) );

  } 

}; // getweatherdetails
