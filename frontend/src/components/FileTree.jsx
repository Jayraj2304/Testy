// frontend/src/components/FileTree.jsx

import React from 'react';
import { FaFolder, FaFileCode } from 'react-icons/fa';

const FileTree = ({ files, onFileClick, onFolderClick, selectedFiles, currentFolderPath }) => {
  return (
    <ul className="file-tree">
      {files.map((file) => (
        <li
          key={file.sha}
          className={selectedFiles.includes(file.sha) ? "selected" : ""}
          onClick={() => file.type === 'dir' ? onFolderClick(file) : onFileClick(file)}
          style={{ cursor: "pointer" }}
        >
          <label> {/* Add label for checkbox */}
            <span style={{ marginRight: 11 }}>
              {file.type === "dir" ? (
                <FaFolder color="#89F9FE" />
              ) : (
                <FaFileCode color="#61DAFB" />
              )}
            </span>
            {file.type === "file" && (
              <input
                type="checkbox"
                checked={selectedFiles.includes(file.sha)}
                onChange={() => onFileClick(file)} // Use onFileClick from props
                disabled={file.type !== "file"}
              />
            )}
            {file.name}
          </label>
        </li>
      ))}
    </ul>
  );
};

export default FileTree;
