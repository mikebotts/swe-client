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

import org.vast.stt.data.DataException;
import org.vast.stt.data.DataNode;
import org.vast.stt.event.EventType;
import org.vast.stt.event.STTEvent;
import org.vast.stt.event.STTEventListener;
import org.vast.stt.event.STTEventListeners;
import org.vast.util.ExceptionSystem;

var AbstractProvider = function () {
    protected static final String initError = "Error while initializing data provider ";
    protected static final String updateError = "Error while updating data provider ";
    
    protected String name;
    protected String description;
    protected boolean enabled = false;
	protected boolean canceled = false;
    protected boolean error = false;
    protected boolean redoUpdate = true;
    protected boolean updating = false;
	protected DataNode dataNode;
	protected STTTimeExtent timeExtent;
    protected STTSpatialExtent spatialExtent;
	protected STTTimeExtent maxTimeExtent;
	protected STTSpatialExtent maxSpatialExtent;
    protected STTEventListeners listeners;
    protected Object lock = new Object();
    
    
    public abstract void init() throws DataException;
    public abstract void updateData() throws DataException;
    public abstract boolean isSpatialSubsetSupported();
    public abstract boolean isTimeSubsetSupported();

	
    public AbstractProvider()
    {
        this.dataNode = new DataNode();
        this.setTimeExtent(new STTTimeExtent());
        this.setSpatialExtent(new STTSpatialExtent());
        listeners = new STTEventListeners(2);
    }
      
    
    public void startUpdate(boolean force)
    {
        if (!enabled || error)
            return;
        
        // if updating, continue only if force is true
        synchronized(lock)
        {
            if (updating)
            {
                if (!canceled && force)
                {
                    // make sure we canceled previous update properly
                    redoUpdate = true;
                    cancelUpdate();
                    return;
                }
                else
                    return;
            }
            
            updating = true;
        }
        
        Runnable updateRunnable = new Runnable()
        {
            public void run()
            {
                try
                {
                    dispatchEvent(new STTEvent(this, EventType.PROVIDER_UPDATE_START), false);
                    
                    do
                    {
                        try
                        {                             
                            canceled = false;
                            
                            synchronized(lock)
                            {
                                if (!canceled)
                                    redoUpdate = false;
                                else
                                    break;
                            }
                            
                            // init provider
                            if (!dataNode.isNodeStructureReady())
                                init();
                            
                            updateData();                
                        }
                        catch (DataException e)
                        {
                            error = true;
                            redoUpdate = false;
                            ExceptionSystem.display(e);
                            dispatchEvent(new STTEvent(e, EventType.PROVIDER_ERROR), false);
                        }
                        catch (Exception e)
                        {
                            error = true;
                            redoUpdate = false;
                            e.printStackTrace();
                            dispatchEvent(new STTEvent(e, EventType.PROVIDER_ERROR), false);
                        }
                    }
                    while (redoUpdate);
                    
                    updating = false;
                    
                    // send event
                    if (canceled)
                        dispatchEvent(new STTEvent(this, EventType.PROVIDER_UPDATE_CANCELED), false);
                    else
                        dispatchEvent(new STTEvent(this, EventType.PROVIDER_UPDATE_DONE), false);
                }
                catch (Exception e)
                {
                }
            }
        };
        
        Thread updateThread = new Thread(updateRunnable, "Updating: " + getName());
        updateThread.setPriority(Thread.NORM_PRIORITY);
        updateThread.start();
    }
    
    
    public void cancelUpdate()
    {
        canceled = true;
    }
	
	
	public void clearData()
	{
        error = false;
        
        if (dataNode != null)
		{
            dataNode.clearAll();
            dispatchEvent(new STTEvent(this, EventType.PROVIDER_DATA_CLEARED), false);
		}		
	}
	
	
    public DataNode getDataNode()
    {
        return dataNode;
    }
	
	
	public boolean isUpdating()
	{
		synchronized(lock) { return updating; }
	}


	public STTSpatialExtent getSpatialExtent()
	{
		return spatialExtent;
	}
	
	
	public void setSpatialExtent(STTSpatialExtent spatialExtent)
	{
		if (this.spatialExtent != spatialExtent)
        {
            if (this.spatialExtent != null)
                this.spatialExtent.removeListener(this);
            
            this.spatialExtent = spatialExtent;
            
            if (this.spatialExtent != null)
                this.spatialExtent.addListener(this);
        }
	}


	public STTTimeExtent getTimeExtent()
	{
		return timeExtent;
	}


	public void setTimeExtent(STTTimeExtent timeExtent)
	{
        if (this.timeExtent != timeExtent)
        {
            if (this.timeExtent != null)
                this.timeExtent.removeListener(this);
            
            this.timeExtent = timeExtent;
            
            if (this.timeExtent != null)
                this.timeExtent.addListener(this);
        }
	}


	public STTSpatialExtent getMaxSpatialExtent()
	{
		return maxSpatialExtent;
	}


	public void setMaxSpatialExtent(STTSpatialExtent maxSpatialExtent)
	{
		this.maxSpatialExtent = maxSpatialExtent;
	}


	public STTTimeExtent getMaxTimeExtent()
	{
		return maxTimeExtent;
	}


	public void setMaxTimeExtent(STTTimeExtent maxTimeExtent)
	{
		this.maxTimeExtent = maxTimeExtent;
	}


    public String getDescription()
    {
        return description;
    }


    public void setDescription(String description)
    {
        this.description = description;
    }


    public String getName()
    {
        return name;
    }


    public void setName(String name)
    {
        this.name = name;
    }


    public void handleEvent(STTEvent e)
    {
        switch (e.type)
        {
            case TIME_EXTENT_CHANGED:
                if (this.isTimeSubsetSupported() && isEnabled())
                {
                    startUpdate(true);
                    break;
                }
                    
            case SPATIAL_EXTENT_CHANGED:
                if (this.isSpatialSubsetSupported() && isEnabled())
                {
                    startUpdate(true);
                    break;
                }
        }
    }
    
    
    public boolean hasError()
    {
        return error;
    }
    
    
    public void setError(boolean error)
    {
        this.error = error;
    }
    
    
    public boolean isEnabled()
    {
        return enabled;
    }
    
    
    public void setEnabled(boolean enabled)
    {
        if (this.enabled == enabled)
            return;
        else
            this.enabled = enabled;
        
        if (enabled)
        {
            if (!dataNode.isNodeStructureReady() || !dataNode.hasData() || error)
            {
                error = false;
                startUpdate(false);
            }
        }
    }
    
    
    public void addListener(STTEventListener listener)
    {
        listeners.add(listener);        
    }


    public void removeListener(STTEventListener listener)
    {
        listeners.remove(listener);        
    }


    public void removeAllListeners()
    {
        listeners.clear();        
    }
    
    
    public boolean hasListeners()
    {
        return !listeners.isEmpty();
    }


    public void dispatchEvent(STTEvent event, boolean merge)
    {
        event.producer = this;
        listeners.dispatchEvent(event, merge);
    }
  
}
