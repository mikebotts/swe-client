S.fn.getlocationdescriptor = function (xmltemplate, callback) {
  
  if ("function" === typeof callback ) {

    // Request is asynchronous; callback function must be provided
    // and it must accept one parameter for the returned value.
    $.get(xmltemplate,
    
      function(data) {  
      
        callback(data);
      
      }, 'xml');
    
    return this;
  
  } else {
  
    throw new Error("getlocationdescriptor() :: Callback function must be provided.");

  }        
  
};
