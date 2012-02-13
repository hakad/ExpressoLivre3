/*
 * Tine 2.0
 * contacts combo box and store
 * 
 * @package     Addressbook
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schüle <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2007-2011 Metaways Infosystems GmbH (http://www.metaways.de)
 *
 */

Ext.ns('Tine.Addressbook');

/**
 * contact selection combo box
 * 
 * @namespace   Tine.Addressbook
 * @class       Tine.Addressbook.SearchCombo
 * @extends     Ext.form.ComboBox
 * 
 * <p>Contact Search Combobox</p>
 * <p><pre>
 * TODO         make this a twin trigger field with 'clear' button?
 * TODO         add switch to filter for expired/enabled/disabled user accounts
 * </pre></p>
 * 
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2007-2011 Metaways Infosystems GmbH (http://www.metaways.de)
 * 
 * @param       {Object} config
 * @constructor
 * Create a new Tine.Addressbook.SearchCombo
 * 
 * TODO         add     forceSelection: true ?
 */
Tine.Addressbook.SearchCombo = Ext.extend(Tine.Tinebase.widgets.form.RecordPickerComboBox, {
    
    /**
     * @cfg {Boolean} userOnly
     */
    userOnly: false,
    
    /**
     * @property additionalFilters
     * @type Array
     */
    additionalFilters: null,
    
    /**
     * use account objects/records in get/setValue
     * 
     * @cfg {Boolean} legacy
     * @legacy
     * 
     * TODO remove this later
     */
    useAccountRecord: false,
    
    itemSelector: 'div.search-item',
    minListWidth: 200,
    enableKeyEvents: true,
    
    //private
    initComponent: function(){
        this.recordClass = Tine.Addressbook.Model.Contact;
        this.recordProxy = Tine.Addressbook.contactBackend;
        
        this.initTemplate();

//        this.on('added', Tine.widgets.dialog.EditDialog.prototype.addToDisableOnEditMultiple, this);

        if(this.useAccountRecord) {
            this.on('keyup', this.doEmptyCheck);
        }

        Tine.Addressbook.SearchCombo.superclass.initComponent.call(this);
    },
    
    /**
     * @todo see #5654
     * is called in accountMode to reset the value
     * @param event e
     */
    doEmptyCheck: function(e) {
        if(this.getRawValue() == '') this.setValue(null);
    },
    
    /**
     * use beforequery to set query filter
     * 
     * @param {Event} qevent
     */
    onBeforeQuery: function(qevent){
        Tine.Addressbook.SearchCombo.superclass.onBeforeQuery.apply(this, arguments);
        
        var filter = this.store.baseParams.filter;
        
        if (this.userOnly) {
            filter.push({field: 'type', operator: 'equals', value: 'user'});
        }
        
        if (this.additionalFilters !== null && this.additionalFilters.length > 0) {
            for (var i = 0; i < this.additionalFilters.length; i++) {
                filter.push(this.additionalFilters[i]);
            }
        }
    },
    
    /**
     * init template
     * @private
     */
    initTemplate: function() {
        // Custom rendering Template
        // TODO move style def to css ?
        if (! this.tpl) {
            this.tpl = new Ext.XTemplate(
                '<tpl for="."><div class="search-item">',
                    '<table cellspacing="0" cellpadding="2" border="0" style="font-size: 11px;" width="100%">',
                        '<tr>',
                            '<td width="30%"><b>{[this.encode(values.n_fileas)]}</b><br/>{[this.encode(values.org_name)]}</td>',
                            '<td width="25%">{[this.encode(values.adr_one_street)]}<br/>',
                                '{[this.encode(values.adr_one_postalcode)]} {[this.encode(values.adr_one_locality)]}</td>',
                            '<td width="25%">{[this.encode(values.tel_work)]}<br/>{[this.encode(values.tel_cell)]}</td>',
                            '<td width="20%">',
                                '<img width="45px" height="39px" src="{jpegphoto}" />',
                            '</td>',
                        '</tr>',
                    '</table>',
                '</div></tpl>',
                {
                    encode: function(value) {
                         if (value) {
                            return Ext.util.Format.htmlEncode(value);
                        } else {
                            return '';
                        }
                    }
                }
            );
        }
    },
    
    getValue: function() {
        var ret = null;
        if (this.useAccountRecord) {
            if (this.selectedRecord) {
                ret = this.selectedRecord.get('account_id');
            } else {
                ret = this.accountId;
            }
        } else {
            ret = Tine.Addressbook.SearchCombo.superclass.getValue.call(this);
        }

        return ret;
    },

    setValue: function (value) {

        if (this.useAccountRecord) {
            if (value) {
                if(value.accountId) {
                    // account object
                    this.accountId = value.accountId;
                    value = value.accountDisplayName;
                } else if (typeof(value.get) == 'function') {
                    // account record
                    this.accountId = value.get('id');
                    value = value.get('name');
                }
            } else {
                this.accountId = null;
                this.selectedRecord = null;
                
            }
        }
        return Tine.Addressbook.SearchCombo.superclass.setValue.call(this, value);
    }

});

Tine.widgets.form.RecordPickerManager.register('Addressbook', 'Contact', Tine.Addressbook.SearchCombo);
