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

  $( "#btnTriggerMyCustomEvent").button().click(function(){
    $.event.trigger(myevent);
  });  

  
  $( document ).on('myevent',  function (e) { 
   var instance = $('#tree').jstree(true);
    console.log(instance._model.data);   
  });  
 
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
                                                          return true;
                                                        },
                                    'multiple' : false,
                                    'data' : jsTreeFormat }, 
                          'plugins' : ['checkbox', 'ui'],
                          "checkbox": {
                                        keep_selected_style: false,
                                        three_state: false,
                                        tie_selection : false
                                      },
                        } );
  } // loadDataItems

  $('#tree').on('check_node.jstree',function(e,data){
    
    // Perform default action
    var mydata = data.node.data,
        action = null;
    
    for (var i in mydata) {

      // Just in case some other code touched my collection object, check hasOwnProperty!
      if (mydata.hasOwnProperty(i)) {

        if (mydata[i]['key'] === "actions") {

          var actions = mydata[i]['value'];
          
          for (var j in actions) {

            if (actions.hasOwnProperty(j)) {
            
              if (1 === actions[j]['isdefault']) {
              
                action = actions[j];
                
                break;
              }
            }
          }
          break;
        }        
      }
    }
    
    if (action) {

      switch (action.text) {
        
        case "map_mapbox_using_leaflet" :
          
          /**
            *
            * S().gettemplate will get the template(s) and place them in templates.
            * S().getdata will open the sockets for the actions and place them in sockets.  
            * S().getdata will also place the last raw incoming message into socketdata.
            *
            */
          S().gettemplate(action, mydata, templates)
          .getdata(action, mydata, sockets, socketdata);
             
             //.parsedata(action, mydata, sockets, socketdata, socketparseddata);
          
          // Now that socketdata contains the last message for the socket, what do we want to do with it?
          // Say, GPS feed is coming in with time, lat, lon, alt, and socketdata contains the last such data record
          // Say, messages have been requested for 12:00:00 - 13:00:00 and are coming in
          // I just want to act on these incoming messages every 5 seconds.
          //
          
          break;

        default:
        
          throw new Error("Unknown action");
      
      }
    
    }
    
  
    
  }) // check_node   

  $('#tree').on('uncheck_node.jstree',function(e,data){

  }) // uncheck_node
  
  $('#tree').on('hover_node.jstree',function(e,data){
    if ($('#showDataItemDetails').prop('checked')){
    console.log(templates);
      $('a[id=' + data.node.id + '_anchor]').webuiPopover({title:data.node.text,content:'Content'});
    } else
      $('a[id=' + data.node.id + '_anchor]').webuiPopover('destroy');
  })    

	if("undefined" !== typeof(Storage) ) {
		loadDataItems(localStorage.getItem("sosDataItems"));
	} else {
    throw new Error("Local storage not supported.");
	}
  
});