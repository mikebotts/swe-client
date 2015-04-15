/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the License.
 *
 * The Initial Developer is Terravolv, Inc. Portions created by the Initial
 * Developer are Copyright (C) 2015 the Initial Developer. All Rights Reserved.
 *
 * Date: 2015-03-25T00:00Z
 */

(function( window, noGlobal ) {
  
  // Call trace may not work in some browsers unless use strict is disabled!
  'use strict';

  // jQuery library is required
  if(!window.jQuery) {

    console.log("jQuery not referenced.  Adding reference.");
    
    var script = document.createElement('script');
  
    script.src = '//code.jquery.com/jquery-1.11.2.min.js';

    script.type = 'text/javascript';

    // TODO:  Need to figure out why adding jQuery here 
    //        isn't working although if it referenced in 
    //        head it does. 
    document.getElementsByTagName('head')[0].appendChild(script);

  } else {

    console.log("jQuery referenced.");
  
  }
  
  var 
      
      /** @private */
      _oshundefined = typeof undefined,
  
      /** @private */
      _sQuery = window.sQuery,
      
      /** @private */
      _S = window.S,
      
      /** @private */
      _version = "1.00.00",
      
      /** @private */
      _getCapabilitiesBase = '/sos?service=SOS&version=2.0&request=GetCapabilities',

      /** @private */
      _getResultTemplateBase = '/sos?service=SOS&version=2.0&request=GetResultTemplate',
      
      /** @private */      
      sQuery = function( baseurl ) {

        return new sQuery.fn.init( baseurl );
      
      };      
    
    sQuery.fn = sQuery.prototype = {

      /** @public */
      version: _version,
      
      /** @public */
      constructor: sQuery,
      
      /** @public */
      baseurl: "",
      
      /**
       * @param {string} baseurl - The base URL of the SOS service
       * @returns {Object} sQuery - Returns the sQuery object
       * @class
       */
      init: function( baseurl ) {

        /**
         *
         * Expected format:
         * http://<server>[:<port>]/<alias>
         * TODO: If slash is provided after <alias>
         *       then strip it because we add it later.          
         *   
         */ 
         
        this.baseurl = baseurl;
        
        return this;
      },
      
       /**
       * @returns {String} sCapabilitiesURL - Returns the fully qualified capabilities URL 
       * @public
       */
      getcapabilitiesurl: function() {
        
        // TODO: Check that baseurl is also valid http syntax
        if ((undefined === this.baseurl) || !this.baseurl.trim()) 
          throw new Error( _("service_url_not_provided", {"function" : "getcapabilitiesurl"} ) );
        
        return (this.baseurl + _getCapabilitiesBase);
        
      }, // getcapabilitiesurl()
      

      /**
       * This is the callback supplied by the consumer that handles the returned capabilities XML.
       *
       * @callback requestCallback
       * @param {string} Returned Capabilities
       */      

       /**
       * @param {requestCallback} callback - The callback that handles the returned capabilities
       * @returns {Object} sQuery - Returns the sQuery object 
       * @public
       */
      getcapabilities: function(callback) {

        // TODO: Check that baseurl is also valid http syntax
        if ((undefined === this.baseurl) || !this.baseurl.trim()) 
          throw new Error( _("service_url_not_provided", {"function" : "getcapabilities"} ) );
        
        if ("function" === typeof callback ) {

          // Request is asynchronous; callback function must be provided
          // and it must accept one parameter for the returned value.
          $.get(this.baseurl + _getCapabilitiesBase,
          
            function(data) {  
            
              callback(data);
            
            }, 'xml');
          
          return this;
        
        } else {
        
          throw new Error( _("callback_function_not_provided", {"function" : "getcapabilities"} ) );

        }        
        
      }, // getcapabilities()
      
      /**
       * @param {string} xmlCapabilities - The service capabilities
       * @returns {Object} objServiceIdentification - Returns the service identification object
       * @returns {string} objServiceIdentification.title - The title of service
       * @returns {string} objServiceIdentification.abstract - The service abstract
       * @returns {string} objServiceIdentification.type - The service type
       * @returns {string} objServiceIdentification.fees - The service fees
       * @returns {string} objServiceIdentification.accessconstraints - The service constraints
       * @returns {string[]} objServiceIdentification.profiles - The service profiles
       * @public
       */
      getserviceidentification: function (xmlCapabilities) {
        
        if (this.is("XMLDocument",xmlCapabilities)) {
          
          var $xmlCapabilities = $( xmlCapabilities ); 
          
          var $xmlServiceIdentification = $xmlCapabilities.find('ServiceIdentification');
          
          var objServiceIdentification = new Object();
          
          objServiceIdentification.title = $xmlServiceIdentification.find("Title").text();
          objServiceIdentification.abstract = $xmlServiceIdentification.find("Abstract").text();
          objServiceIdentification.type = $xmlServiceIdentification.find("ServiceType").text();
          objServiceIdentification.fees = $xmlServiceIdentification.find("Fees").text();
          objServiceIdentification.accessconstraints = $xmlServiceIdentification.find("AccessConstraints").text();
          objServiceIdentification.profiles = [];
          $xmlServiceIdentification.find('Profile').each(function(i,profile) {
            objServiceIdentification.profiles[i] = $(this).text();
          });
      
          return objServiceIdentification;
          
        } else {
        
          throw new Error( _("no_capabilities_document_provided", {"function" : "getserviceidentification"} ) );
        } 
      
      }, // getserviceidentification()

      /**
       * @param {string} xmlCapabilities - The service capabilities
       * @returns {Object} objServiceProvider - Returns the service provider details
       * @returns {string} objServiceProvider.name - The name of the service provider
       * @returns {string} objServiceProvider.contactname - The name of the service provider contact
       * @returns {string} objServiceProvider.contactposition - The position of the service provider contact
       * @returns {string} objServiceProvider.contactaddress - The address of the service provider
       * @public
       */
      getserviceprovider: function (xmlCapabilities) {
        
        if (this.is("XMLDocument",xmlCapabilities)) {
          
          var $xmlCapabilities = $( xmlCapabilities ); 
          
          var $xmlServiceProvider = $xmlCapabilities.find('ServiceProvider');
          
          var $xmlServiceContact = $xmlServiceProvider.find('ServiceContact');
          
          var $xmlServiceAddress = $xmlServiceContact.find('Address');
          
          var objServiceProvider = new Object();
          
          objServiceProvider.name = $xmlServiceProvider.find("ProviderName").text();
          objServiceProvider.contactname = $xmlServiceContact.find("IndividualName").text();
          objServiceProvider.contactposition = $xmlServiceContact.find("PositionName").text();
          
          var contactAddress = $xmlServiceAddress.find("City").text() + " " +
                               $xmlServiceAddress.find("AdministrativeArea").text() + " " +
                               $xmlServiceAddress.find("PostalCode").text() + " " +
                               $xmlServiceAddress.find("Country").text();
          objServiceProvider.contactaddress = contactAddress;

          return objServiceProvider;
          
        } else {
        
          throw new Error( _("no_capabilities_document_provided", {"function" : "getserviceprovider"} ) );
        
        } 
      
      }, // getserviceprovider()
      
      getoperationsmetadata: function (xmlCapabilities) {

        if (this.is("XMLDocument",xmlCapabilities)) {
          
          var $xmlCapabilities = $( xmlCapabilities ); 
          
          var $xmlOperationsMetadata = $xmlCapabilities.find('OperationsMetadata');
          
          var objOperationsMetadata = [];
          
          $xmlOperationsMetadata.find('Operation').each(function(i,operation) {
            
            var operation = new Object();
            var operationGet = $(this).find('Get');            
            var operationPost = $(this).find('Post');
            
            operation.name = $(this).attr('name');
            operation.postbaseurl = operationPost.attr('xlink:href') || 'POST not supported.';
            operation.getbaseurl = operationGet.attr('xlink:href') || 'GET not supported.';
            
            console.log(operation.name);
            console.log(operation.getbaseurl);
            console.log(operation.postbaseurl);            
            
            objOperationsMetadata[i] = operation;
            
          });
                    
          return objOperationsMetadata;
          
        } else {

          throw new Error( _("no_capabilities_document_provided", {"function" : "getoperationsmetadata"} ) );
        
        }
      }, // getoperationsmetadata
      
      getofferings: function (xmlCapabilities) {

        if (this.is("XMLDocument",xmlCapabilities)) {
            
          var $xmlCapabilities = $( xmlCapabilities ); 
          
          var $xmlContents = $xmlCapabilities.find('Contents');

          var $xmlOfferings = $xmlContents.find('offering');
          
          var objOfferings = [];
          
          // Contents contain multiple offerings
          $xmlContents.find('offering').each(function(i,offering) {

            var objOffering = new Object();
            
            var $observationOffering = $(this).find('ObservationOffering');
            
            objOffering.name = $observationOffering.find("name").text();
            objOffering.identifier = $observationOffering.find("identifier").text();
            objOffering.description = $observationOffering.find("description").text();
            objOffering.procedure = $observationOffering.find("procedure").text();
            objOffering.observableproperties = [];
            objOffering.phenomenontime = [];
            
            // ObservationOffering contain multiple observable properties
            $observationOffering.find('observableProperty').each(function(i, observableproperty) {
              objOffering.observableproperties[i] = $(this).text();
            });
            
            var $phenomenonTime = $observationOffering.find('phenomenonTime');
            
            // phenonmenonTime can have multiple time periods
            $phenomenonTime.find('TimePeriod').each(function(i,timeperiod) {
              var objTimePeriod = new Object();
              objTimePeriod.identifier = $(this).attr('gml:id');
              objTimePeriod.begin = $(this).find('beginPosition').text();
              objTimePeriod.indeterminatePosition = $(this).find('endPosition').attr('indeterminatePosition'); 
              objTimePeriod.end = $(this).find('endPosition').text();
              objOffering.phenomenontime[i] = objTimePeriod;
            });
            
            objOfferings[i] = objOffering;
            
          });
                    
          return objOfferings;
          
        } else {

          throw new Error( _("no_capabilities_document_provided", {"function" : "getofferings"} ) );
        
        }
      }, // getofferings

      /**
       * @param {string} offeringidentifier - The identifier of the offering from the capabilities
       * @param {string} observedproperty - The observable property from the the capabilities
       * @returns {string} - The fully qualified url to get the details of the observable
       * @public
       */
      
      getresulttemplateurl: function (offeringidentifier, observedproperty) {
        
        return this.baseurl + _getResultTemplateBase + '&offering=' + offeringidentifier + '&observedProperty=' + observedproperty;
        
      }, // getresulttemplateurl
      
      is: function (type, obj) {
      
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        
        return obj !== undefined && obj !== null && clas === type;
        
      } // is
      
    } // sQuery.fn = sQuery.prototype = {}
    
    sQuery.fn.init.prototype = sQuery.fn;

    if ( typeof noGlobal === _oshundefined ) {
      
      window.sQuery = window.S = sQuery;
    
    }
      
    return sQuery;

  })(window);
