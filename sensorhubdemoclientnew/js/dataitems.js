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
                          'plugins' : ['checkbox'],
                          "checkbox": {
                                        "keep_selected_style": false,
                                        "three_state": false,
                                      },
                        } );
  }

  $('#tree').on('hover_node.jstree',function(e,data){
    if ($('#showDataItemDetails').prop('checked'))
      $('a[id=' + data.node.id + '_anchor]').webuiPopover({title:data.node.text,content:'Content'});
    else
      $('a[id=' + data.node.id + '_anchor]').webuiPopover('destroy');
  })    

	if("undefined" !== typeof(Storage) ) {
		loadDataItems(localStorage.getItem("sosDataItems"));
	} else {
    throw new Error("Local storage not supported.");
	}  
  
});