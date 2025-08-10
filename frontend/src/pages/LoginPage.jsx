import React from "react";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="centered">
      <h1 className="glow">Testcase <span style={{color:"#61DAFB"}}>AI</span></h1>
      <div style={{ color: "#bababa", fontSize: 18, marginBottom: 34 }}>AI-powered test code, instantly from your codebase</div>
      <a
        href="http://localhost:5000/api/auth/github"
        className="button-neon"
        style={{fontSize: 20, marginTop: 8}}
      >
        <FaGithub size={28} style={{marginRight:8}}/> Login with GitHub
      </a>
      <div style={{ color: "#445", fontSize: 14, marginTop: 28 }}>
        <span style={{ color: "#00BFFF" }}>⚡</span> Secure GitHub OAuth
      </div>
    </div>
  );
}
