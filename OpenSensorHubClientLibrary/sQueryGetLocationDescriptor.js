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
  
    throw new Error("getlocationdescriptor() :: Callback function must be provided.");

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
    objLocationDetails.decimalsepartor = $xmlResultEncoding.find("TextEncoding").attr("decimalSeparator");
    objLocationDetails.coordinatesystem = vectorCoordinateSystem;

    // Save coordinates
    $xmlLocationVector.find('coordinate').each(function(i,coordinate) {
        $xmlLocationCoordinates[i] = $(this);
    });
    
    objLocationDetails.tokens = [];

    var objToken = new Object();
    objToken.name = 'time';
    objToken.zone = $xmlTime.find('Time').attr('referenceFrame');
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
  
    throw new Error("getlocationdetails() :: No location template document provided.");
  } 

}; // getlocationdetails
