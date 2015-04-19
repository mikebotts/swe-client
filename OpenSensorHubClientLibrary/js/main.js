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

 $(function() {
  
  var $offerings = null;
  var $grturlofferings = null;
  var $locDetails = null;
  
  $( "#siTabs").tabs();
  $( "#gcTabs").tabs();
  $( "#spTabs").tabs();
  $( "#omTabs").tabs();
  $( "#offTabs").tabs();
  $( "#grturlTabs").tabs();
  $( "#gldTabs").tabs();
  $( "#grTabs").tabs();

  $( "#gcServers").change(function() {
    if (this.value === "")  {
      $("#gcURL").val("");
    } else {
     try {
       $("#gcURL").val(S(this.value).getcapabilitiesurl());
     } catch (e) {
       alert(e);
     }
    }
  });
  
  $( "#siServers").change(function() {
    if (this.value === "")  {
      $("#siTitle").val("");
      $("#siAbstract").val("");
      $("#siType").val("");
      $("#siFees").val("");
      $("#siAC").val("");
      $("#siProfiles").empty()
    } else {
     try {
       S(this.value).getcapabilities(function(c) {
        console.log("Got a " + Object.prototype.toString.call(c).slice(8, -1));
        console.log(c);
        try {
          var $si = S().getserviceidentification(c);
          console.log($si);
          $("#siTitle").val($si.title);
          $("#siAbstract").val($si.abstract);
          $("#siType").val($si.type);
          $("#siFees").val($si.fees);
          $("#siAC").val($si.accessconstraints);
          $("#siProfiles").empty()
          $.each($si.profiles, function( index, value ) {
            $("#siProfiles").append("<option value='" + value + "'>" + value + "</option>");
          });
          
        } catch (e) {
          console.log(e);
        }
       });
     } catch (e) {
       alert(e);
     }
    }
  });

  $( "#spServers").change(function() {
    if (this.value === "")  {
      $("#spName").val("");
      $("#spContactName").val("");
      $("#spContactPosition").val("");
      $("#spContactAddress").val("");
    } else {
     try {
       S(this.value).getcapabilities(function(c) {
        console.log("Got a " + Object.prototype.toString.call(c).slice(8, -1));
        console.log(c);
        try {
          var $sp = S().getserviceprovider(c);
          console.log($sp);
          $("#spName").val($sp.name);
          $("#spContactName").val($sp.contactname);
          $("#spContactPosition").val($sp.contactposition);
          $("#spContactAddress").val($sp.contactaddress);        
        } catch (e) {
          console.log(e);
        }
       });
     } catch (e) {
       alert(e);
     }
    }
  });

  $( "#omServers").change(function() {
    if (this.value === "")  {
      $("#omOperations").empty();
      $("#omOperationsPost").val("");
      $("#omOperationsGet").val("");
    } else {
     try {
       S(this.value).getcapabilities(function(c) {
        console.log("Got a " + Object.prototype.toString.call(c).slice(8, -1));
        console.log(c);
        try {
          var $om = S().getoperationsmetadata(c);
          console.log($om);
          $("#omOperations").empty();
          $("#omOperationsPost").val("");
          $("#omOperationsGet").val("");          
          $("#omOperations").append("<option value=''>Select an Operation</option>");
          $.each($om, function( index, operation) {
            $("#omOperations").append("<option value='" + operation.name + "|" + operation.postbaseurl + "|" + operation.getbaseurl + "'>" + operation.name + "</option>");
          });    
        } catch (e) {
          console.log(e);
        }
       });
     } catch (e) {
       alert(e);
     }
    }
  });

  $( "#omOperations").change(function() {
    if (this.value === "")  {
      $("#omOperationsPost").val("");
      $("#omOperationsGet").val("");
    } else {
     try {
      var vals = this.value.trim().split("|");
      $("#omOperationsPost").val(vals[1]);
      $("#omOperationsGet").val(vals[2]);
     } catch (e) {
       alert(e);
     }
    }
  });
  
  $( "#offServers").change(function() {
    if (this.value === "")  {
      $("#offIdentifier").val("");
      $("#offDescription").val("");
      $("#offProcedure").val("");
      $("#offerings").empty();
      $("#offObservables").empty();
      $("#offPhenonmenonTime").empty();
      $("#offPhenonmenonTimeBegin").val("");
      $("#offPhenomenonIndeterminateTime").val("");
      $("#offPhenomenonEndBegin").val("");
    } else {
     try {
       S(this.value).getcapabilities(function(c) {
        console.log("Got a " + Object.prototype.toString.call(c).slice(8, -1));
        console.log(c);
        try {
          $offerings = S().getofferings(c);
          console.log($offerings);
          $("#offerings").empty();
          $("#offIdentifier").val("");
          $("#offDescription").val("");
          $("#offProcedure").val("");
          $("#offObservables").empty();
          $("#offPhenonmenonTime").empty();
          $("#offPhenonmenonTimeBegin").val("");
          $("#offPhenomenonIndeterminateTime").val("");
          $("#offPhenomenonEndBegin").val("");
    
          $("#offerings").append("<option value=''>Select an Offering</option>");
          $.each($offerings, function( index, offering) {
            $("#offerings").append("<option value='" + index + "'>" + offering.name + "</option>");
          });    
        } catch (e) {
          console.log(e);
        }
       });
     } catch (e) {
       alert(e);
     }
    }
  });

  $( "#offerings").change(function() {
    if (this.value === "")  {
      $("#offName").val();
      $("#offIdentifier").val("");
      $("#offDescription").val("");
      $("#offProcedure").val("");
      $("#offObservables").empty();
      $("#offPhenonmenonTime").empty();
      $("#offPhenonmenonTimeBegin").val("");
      $("#offPhenomenonIndeterminateTime").val("");
      $("#offPhenomenonEndBegin").val("");
    } else {
      try {
        $("#offIdentifier").val($offerings[parseInt(this.value)].identifier);
        $("#offDescription").val($offerings[parseInt(this.value)].description);
        $("#offProcedure").val($offerings[parseInt(this.value)].procedure);
        $("#offObservables").empty();
        $.each($offerings[parseInt(this.value)].observableproperties, function( index, observableproperty) {
          $("#offObservables").append("<option value='" + index + "'>" + observableproperty + "</option>");
        });
        $("#offPhenonmenonTime").empty();
        $("#offPhenonmenonTimeBegin").val("");
        $("#offPhenomenonIndeterminateTime").val("");
        $("#offPhenomenonEndBegin").val("");        
        $("#offPhenonmenonTime").append("<option value=''>Select a Time</option>");
        $.each($offerings[parseInt(this.value)].phenomenontime, function( index, pTime) {
          $("#offPhenonmenonTime").append("<option value='" + index + "'>" + pTime.identifier + "</option>");
        });      
     } catch (e) {
       alert(e);
     }
    }
  });
  
  $( "#offPhenonmenonTime").change(function() {
    if (this.value === "")  {
      $("#offPhenonmenonTimeBegin").val("");
      $("#offPhenomenonIndeterminateTime").val("");
      $("#offPhenomenonEndBegin").val("");
    } else {
     try {
      $("#offPhenonmenonTimeBegin").val($offerings[parseInt($("#offerings").val())].phenomenontime[parseInt(this.value)].begin);
      $("#offPhenomenonIndeterminateTime").val($offerings[parseInt($("#offerings").val())].phenomenontime[parseInt(this.value)].indeterminatePosition);
      $("#offPhenomenonEndBegin").val($offerings[parseInt($("#offerings").val())].phenomenontime[parseInt(this.value)].end);  
     } catch (e) {
       alert(e);
     }
    }
  });

  $( "#grturloffServers").change(function() {
    if (this.value === "")  {
      $("#grturloffIdentifier").val("");
      $("#grturlofferings").empty();
      $("#grturloffObservables").empty();
      $("#grturlURL").val("");
    } else {
     try {
       S(this.value).getcapabilities(function(c) {
        console.log("Got a " + Object.prototype.toString.call(c).slice(8, -1));
        console.log(c);
        try {
          $grturlofferings = S().getofferings(c);
          console.log($offerings);
          $("#grturlofferings").empty();
          $("#grturloffIdentifier").val("");
          $("#grturloffObservables").empty();
          $("#grturlURL").val("");

          $("#grturlofferings").append("<option value=''>Select an Offering</option>");
          $.each($grturlofferings, function( index, offering) {
            $("#grturlofferings").append("<option value='" + index + "'>" + offering.name + "</option>");
          });    

        } catch (e) {
          console.log(e);
        }
       });
     } catch (e) {
       alert(e);
     }
    }
  });

  $( "#grturlofferings").change(function() {
    if (this.value === "")  {
      $("#grturloffIdentifier").val("");
      $("#grturloffObservables").empty();
      $("#grturlURL").val("");
    } else {
      try {
        $("#grturloffIdentifier").val($grturlofferings[parseInt(this.value)].identifier);
        $("#grturloffObservables").empty();
        $("#grturlURL").val("");
        $.each($grturlofferings[parseInt(this.value)].observableproperties, function( index, observableproperty) {
          $("#grturloffObservables").append("<option value='" + index + "'>" + observableproperty + "</option>");
        });
     } catch (e) {
       alert(e);
     }
    }
  });
  
  $( "#btnGetTemplateURL").button().click(function(){
    if (undefined === $("#grturloffIdentifier").val().trim() || !$("#grturloffIdentifier").val().trim()) {
      alert( _("identifier_must_be_set", {"function" : "btnGetTemplateURL"} ) );
      return;
    }
    var url = S($("#grturloffServers option:selected").val())
              .getresulttemplateurl($("#grturloffIdentifier").val(), 
                                    $("#grturloffObservables option:selected").text());
    $("#grturlURL").val(url);

  });  

  $( "#btnGetLocationTemplate").button().click(function(){
    // The URL is hardcoded for the sake of demonstration. It was produced using the sQuery.getresulttemplateurl() as illustrated in above.
    var url = "http://bottsgeo.com:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResultTemplate&offering=urn:android:device:FA44CWM03715-sos&observedProperty=http://sensorml.com/ont/swe/property/Location";
    S().getlocationdescriptor(url, function(t) {
       $locDetails = S().getlocationdetails(t);
       console.log($locDetails);
       $("#gldTokenSeparator").val($locDetails.tokenseparator);
       $("#gldDecimalSeparator").val($locDetails.decimalseparator);
       $("#gldCS").val($locDetails.coordinatesystem);

      $.each($locDetails.tokens, function( index, token) {
        $("#gldTokens").append("<option value='" + index + "'>" + token.name + "</option>");
      });    
      
      $("#gldTokens").change();
      
    });
  });

  $( "#gldTokens").change(function() {
    
    if ($("#gldTokens option:selected").text() === "time") {
      $("#gldTokenZone").val($locDetails.tokens[this.value].zone);
      $("#gldTokenCS").val("");
      $("#gldTokenDefinition").val("");      
    } else {
      $("#gldTokenZone").val("");
      $("#gldTokenCS").val($locDetails.tokens[this.value].coordinatesystem);
      $("#gldTokenDefinition").val($locDetails.tokens[this.value].definition);      
    }
    $("#gldTokenUOM").val($locDetails.tokens[this.value].uom);

  });

  $( "#grurloffServers").change(function() {
    if (this.value === "")  {
      $("#grurloffIdentifier").val("");
      $("#grurlofferings").empty();
      $("#grurloffObservables").empty();
      $("#grurlhttpURL").val("");
      $("#grurlwsURL").val("");
    } else {
     try {
       S(this.value).getcapabilities(function(c) {
        try {
          $grurlofferings = S().getofferings(c);
          $("#grurlofferings").empty();
          $("#grurloffIdentifier").val("");
          $("#grurloffObservables").empty();
          $("#grurlhttpURL").val("");
          $("#grurlwsURL").val("");

          $("#grurlofferings").append("<option value=''>Select an Offering</option>");
          $.each($grurlofferings, function( index, offering) {
            $("#grurlofferings").append("<option value='" + index + "'>" + offering.name + "</option>");
          });    

        } catch (e) {
          console.log(e);
        }
       });
     } catch (e) {
       alert(e);
     }
    }
  });

  $( "#grurlofferings").change(function() {
    if (this.value === "")  {
      $("#grurloffIdentifier").val("");
      $("#grurloffObservables").empty();
      $("#grurlhttpURL").val("");
      $("#grurlwsURL").val("");
    } else {
      try {
        $("#grurloffIdentifier").val($grurlofferings[parseInt(this.value)].identifier);
        $("#grurloffObservables").empty();
        $("#grurlhttpURL").val("");
        $("#grurlwsURL").val("");
        $.each($grurlofferings[parseInt(this.value)].observableproperties, function( index, observableproperty) {
          $("#grurloffObservables").append("<option value='" + index + "'>" + observableproperty + "</option>");
        });
     } catch (e) {
       alert(e);
     }
    }
  });
  
  $( "#btnGetResultURL").button().click(function(){
    if (undefined === $("#grurloffIdentifier").val().trim() || !$("#grurloffIdentifier").val().trim()) {
      alert( _("identifier_must_be_set", {"function" : "btnGetResultURL"} ) );
      return;
    }
    if (undefined === $("#grtemporalfilter").val().trim() || !$("#grtemporalfilter").val().trim()) {
      alert( "Time filter must be supplied." );
      return;
    }
    var httpurl = S($("#grurloffServers option:selected").val())
              .getresulthttpurl($("#grurloffIdentifier").val(), 
                                $("#grurloffObservables option:selected").text(),
                                $("#grtemporalfilter").val());
    var wsurl = S($("#grurloffServers option:selected").val())
              .getresultwsurl($("#grurloffIdentifier").val(), 
                              $("#grurloffObservables option:selected").text(),
                              $("#grtemporalfilter").val());
    $("#grurlhttpURL").val(httpurl);
    $("#grurlwsURL").val(wsurl);

  });    

});

