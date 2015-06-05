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
 *
 * The Original Code is the "Space Time Toolkit".
 *
 * The Initial Developer of the Original Code is the VAST team at the
 * University of Alabama in Huntsville (UAH). <http://vast.uah.edu>
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 */

/**
 * @date June 4, 2015
 * @public
 */

var DataNode = function () {
  
  // Private
  var _possibleScalarMappings = [];
  var _possibleBlockMappings = [];
  var _listMap = {};
  var _nodeStructureReady = false;
        
  this.createList = function(component) {
    var newList = new BlockList();
    newList.setBlockStructure(component);
    _listMap[component.getName()] = newList;
    rebuildMappings(component);
    component.clearData();
    return newList;
  }
  
  this.getList = function(name) {
    return _listMap[name];
  }
  
  this.removeList = function(name) {
    delete _listMap[name];
  }
  
  public void clearList(name) {
    _listMap[name] = null;
  }
  
  this.hasData = function() {
    for (var member in _listMap) {
      if (null !== member) {
        return true;
      }  
    }
    return false;
  }
  
  this.rebuildMappings = function(component) {
    possibleScalarMappings.length = 0;
    possibleBlockMappings.length = 0;
    findPossibleMappings(component, component.getName());
  }
  
  this.findPossibleMappings = function(component, componentPath) {
    // for each array, build an array mapper
    if (component instanceof DataArray) {
      possibleBlockMappings.push(componentPath);
      var childComponent = component.getArrayComponent();
      var childPath = componentPath + '/' + childComponent.getName();
      findPossibleMappings(childComponent, childPath);
    } else if (component instanceof DataGroup) {
      possibleBlockMappings.push(componentPath);
      for (int i = 0; i < component.getComponentCount(); i++) {
        var childComponent = component.getComponent(i);
        var childPath = componentPath + '/' + childComponent.getName();
        findPossibleMappings(childComponent, childPath);
      }
    } else if (component instanceof DataValue) {
      possibleScalarMappings.push(componentPath);
    }
  }

  this.getPossibleBlockMappings = function() {
    return _possibleBlockMappings;
  }

  this.getPossibleScalarMappings = function() {
    return _possibleScalarMappings;
  }

  public boolean isNodeStructureReady() {
    return _nodeStructureReady;
  }

  this.setNodeStructureReady = function(nodeStructureReady) {
    _nodeStructureReady = nodeStructureReady;
  }

}