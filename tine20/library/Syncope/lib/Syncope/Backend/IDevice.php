<?php

/**
 * Syncope
 *
 * @package     Command
 * @license     http://www.tine20.org/licenses/agpl-nonus.txt AGPL Version 1 (Non-US)
 *              NOTE: According to sec. 8 of the AFFERO GENERAL PUBLIC LICENSE (AGPL), 
 *              Version 1, the distribution of the Tine 2.0 Syncope module in or to the 
 *              United States of America is excluded from the scope of this license.
 * @copyright   Copyright (c) 2009-2012 Metaways Infosystems GmbH (http://www.metaways.de)
 * @author      Lars Kneschke <l.kneschke@metaways.de>
 */

/**
 * class to handle ActiveSync Sync command
 *
 * @package     Backend
 */
 
interface Syncope_Backend_IDevice
{
    /**
    * Create a new device
    *
    * @param  Syncope_Model_IDevice $_device
    * @return Syncope_Model_IDevice
    */
    public function create(Syncope_Model_IDevice $_device);
    
    /**
     * Deletes one or more existing devices
     *
     * @param string|array $_id
     * @return void
     */
    public function delete($_id);
    
    /**
     * Return a single device
     *
     * @param string $_id
     * @return Syncope_Model_IDevice
     */
    public function get($_id);
    
    /**
     * Upates an existing persistent record
     *
     * @param  Syncope_Model_IDevice $_device
     * @return Syncope_Model_IDevice
     */
    public function update(Syncope_Model_IDevice $_device);
}