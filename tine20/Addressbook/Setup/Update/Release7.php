<?php
/**
 * Tine 2.0
 *
 * @package     Addressbook
 * @subpackage  Setup
 * @license     http://www.gnu.org/licenses/agpl.html AGPL3
 * @copyright   Copyright (c) 2012 Metaways Infosystems GmbH (http://www.metaways.de)
 * @author      Philipp Schüle <p.schuele@metaways.de>
 */
class Addressbook_Setup_Update_Release7 extends Setup_Update_Abstract
{
    /**
     * update to 7.1
     * - add seq
     * 
     * @see 0000554: modlog: records can't be updated in less than 1 second intervals
     */
    public function update_0()
    {
        $declaration = Tinebase_Setup_Update_Release7::getRecordSeqDeclaration();
        try {
            $this->_backend->addCol('addressbook', $declaration);
        } catch (Zend_Db_Statement_Exception $zdse) {
            // ignore
        }
        $this->setTableVersion('addressbook', 17);
        
        // update contacts: set max seq from modlog + update modlog
        Tinebase_Setup_Update_Release7::updateModlogSeq('Addressbook_Model_Contact', 'addressbook');
        
        $this->setApplicationVersion('Addressbook', '7.1');
    }

    /**
     * update to 7.2
     * - make name in address_book_lists non-unique
     * 
     */
    public function update_1()
    {        
        $this->_backend->dropIndex('addressbook_lists', 'name');
        $declaration = new Setup_Backend_Schema_Index_Xml('
            <index>
                <name>name</name>
                <unique>false</unique>
                <field>
                    <name>name</name>
                </field>
            </index>
        ');
        $this->_backend->addIndex('addressbook_lists', $declaration);

        $this->setTableVersion('addressbook_lists', 3);
        $this->setApplicationVersion('Addressbook', '7.2');
    }
}
