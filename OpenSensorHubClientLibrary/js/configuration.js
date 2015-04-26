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

  $( "#btnAddSOSServer").button().click(function(){
    addserverdialog.dialog( "open" );
  });  


  var addserverdialog = $( "#newserverdialog" ).dialog({
    autoOpen: false,
    modal: true,
    buttons: {
      Add: function() {
        addServer();
        $( this ).dialog( "close" );
      },
      Cancel: function() {
        $( this ).dialog( "close" );
      }
    },
    close: function() {
        addserverform[ 0 ].reset();
    }
  });

  var addserverform = addserverdialog.find( "form" ).submit(function( event ) {
    addServer();
    addserverdialog.dialog( "close" );
    event.preventDefault();
  });

  function addServer() {
    $("#offServers").append("<option value='" + $("#server_baseurl").val() + "'>" + $("#display_name").val() + "</option>");
  }

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
});

