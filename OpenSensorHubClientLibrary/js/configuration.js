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

  var confirmdialog = $( "#data-items-reset-dialog-confirm").dialog({
    autoOpen: false,
    resizable: false,
    modal: true,
    buttons: [
      {
        text: "Yes",
        click: function () {
                  $(this).dialog('close');
                  resetDataItems(true);
                 }
      },
      {
        text: "No",
        click: function () {
                  $(this).dialog('close');
                  resetDataItems(false);
                }
      }
    ]
  });
  
  function resetDataItems(confirmed) {
    if (confirmed) {
      loadDataItems();
      $("#tree").jstree('refresh');
    }
  }
  
  function loadDataItems(dataItems) {

    if ((undefined === dataItems) || (null === dataItems)) {
			// Add root data item node if no data items found
			dataItems = '[{"id":"440ecdb0-d2a9-ea62-37de-fe78c30b3b1e","text":"Data Items","icon":true,"li_attr":{"id":"440ecdb0-d2a9-ea62-37de-fe78c30b3b1e"},"a_attr":{"href":"#","id":"440ecdb0-d2a9-ea62-37de-fe78c30b3b1e_anchor"},"state":{"loaded":true,"opened":true,"selected":false,"disabled":false},"data":{"0":{"key":"created","value":"' + moment().format() + '"}},"children":[]}]';
			localStorage.setItem("sosDataItems",dataItems);
		} 
		
		var jsTreeFormat = JSON.parse(dataItems, function(k, v) {
			if (k === "parentid") {
				this.parent = (v) ? v : '#';
			} else if (k === "name") {
				this.text = v;
			} else {
				return v;
			}
		});

		$('#tree').jstree(  { 'core' : {'check_callback' :  function (op, node, par, pos, more) {
                                                          if ( more && more.dnd && (op === 'move_node' || op === 'copy_node') && (par.id === "#")) {
                                                            // Don't allow moving before the root node (Data Items)
                                                            return false;
                                                          }
                                                          return true;
                                                        },
                                    'multiple' : false,
                                    'data' : jsTreeFormat }, 
                          'dnd': { check_while_dragging: true /* You need this or check_callback will not be called when moving nodes */},                          
                          'plugins' : ['contextmenu','dnd'],
                          'contextmenu' : { 'items' : function(node) {
                                                        var itm = $.jstree.defaults.contextmenu.items();
                                                        delete itm.create.action;
                                                        itm.create.label = "New Item";
                                                        itm.rename.label = "Rename Item";
                                                        itm.remove.label = "Delete Item";
                                                        itm.ccp.label = "Edit Item";
                                                        itm.create.action = function (data) {
                                                                              var inst = $.jstree.reference(data.reference),
                                                                                  obj = inst.get_node(data.reference);
                                                                              inst.create_node( obj, 
                                                                                                { type : "default", 
                                                                                                  id: Math.uuid().toLowerCase(),
                                                                                                  data : { "0" : {"key"   : "created",
                                                                                                                  "value" : moment().format() },
                                                                                                           "1" : {"key"   : "parentid",
                                                                                                                  "value" : obj.id },
                                                                                                           "2" : {"key"   : "moved",
                                                                                                                  "value" : null },
                                                                                                           "3" : {"key"   : "oldparentid",
                                                                                                                  "value" : null },
                                                                                                           "4" : { "key"  : "observables",
                                                                                                                   "value" : {} },
                                                                                                           "5" : { "key"  : "actions",
                                                                                                                   "value" : {} } }    
                                                                                                }, 
                                                                                                "last", 
                                                                                                function (new_node) {
                                                                                                  // Allow to edit the name of new node    
                                                                                                  setTimeout(function () { inst.edit(new_node); },0);
                                                                                                }
                                                                                              )
                                                                            };
                                                        itm["actions"] =  { label: "Assign Actions",
                                                                            action: function (node) {
                                                                                      instNode = $.jstree.reference(node.reference).get_node(node.reference); 
                                                                                      addactionsdialog.data('node', instNode).dialog( "open" );                                                                            
                                                                                    }
                                                                          };  
                
                                                        return itm;
                                                      }
                                          },
                        } );
  }

  var addactionsdialog = $( "#assignactionsdialog" ).dialog({
    autoOpen: false,
    modal: true,
    buttons: {
      Assign: function() {
        assignAction($(this).data("node").data);
        $( this ).dialog( "close" );
      },
      Cancel: function() {
        $( this ).dialog( "close" );
      }
    },
    close: function() {
        addactionsform[ 0 ].reset();
    }
  });
  
  var addactionsform = addactionsdialog.find( "form" ).submit(function( event ) {
    addactionsdialog.dialog( "close" );
    event.preventDefault();
  });   

  function assignAction(nData) {

    var selectedAction = $("#selectaction option:selected").val(),
        actions = null;
    
    if ("" === selectedAction) {
      alert("Please select an action.");
      return;
    }

    // Get data item's actions
    for (var i in nData) {
      // Just in case some other code touched my collection object, check hasOwnProperty!
      if (nData.hasOwnProperty(i)) { 
        switch (nData[i]['key']) {
          case "actions":
            actions = nData[i]['value'];
            break;
        }
      }
    }

    // TODO: Only one default action check needs to be added here
    for (var i in actions) {
      // Just in case some other code touched my collection object, check hasOwnProperty!
      if (actions.hasOwnProperty(i)) {
        if (selectedAction === actions[i]['name']) {
          alert("Action is already assigned to data item.");
          return;
        }        
      }
    }
    
    // Tag selected action with the data item.
    actions[Object.keys(actions).length+1] =  { name: selectedAction, 
                                                isdefault: ($('#isdefaultaction').prop('checked')) ? 1 : 0, 
                                                id: Math.uuid().toLowerCase()};
                                                      
  } // assignAction()

  $('#tree').on('move_node.jstree', function(e, data) {
    // Extract into separate variables for ease of following
    var oldParentId = data.old_parent;
    var newParentId = data.parent;
    var me = data.node;  // This is me!  I just moved!
    var mydata = me.data; // Get my collection of objects that have <key, value> pairs.
    for (var i in mydata) {
      // Just in case some other code touched my collection object, check hasOwnProperty!
      if (mydata.hasOwnProperty(i)) { 
        switch (mydata[i]['key']) {
          case "moved":
            mydata[i]['value'] = moment().format();
            break;
          case "parentid":
            mydata[i]['value'] = newParentId;
            break;
          case "oldparentid":
            mydata[i]['value'] = oldParentId;
            break;
        }
      }
    }
  });
  
  $('#tree').on('hover_node.jstree',function(e,data){
    if ($('#showDataItemDetails').prop('checked'))
      $('a[id=' + data.node.id + '_anchor]').webuiPopover({title:data.node.text,content:'Content'});
    else
      $('a[id=' + data.node.id + '_anchor]').webuiPopover('destroy');
  })    

  $("#btnAssociateDataItem").button().click(function(){

    if (undefined === $("#offIdentifier").val().trim() || !$("#offIdentifier").val().trim()) {
      alert( "Identifier must be set." );
      return;
    }

    if (undefined === $("#grtemporalfilter").val().trim() || !$("#grtemporalfilter").val().trim()) {
      alert( "Time filter must be supplied." );
      return;
    }

    var templateurl = S($("#offServers option:selected").val())
                  .getresulttemplateurl($("#offIdentifier").val(), 
                                        $("#offObservables option:selected").text());
    
    var wsurl = S($("#offServers option:selected").val())
              .getresultwsurl($("#offIdentifier").val(), 
                              $("#offObservables option:selected").text(),
                              $("#grtemporalfilter").val());
    
    // Get the select data item from tree
    var selectedNode= $('#tree').jstree(true).get_selected(true);

    var mydata = selectedNode[0].data; // Get my collection of objects that have <key, value> pairs.

    for (var i in mydata) {

      // Just in case some other code touched my collection object, check hasOwnProperty!
      if (mydata.hasOwnProperty(i)) {

        if (mydata[i]['key'] === "observables") {
        
          if (null === mydata[i]['value']) 
            mydata[i]['value'] = {};

          // Save the template URL and feed URL for the current observable
          var observableProperty = new Object();
          observableProperty.tempateurl = templateurl;
          observableProperty.dataurl = wsurl;
          mydata[i]['value'][Object.keys(mydata[i]['value']).length+1] =  observableProperty;
          
          break;
        }        
      }
    }
    alert('Observed property successfully associated with selected data item.');
  });
  
  $("#btnSaveTree").button().click(function(){
    var _DI = JSON.stringify($("#tree").jstree(true).get_json());
    localStorage.setItem("sosDataItems",_DI);
    alert("Data items saved successfully.")
  });

  $("#btnResetTree").button().click(function(){
    confirmdialog.dialog( "open" );
  });

	if("undefined" !== typeof(Storage) ) {
		loadDataItems(localStorage.getItem("sosDataItems"));
	} else {
    throw new Error("Local storage not supported.");
	}  
  
});
