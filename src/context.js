/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TreeWalker } from './tree_walker';
import { notifications } from './notifications';


/**
 * Keeps track of the state of a patch.
 * @param {!Element|!DocumentFragment} node The root Node of the subtree the
 *     is for.
 * @param {?Context} prevContext The previous context.
 * @constructor
 */
function Context(node, prevContext) {
  /**
   * @const {TreeWalker}
   */
  this.walker = new TreeWalker(node);

  /**
   * @const {Document}
   */
  this.doc = node.ownerDocument;

  /**
   * Keeps track of what namespace to create new Elements in.
   * @private
   * @const {!Array<(string|undefined)>}
   */
  this.nsStack_ = [undefined];

  /**
   * @const {?Context}
   */
  this.prevContext = prevContext;

  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.created = notifications.nodesCreated && [];

  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.deleted = notifications.nodesDeleted && [];
}


/**
 * @return {(string|undefined)} The current namespace to create Elements in.
 */
Context.prototype.getCurrentNamespace = function() {
  return this.nsStack_[this.nsStack_.length - 1];
};


/**
 * @param {string=} namespace The namespace to enter.
 */
Context.prototype.enterNamespace = function(namespace) {
  this.nsStack_.push(namespace);
};


/**
 * Exits the current namespace
 */
Context.prototype.exitNamespace = function() {
  this.nsStack_.pop();
};


/**
 * @param {!Node} node
 */
Context.prototype.markCreated = function(node) {
  if (this.created) {
    this.created.push(node);
  }
};


/**
 * @param {!Node} node
 */
Context.prototype.markDeleted = function(node) {
  if (this.deleted) {
    this.deleted.push(node);
  }
};


/**
 * Notifies about nodes that were created during the patch opearation.
 */
Context.prototype.notifyChanges = function() {
  if (this.created && this.created.length > 0) {
    notifications.nodesCreated(this.created);
  }

  if (this.deleted && this.deleted.length > 0) {
    notifications.nodesDeleted(this.deleted);
  }
};


/**
 * The current context.
 * @type {?Context}
 */
var context;


/**
 * Enters a new patch context.
 * @param {!Element|!DocumentFragment} node
 */
var enterContext = function(node) {
  context = new Context(node, context);
};


/**
 * Restores the previous patch context.
 */
var restoreContext = function() {
  context = context.prevContext;
};


/**
 * Gets the current patch context.
 * @return {?Context}
 */
var getContext = function() {
  return context;
};


/** */
export {
  enterContext,
  restoreContext,
  getContext
};
