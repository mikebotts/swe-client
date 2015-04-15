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
  $( "#siTabs").tabs();
  $( "#gcTabs").tabs();
  $( "#spTabs").tabs();
  $( "#omTabs").tabs();

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
  
});

