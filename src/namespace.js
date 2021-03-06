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

import { getContext } from './context';

var SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Enters a tag, checking to see if it is a namespace boundary, and if so,
 * updates the current namespace.
 * @param {string} tag The tag to enter.
 */
var enterTag = function(tag) {
  if (tag === 'svg') {
    getContext().enterNamespace(SVG_NS);
  } else if (tag === 'foreignObject') {
    getContext().enterNamespace(undefined);
  }
};


/**
 * Exits a tag, checking to see if it is a namespace boundary, and if so,
 * updates the current namespace.
 * @param {string} tag The tag to enter.
 */
var exitTag = function(tag) {
  if (tag === 'svg' || tag === 'foreignObject') {
    getContext().exitNamespace();
  }
};


/**
 * Gets the namespace to create an element (of a given tag) in.
 * @param {string} tag The tag to get the namespace for.
 * @return {(string|undefined)} The namespace to create the tag in.
 */
var getNamespaceForTag = function(tag) {
  if (tag === 'svg') {
    return SVG_NS;
  }

  return getContext().getCurrentNamespace();
};


/** */
export {
  enterTag,
  exitTag,
  getNamespaceForTag
};
