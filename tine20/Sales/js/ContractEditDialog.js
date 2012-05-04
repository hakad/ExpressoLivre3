/*
 * Tine 2.0
 * 
 * @package     Sales
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2007-2010 Metaways Infosystems GmbH (http://www.metaways.de)
 *
 */
 
Ext.namespace('Tine.Sales');

/**
 * Contract edit dialog
 * 
 * @namespace   Tine.Sales
 * @class       Tine.Sales.ContractEditDialog
 * @extends     Tine.widgets.dialog.EditDialog
 * 
 * <p>Contract Edit Dialog</p>
 * <p><pre>
 * </pre></p>
 * 
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2007-2010 Metaways Infosystems GmbH (http://www.metaways.de)
 * 
 * @param       {Object} config
 * @constructor
 * Create a new Tine.Sales.ContractGridPanel
 */
Tine.Sales.ContractEditDialog = Ext.extend(Tine.widgets.dialog.EditDialog, {
    /**
     * @private
     */
    labelAlign: 'side',
    
    /**
     * @private
     */
    windowNamePrefix: 'ContractEditWindow_',
    appName: 'Sales',
    recordClass: Tine.Sales.Model.Contract,
    recordProxy: Tine.Sales.contractBackend,
    tbarItems: [{xtype: 'widget-activitiesaddbutton'}],
    /**
     * if true, number will be readOnly and will be generated automatically
     * @type {Boolean} autoGenerateNumber
     */
    autoGenerateNumber: null,
    
    initComponent: function() {
        this.autoGenerateNumber = (Tine.Sales.registry.get('numberGeneration') == 'auto') ? true : false;
        Tine.Sales.ContractEditDialog.superclass.initComponent.call(this);
    },
    
    /**
     * reqests all data needed in this dialog
     */
    requestData: function() {
        this.loadRequest = Ext.Ajax.request({
            scope: this,
            success: function(response) {
                this.record = this.recordProxy.recordReader(response);
                this.onRecordLoad();
            },
            params: {
                method: 'Sales.getContract',
                id: this.record.id
            }
        });
    },
    
    /**
     * returns dialog
     * 
     * NOTE: when this method gets called, all initalisation is done.
     */
    getFormItems: function() {
        return {
            xtype: 'tabpanel',
            layoutOnTabChange: true,
            border: false,
            plain:true,
            activeTab: 0,
            border: false,
            items:[
                {
                title: this.app.i18n.n_('Contract', 'Contract', 1),
                autoScroll: true,
                border: false,
                frame: true,
                layout: 'border',
                items: [{
                    region: 'center',
                    xtype: 'columnform',
                    labelAlign: 'top',
                    formDefaults: {
                        xtype:'textfield',
                        anchor: '100%',
                        labelSeparator: '',
                        columnWidth: .333
                    },
                    items: [[{
                        columnWidth: .1,
                        fieldLabel: this.app.i18n._('Number'),
                        name: 'number',
                        readOnly: this.autoGenerateNumber,
                        allowBlank: this.autoGenerateNumber
                    },{
                        columnWidth: .9,
                        fieldLabel: this.app.i18n._('Title'),
                        name: 'title',
                        allowBlank: false
                    }], [{
                            columnWidth: .333,
                            xtype: 'tinerelationpickercombo',
                            fieldLabel: this.app.i18n._('Contact Customer'),
                            editDialog: this,
                            allowBlank: true,
                            app: this.app,
                            recordClass: Tine.Addressbook.Model.Contact,
                            relationType: 'CUSTOMER',
                            relationDegree: 'parent',
                            modelUnique: true
                        }, {
                            columnWidth: .333,
                            editDialog: this,
                            xtype: 'tinerelationpickercombo',
                            fieldLabel: this.app.i18n._('Contact Responsible'),
                            allowBlank: true,
                            app: this.app,
                            recordClass: Tine.Addressbook.Model.Contact,
                            relationType: 'RESPONSIBLE',
                            relationDegree: 'parent',
                            modelUnique: true
                        }, {
                            name: 'customer',
                            fieldLabel: this.app.i18n._('Company')
                        }],[
                    {
                            fieldLabel: this.app.i18n._('Status'),
                            name: 'status',
                            xtype: 'combo',
                            mode: 'local',
                            forceSelection: true,
                            triggerAction: 'all',
                            value: 'open',
                            store: [['closed', this.app.i18n._('closed')], ['open', this.app.i18n._('open')]]
                        }, {
                            fieldLabel: this.app.i18n._('Cleared'),
                            name: 'cleared',
                            xtype: 'combo',
                            mode: 'local',
                            forceSelection: true,
                            triggerAction: 'all',
                            value: 'not yet billed',
                            store: [
                                ['not yet billed', this.app.i18n._('not yet cleared')], 
                                ['to bill', this.app.i18n._('to clear')],
                                ['billed', this.app.i18n._('cleared')]
                            ]
                        }, {
                            fieldLabel: this.app.i18n._('Cleared in'),
                            name: 'cleared_in',
                            xtype: 'textfield'
                        }
                    ], [{
                            columnWidth: 1,
                            fieldLabel: this.app.i18n._('Description'),
                            emptyText: this.app.i18n._('Enter description...'),
                            name: 'description',
                            xtype: 'textarea',
                            height: 200
                    }]] 
                }, {
                    // activities and tags
                    layout: 'accordion',
                    animate: true,
                    region: 'east',
                    width: 210,
                    split: true,
                    collapsible: true,
                    collapseMode: 'mini',
                    header: false,
                    margins: '0 5 0 5',
                    border: true,
                    items: [
                        new Tine.widgets.activities.ActivitiesPanel({
                            app: 'Sales',
                            showAddNoteForm: false,
                            border: false,
                            bodyStyle: 'border:1px solid #B5B8C8;'
                        }),
                        new Tine.widgets.tags.TagPanel({
                            app: 'Sales',
                            border: false,
                            bodyStyle: 'border:1px solid #B5B8C8;'
                        })
                    ]
                }]
            }, new Tine.widgets.activities.ActivitiesTabPanel({
                app: this.appName,
                record_id: this.record.id,
                record_model: this.appName + '_Model_' + this.recordClass.getMeta('modelName')
            })]
        };
    }
});

/**
 * Sales Edit Popup
 */
Tine.Sales.ContractEditDialog.openWindow = function (config) {
    var window = Tine.WindowFactory.getWindow({
        width: 800,
        height: 470,
        name: Tine.Sales.ContractEditDialog.prototype.windowNamePrefix + Ext.id(),
        contentPanelConstructor: 'Tine.Sales.ContractEditDialog',
        contentPanelConstructorConfig: config
    });
    return window;
};
