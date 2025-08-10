export async function fetchRepos() {
  const res = await fetch("http://localhost:5000/api/github/user/repos", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch repos");
  return res.json();
}

export async function fetchRepoFiles(owner, repo, folderPath = "") {
  // Optionally pass a folderPath for folder navigation
  const url = folderPath
    ? `http://localhost:5000/api/github/repos/${owner}/${repo}/files?path=${encodeURIComponent(folderPath)}`
    : `http://localhost:5000/api/github/repos/${owner}/${repo}/files`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch files");
  return res.json();
}

export async function fetchFileContent(owner, repo, path) {
  const res = await fetch(
    `http://localhost:5000/api/github/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Failed to fetch file content");
  const data = await res.json();
  // If you want decoded content:
  return {
    name: data.name,
    content: atob(data.content.replace(/\n/g, "")) // decode base64!
  };
}

// --- AI test case generation
export async function generateTests(files) {
  const res = await fetch("http://localhost:5000/api/ai/generate-tests", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });
  if (!res.ok) throw new Error("Failed to generate tests");
  return res.json();
}

export async function chatWithAI(history, message) {
  const res = await fetch("http://localhost:5000/api/ai/chat", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history, message }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    const errorMessage = errorData.details ? errorData.details.message : "Failed to send message";
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function fetchUser() {
    const res = await fetch("http://localhost:5000/api/github/user", { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
}