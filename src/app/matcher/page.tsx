"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle,
  Briefcase,
  Zap,
  TrendingUp,
  AlertCircle,
  Trash2,
  Eye,
  FileUp
} from "lucide-react";

export default function Home() {
  const [jd, setJd] = useState("");
  const { data: session } = useSession();
  const [files, setFiles] = useState<FileList | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');
  const [selectedResult, setSelectedResult] = useState<any>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(e.dataTransfer.files);
    }
  };

  const handleUpload = async () => {
    if (!jd || !files) {
      alert("Please enter a job description and upload resumes.");
      return;
    }
    if (!session?.user?.email) {
      alert("Please log in to continue.");
      return;
    }

    setLoading(true);
    const newResults = [];

    for (const file of Array.from(files)) {
      const reader = new FileReader();
      const text = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsText(file);
      });

      const res = await fetch("https://resumematcher.duckdns.org/flaskapp/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_description: jd,
          resume: text,
          email: session.user.email,
          filename: file.name,
        }),
      });

      const json = await res.json();

      if (res.status === 429) {
        window.location.href = "/plans?limit=true";
        return;
      }

      newResults.push({ filename: file.name, ...json });
    }

    setResults(newResults);
    setLoading(false);
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'score') {
      return b.match_score - a.match_score;
    }
    return a.filename.localeCompare(b.filename);
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100 border-green-300";
    if (score >= 60) return "bg-yellow-100 border-yellow-300";
    return "bg-red-100 border-red-300";
  };

  function downloadCSV() {
    if (results.length === 0) return;

    const header = ["Filename", "Score", "Matched Skills", "Missing Skills"];
    const rows = results.map((r) => [
      r.filename,
      r.match_score,
      `"${r.matched_skills?.join(", ") || ""}"`,
      `"${r.missing_skills?.join(", ") || ""}"`,
    ]);

    const csvContent = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "resume_scores.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <Link href="/profile">
              <button className="px-4 py-2 text-blue-600 hover:text-blue-700 transition">
                View Profile
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Resume Matcher
          </h1>
          <p className="text-gray-600">Upload resumes and get instant AI-powered match scores</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">Job Description</h2>
              </div>
              <textarea
                placeholder="Paste the job description here..."
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                rows={10}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Tip: Include key skills, requirements, and responsibilities for better matching
              </p>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <FileUp className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">Upload Resumes</h2>
              </div>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                  dragActive 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop resume files here, or click to browse
                </p>
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Select Files
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: TXT, PDF, DOCX
                </p>
              </div>

              {files && files.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Selected files:</h3>
                  <div className="space-y-2">
                    {Array.from(files).map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={loading || !jd || !files}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition transform ${
                  loading || !jd || !files
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Resumes...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Match Resumes
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                Match Results
              </h2>
              {results.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'score' | 'name')}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="score">Sort by Score</option>
                    <option value="name">Sort by Name</option>
                  </select>
                  <button
                    onClick={downloadCSV}
                    className="flex items-center text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export CSV
                  </button>
                </div>
              )}
            </div>

            {results.length > 0 ? (
              <div className="space-y-4">
                {sortedResults.map((result, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 transition hover:shadow-md cursor-pointer ${
                      selectedResult === result ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedResult(selectedResult === result ? null : result)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-gray-500" />
                          {result.filename}
                        </h3>
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(result.match_score)}`}>
                        {result.match_score}%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          result.match_score >= 80 ? 'bg-green-500' :
                          result.match_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${result.match_score}%` }}
                      />
                    </div>

                    {/* Expanded Details */}
                    {selectedResult === result && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-700 flex items-center mb-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            Matched Skills ({result.matched_skills?.length || 0})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {result.matched_skills?.map((skill: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                              >
                                {skill}
                              </span>
                            )) || <span className="text-gray-500 text-sm">None</span>}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 flex items-center mb-2">
                            <XCircle className="w-4 h-4 text-red-500 mr-2" />
                            Missing Skills ({result.missing_skills?.length || 0})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {result.missing_skills?.map((skill: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                              >
                                {skill}
                              </span>
                            )) || <span className="text-gray-500 text-sm">None</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Summary Stats */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Summary</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {results.length}
                      </p>
                      <p className="text-sm text-gray-600">Total Resumes</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {results.filter(r => r.match_score >= 70).length}
                      </p>
                      <p className="text-sm text-gray-600">Good Matches</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.round(results.reduce((acc, r) => acc + r.match_score, 0) / results.length)}%
                      </p>
                      <p className="text-sm text-gray-600">Average Score</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">No results yet</p>
                <p className="text-sm text-gray-400">
                  Upload resumes and add a job description to see match scores
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Pro Tips for Better Matching</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Include specific technical skills and tools in the job description</li>
                <li>• Upload resumes in plain text format for best results</li>
                <li>• The AI looks for keyword matches and contextual relevance</li>
                <li>• Scores above 70% indicate strong candidates</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}