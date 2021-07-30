/**
@license
(C) Copyright Nuxeo Corp. (http://nuxeo.com/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { I18nBehavior } from '@nuxeo/nuxeo-ui-elements/nuxeo-i18n-behavior.js';
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-select.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

/**
`nuxeo-bulk-widget`
@group Nuxeo UI
@element nuxeo-bulk-widget
*/
class NuxeoBulkWidget extends mixinBehaviors([I18nBehavior], Nuxeo.Element) {
  static get is() {
    return 'nuxeo-bulk-widget';
  }

  static get template() {
    return html`
      <style>
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        label {
          @apply --nuxeo-label;
        }
        nuxeo-select {
          /* disable underline */
          --paper-input-container-underline: {
            display: none;
          }
          /* disable underline (focused) */
          --paper-input-container-underline-focus: {
            display: none;
          }
          /* remove padding-top on the paper-dropdown-menu */
          --paper-dropdown-menu-padding-top: 0;
          /* remove padding on  the paper-input */
          --paper-input-container-padding: 0;
          /* tweak text inside the paper-input element */
          --paper-input-container-input: {
            font-size: 12px;
            text-align: right;
          }
          /* tweak text inside paper-items */
          --paper-item: {
            font-size: 12px;
          }
          /* set the width to make sure the text of the options doesn't wrap */
          width: 160px;
        }
      </style>
      <div class="header">
        <label>[[label]]</label>
        <nuxeo-select options="[[_options]]"></nuxeo-select>
      </div>
      <slot></slot>
    `;
  }

  static get properties() {
    return {
      /**
       * Label.
       */
      label: String,
      _options: {
        type: Array,
        value: ['Replace with', 'Keep current values'],
      },
    };
  }
}
window.customElements.define(NuxeoBulkWidget.is, NuxeoBulkWidget);
