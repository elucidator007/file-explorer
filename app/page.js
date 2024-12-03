'use client'
import { EXPLORER } from "@/utils/constants";
import { useState } from "react";

export default function Home() {
    const [explorer, setExplorer] = useState(EXPLORER);
    const [expand, setExpand] = useState({});
    const [showInput, setShowInput] = useState({
        visible: false,
        isFolder: false,
        parentId: null
    });

    const handleExpand = (ele) => {
        setExpand(prev => {
            const temp = { ...prev }
            if(temp[ele.id]){
                temp[ele.id] = false
            }else{  
                temp[ele.id] = true
            }
            return temp
        })
    }

    const handleNewItem = (e, parentId, isFolder) => {
        e.stopPropagation();
        setShowInput({
            visible: true,
            isFolder,
            parentId
        });
    }

    const handleAddItem = (e) => {
        if (e.keyCode === 13 && e.target.value) {
            const name = e.target.value;
            const newItem = {
                id: Date.now(),
                name,
                isFolder: showInput.isFolder,
                items: showInput.isFolder ? [] : null
            };

            // Function to add item to nested structure
            const addItemToExplorer = (data) => {
                return data.map((item) => {
                    if (item.id === showInput.parentId) {
                        return {
                            ...item,
                            items: [...(item.items || []), newItem]
                        };
                    }
                    if (item.items) {
                        return {
                            ...item,
                            items: addItemToExplorer(item.items)
                        };
                    }
                    return item;
                });
            };

            setExplorer(addItemToExplorer(explorer));
            setShowInput({ visible: false, isFolder: false, parentId: null });
            // Expand the parent folder
            setExpand(prev => ({
                ...prev,
                [showInput.parentId]: true
            }));
        }
    }

    const FileIcon = ({ isFolder, isExpanded }) => {
        if (isFolder) {
            return (
                <svg className="w-5 h-5 text-[#E195AB]" viewBox="0 0 20 20" fill="currentColor">
                    {isExpanded ? (
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    ) : (
                        <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4z" />
                    )}
                </svg>
            );
        }
        return (
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
        );
    };

    const ActionButtons = ({ element }) => {
        return (
            <div className="ml-auto flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                    onClick={(e) => handleNewItem(e, element.id, false)}
                    className="hover:bg-[#FFCCE1] bg-[#E195AB] text-white text-xs py-0.5 px-2 rounded-md transition-colors duration-150">
                    + File
                </button>
                <button 
                    onClick={(e) => handleNewItem(e, element.id, true)}
                    className="hover:bg-[#FFCCE1] bg-[#E195AB] text-white text-xs py-0.5 px-2 rounded-md transition-colors duration-150">
                    + Folder
                </button>
            </div>
        );
    };

    const file = (explorer) => {
        return (
            <div className="flex flex-col">
                {explorer.map(element => (
                    <div key={element.id} className="ml-4">
                        <div 
                            onClick={() => handleExpand(element)}
                            className={`group flex items-center py-1.5 px-2 rounded-md cursor-pointer
                                ${element.isFolder ? 'hover:bg-[#FFF5D7]' : 'hover:bg-[#F2F9FF]'}
                                ${expand[element.id] ? 'bg-[#FFF5D7] bg-opacity-40' : ''}
                                transition-colors duration-150 ease-in-out`}
                        >
                            <div className="flex items-center flex-1 min-w-0">
                                <div className="mr-1.5 flex items-center">
                                    <FileIcon isFolder={element.isFolder} isExpanded={expand[element.id]} />
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <span className={`truncate ${element.isFolder ? 'text-[#E195AB] font-medium' : 'text-gray-700'}`}>
                                        {element.name}
                                    </span>
                                    {element.isFolder && <ActionButtons element={element} />}
                                </div>
                            </div>
                            {element.isFolder && (
                                <span className="ml-2 text-xs text-[#E195AB]">
                                    {expand[element.id] ? '[-]' : '[+]'}
                                </span>
                            )}
                        </div>
                        <div className={`
                            overflow-hidden transition-all duration-200
                            ${expand[element.id] ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
                        `}>
                            {element.items && file(element.items)}
                            {showInput.visible && showInput.parentId === element.id && (
                                <div className="ml-4 my-2 flex items-center">
                                    <FileIcon isFolder={showInput.isFolder} isExpanded={false} />
                                    <input
                                        type="text"
                                        autoFocus
                                        onKeyDown={handleAddItem}
                                        onBlur={() => setShowInput({ visible: false, isFolder: false, parentId: null })}
                                        className="ml-1 px-2 py-1 border border-[#E195AB] rounded-md text-sm focus:outline-none focus:border-[#FFCCE1] focus:ring-1 focus:ring-[#FFCCE1]"
                                        placeholder={`Enter ${showInput.isFolder ? 'folder' : 'file'} name...`}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F2F9FF] to-white p-8">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold text-[#E195AB] text-center">
                    File Explorer
                </h1>
            </header>
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-[#FFCCE1] overflow-hidden">
                <div className="bg-[#F2F9FF] px-4 py-2 border-b border-[#FFCCE1]">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-[#FFCCE1]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#E195AB]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#FFF5D7]"></div>
                    </div>
                </div>
                <div className="p-4">
                    {file(explorer)}
                </div>
            </div>
        </div>
    );
}