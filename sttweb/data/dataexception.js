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

var DataException = function (message) {
  this.name = "DataException";
  this.message = message;
}

DataException.prototype = Object.create(Error.prototype);
DataException.prototype.constructor = DataException;