import React, { useEffect, useState } from "react";
import {
  fetchRepos,
  fetchRepoFiles,
  fetchFileContent,
  generateTests,
  fetchUser,
} from "../services/api";
import { FaFolder, FaFileCode } from "react-icons/fa";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // Or any other style
import FileTree from "../components/FileTree";
import ChatPanel from "../components/ChatPanel";
import Header from "../components/Header";

export default function DashboardPage() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [aiResults, setAiResults] = useState(null);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [error, setError] = useState(null);
  const [currentFolderPath, setCurrentFolderPath] = useState(''); // New state for current folder path
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    setLoadingRepos(true);
    fetchRepos()
      .then(setRepos)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingRepos(false));
    fetchUser()
        .then(setUserInfo)
        .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (selectedRepo) {
      setLoadingFiles(true);
      fetchRepoFiles(selectedRepo.owner.login, selectedRepo.name, currentFolderPath)
        .then(setFiles)
        .catch((e) => setError(e.message))
        .finally(() => setLoadingFiles(false));
    }
  }, [selectedRepo, currentFolderPath]); // Dependencies

  const handleRepoClick = (repo) => {
    setSelectedRepo(repo);
    setCurrentFolderPath(''); // Reset folder path when new repo is selected
    setFiles([]); // Clear current files immediately
    setSelectedFiles([]); // Clear selected files
    setAiResults(null); // Reset previous AI results
  };

  const handleFileSelect = (file) => {
    setSelectedFiles((prev) =>
      prev.includes(file.sha)
        ? prev.filter((sha) => sha !== file.sha)
        : [...prev, file.sha]
    );
  };

  const handleGenerateTests = async () => {
    setLoadingFiles(true);
    try {
      const selectedFileObjs = files.filter(
        (f) => selectedFiles.includes(f.sha) && f.type === "file"
      );
      const filesToSend = await Promise.all(
        selectedFileObjs.map((f) =>
          fetchFileContent(selectedRepo.owner.login, selectedRepo.name, f.path)
        )
      );
      const resp = await generateTests(filesToSend);
      setAiResults(resp.summaries);
    } catch (e) {
      setError(e.message);
    }
    setLoadingFiles(false);
  };

  const handleFileClick = (file) => {
    if (file.type === 'dir') {
      setCurrentFolderPath(file.path);
      setFiles([]); // Clear current files immediately
      setSelectedFiles([]); // Clear selected files
      setAiResults(null); // Reset AI results
    } else {
      // Handle file selection (existing logic)
      handleFileSelect(file.sha);
    }
  };

  const handleSelectAll = () => {
    const allFileShas = files.filter(file => file.type === 'file').map(file => file.sha);
    setSelectedFiles(allFileShas);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => alert('Code copied to clipboard!'))
      .catch((err) => console.error('Failed to copy code: ', err));
  };

  const handleDownloadCode = (code, filename) => {
    const blob = new Blob([code], { type: 'text/javascript' }); // Assuming JavaScript
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Header userInfo={userInfo} />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Left Panel */}
        <aside className="sidebar" style={{ padding: "20px", borderRight: "1px solid #333" }}>
          <h2>Repositories</h2>
          {loadingRepos ? (
            <p>Loading...</p>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : selectedRepo ? (
            <div>
              <button onClick={() => setSelectedRepo(null)}>Back to Repositories</button>
              <h3>{selectedRepo.name}</h3>
            </div>
          ) : (
            <ul className="repo-list">
              {repos.map((repo) => (
                <li
                  key={repo.id}
                  onClick={() => handleRepoClick(repo)}
                  className={selectedRepo?.id === repo.id ? "selected" : ""}
                >
                  {repo.name}
                </li>
              ))}
            </ul>
          )}

          {selectedRepo && (
            <>
              <h3 style={{ marginTop: "20px" }}>
                Files in {selectedRepo.name}
                {currentFolderPath && (
                  <button onClick={() => setCurrentFolderPath('')} style={{ marginLeft: '10px', fontSize: '0.8em' }}>Back</button>
                )}
                {files.filter(file => file.type === 'file').length > 0 && (
                  <button onClick={handleSelectAll} style={{ marginLeft: '10px', fontSize: '0.8em' }}>Select All</button>
                )}
              </h3>
              {loadingFiles ? (
                <p>Loading files...</p>
              ) : files?.length > 0 ? (
                <FileTree
                  files={files}
                  onFileClick={handleFileSelect} // Pass handleFileSelect
                  onFolderClick={handleFileClick} // Pass handleFileClick
                  selectedFiles={selectedFiles}
                  currentFolderPath={currentFolderPath}
                />
              ) : (
                <div className="alert-info">No files found or permission issue.</div>
              )}
            </>
          )}

          {/* Chat Panel */}
          {aiResults && ( // Only show chat if AI results are available
            <ChatPanel initialMessage="This is the test case I generated for you. How can I help you improve it?" />
          )}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: 36 }}>
          <h2>Generated Test Cases</h2>
          {selectedFiles.length > 0 && (
            <button
              type="button"
              className="button-neon"
              onClick={handleGenerateTests}
              disabled={loadingFiles || selectedFiles.length === 0} // Disable if no files selected
            >
              {loadingFiles ? "Generating..." : "Generate Test Cases with AI"}
            </button>
          )}

          {aiResults && (
            <div className="card" style={{ backdropFilter: 'blur(10px)', marginTop: 28, maxHeight: '60vh',maxBlockSize:'150vh', overflowY: 'auto' }}>
              <h3>AI-Generated Test Cases & Summaries</h3>
              {aiResults.map((result, idx) => (
                <div key={idx} style={{ position: 'relative', marginBottom: '20px' }}>
                  <button
                    onClick={() => handleCopyCode(result)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      zIndex: 1,
                    }}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleDownloadCode(result, `test_case_${idx}.js`)} // Assuming .js extension
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '80px', // Adjust position
                      background: '#28a745', // Green color
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      zIndex: 1,
                    }}
                  >
                    Download
                  </button>
                  <SyntaxHighlighter
                    language="javascript" // Assuming JavaScript/TypeScript tests
                    style={docco} // Apply the chosen style
                    showLineNumbers={true}
                    wrapLines={true}
                    codeTagProps={{ style: { whiteSpace: 'pre-wrap' } }}
                    customStyle={{

                      backgroundColor: "#1e1e1e", // Dark background
                      color: "#d4d4d4", // Light text color
                      maxHeight: '300px',
                      overflowY: 'auto',
                      border: '1px solid #ccc',
                      paddingTop: '40px', // Make space for the button
                      width: '100%',
                    }}
                  >
                    {result}
                  </SyntaxHighlighter>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
