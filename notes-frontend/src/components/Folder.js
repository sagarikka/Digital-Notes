import React, { useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link,useNavigate } from 'react-router-dom';

function Folder({folder,setSelectedFolder,selectedFolder, selectedFile, onFileClick}) {
  const [isOpen,setIsopen] =useState(true);
 
  
  const handleFolderClick =() => {
    console.log(selectedFolder,folder);
    if (selectedFolder === folder._id) {
        setSelectedFolder(null); // Unselect if clicked again
      } else {
        setSelectedFolder(folder._id); // Select if it's a new folder
      }
  }
  return (
    <div className='folder'>
        <div className={`folder-header ${selectedFolder === folder._id ? 'selected' : ''}`} // Highlight the selected folder
      onClick={handleFolderClick}>
            <span className='folder-name' onClick={()=>setIsopen(!isOpen)}>
                {isOpen?<Icon icon="material-symbols:folder-open" />:<Icon icon="icon-park-solid:folder-close" />}
               
            </span>
            {folder.name}    
        </div>
        {isOpen && (
            <div className='folder-contents'>
                {folder.contents.map((item) => 
                    item.itemType=== 'folder' ?(
                        <Folder 
                        key={item.item._id}
                        folder={item.item}
                        selectedFolder={selectedFolder} 
                        setSelectedFolder={setSelectedFolder}
                        onFileClick={onFileClick}
                        selectedFile={selectedFile}/>
                    ) : (
                        <div key={item.item._id} className='file'>
                            <Link to={`/file/${item.item._id}`} 
                            style={{textDecoration:'none', color: selectedFile === item ? '#4B0082' : 'black'}}
                            onClick={() => onFileClick(item)}
                            > 
                            📝{item.item.name}
                            </Link>
                        </div>
                    )
                )}
            </div>
        )}
    </div>
  )
}

export default Folder
