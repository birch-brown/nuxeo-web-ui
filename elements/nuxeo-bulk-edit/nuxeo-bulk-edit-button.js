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
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@nuxeo/nuxeo-ui-elements/actions/nuxeo-action-button-styles.js';
import { I18nBehavior } from '@nuxeo/nuxeo-ui-elements/nuxeo-i18n-behavior.js';
import { FiltersBehavior } from '@nuxeo/nuxeo-ui-elements/nuxeo-filters-behavior.js';
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-tooltip.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

/**
`nuxeo-bulk-edit-button`
@group Nuxeo UI
@element nuxeo-bulk-edit-button
*/
class NuxeoBulkEditButton extends mixinBehaviors([I18nBehavior, FiltersBehavior], Nuxeo.OperationButton) {
  static get is() {
    return 'nuxeo-bulk-edit-button';
  }

  static get template() {
    return html`
      <style include="nuxeo-action-button-styles"></style>
      <template is="dom-if" if="[[_isAvailable(selectedDocuments)]]">
        <div class="action" on-tap="_doBulkEdit">
          <paper-icon-button noink id="diff" icon="polymer" aria-labelledby="label"></paper-icon-button>
          <span class="label" hidden$="[[!showLabel]]" id="label">[[_label]]</span>
          <nuxeo-tooltip position="[[tooltipPosition]]">[[_label]]</nuxeo-tooltip>
        </div>
      </template>
    `;
  }

  static get properties() {
    return {
      selectedDocuments: {
        type: Array,
        value: [],
      },
      tooltipPosition: {
        type: String,
        value: 'bottom',
      },
      /**
       * `true` if the action should display the label, `false` otherwise.
       */
      showLabel: {
        type: Boolean,
        value: false,
      },
      _label: {
        type: String,
        computed: '_computeLabel(i18n)',
      },
    };
  }

  _isAvailable() {
    return this.selectedDocuments && this.selectedDocuments.length > 1;
  }

  _doBulkEdit() {
    // console.log('doing bulk edit on the following documents:');
    // console.log(this.selectedDocuments);
  }

  _computeLabel() {
    // return this.i18n('documentDiffButton.tooltip');
    return 'hi, im the bulk edit button';
  }
}
window.customElements.define(NuxeoBulkEditButton.is, NuxeoBulkEditButton);
