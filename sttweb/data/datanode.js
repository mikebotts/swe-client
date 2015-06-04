package org.vast.stt.data;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import org.vast.cdm.common.DataComponent;
import org.vast.data.DataArray;
import org.vast.data.DataGroup;
import org.vast.data.DataValue;


/**
 * <p><b>Title:</b><br/>
 * Data Node
 * </p>
 *
 * <p><b>Description:</b><br/>
 * TODO DataNode type description
 * </p>
 *
 * <p>Copyright (c) 2007</p>
 * @author Alexandre Robin
 * @date Apr 1, 2006
 * @version 1.0
 */
public class DataNode
{
    protected List<String> possibleScalarMappings;
    protected List<String> possibleBlockMappings;
    protected Hashtable<String, BlockList> listMap;
    protected ArrayList<BlockList> listArray;
    protected boolean nodeStructureReady;
        
    
    public DataNode()
    {
        possibleScalarMappings = new ArrayList<String>();
        possibleBlockMappings = new ArrayList<String>();
        listMap = new Hashtable<String, BlockList>(1);
        listArray = new ArrayList<BlockList>(1);
    }
    
    
    public ArrayList<BlockList> getListArray()
    {
        return listArray;
    }
    
    
    public BlockList createList(DataComponent component)
    {
        BlockList newList = new BlockList();
        newList.setBlockStructure(component);
        listMap.put(component.getName(), newList);
        listArray.add(newList);
        rebuildMappings(component);
        component.clearData();
        return newList;
    }
    
    
    public BlockList getList(String name)
    {
        return listMap.get(name);
    }
    
    
    public void removeList(String name)
    {
        BlockList list = listMap.remove(name);
        listArray.remove(list);
    }
    
    
    public void clearList(String name)
    {
        listMap.get(name).clear();
    }
    
    
    public void clearAll()
    {
        for (int i=0; i<listArray.size(); i++)
            listArray.get(i).clear();
    }
    
    
    public boolean hasData()
    {
    	for (int i=0; i<listArray.size(); i++)
    		if (listArray.get(i).getSize() > 0)
    			return true;
    			
    	return false;
    }
    
    
    public void rebuildMappings(DataComponent component)
    {
        possibleScalarMappings.clear();
        possibleBlockMappings.clear();
        findPossibleMappings(component, component.getName());
    }
    
    
    private void findPossibleMappings(DataComponent component, String componentPath)
    {
        // for each array, build an array mapper
        if (component instanceof DataArray)
        {
            possibleBlockMappings.add(componentPath);
            DataComponent childComponent = ((DataArray)component).getArrayComponent();
            String childPath = componentPath + '/' + childComponent.getName();
            findPossibleMappings(childComponent, childPath);
        }
        
        // just descend into DataGroups
        else if (component instanceof DataGroup)
        {
            possibleBlockMappings.add(componentPath);
            for (int i = 0; i < component.getComponentCount(); i++)
            {
                DataComponent childComponent = component.getComponent(i);
                String childPath = componentPath + '/' + childComponent.getName();
                findPossibleMappings(childComponent, childPath);
            }
        }
        
        // handle DataValues
        else if (component instanceof DataValue)
        {
            possibleScalarMappings.add(componentPath);
        }
    }


    public List<String> getPossibleBlockMappings()
    {
        return possibleBlockMappings;
    }


    public List<String> getPossibleScalarMappings()
    {
        return possibleScalarMappings;
    }


    public boolean isNodeStructureReady()
    {
        return nodeStructureReady;
    }


    public void setNodeStructureReady(boolean nodeStructureReady)
    {
        this.nodeStructureReady = nodeStructureReady;
    }
}