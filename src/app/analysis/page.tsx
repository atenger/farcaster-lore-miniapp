'use client';

import { useState } from 'react';
import { analyzeCastIndex, getCastHashDetails, getAuthorCasts } from '@/lib/dataValidation';
import { AnalysisResult, CastIndexEntry } from '@/lib/types';

export default function AnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [castHashDetails, setCastHashDetails] = useState<CastIndexEntry[] | null>(null);
  const [authorCasts, setAuthorCasts] = useState<CastIndexEntry[] | null>(null);
  const [selectedHash, setSelectedHash] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

  const runAnalysis = () => {
    try {
      const result = analyzeCastIndex();
      setAnalysisResult(result);
      setCastHashDetails(null);
      setAuthorCasts(null);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Check console for details.');
    }
  };

  const analyzeHash = () => {
    if (!selectedHash.trim()) {
      alert('Please enter a cast hash');
      return;
    }
    try {
      const details = getCastHashDetails(selectedHash);
      setCastHashDetails(details);
      setAuthorCasts(null);
    } catch (error) {
      console.error('Hash analysis failed:', error);
      alert('Hash analysis failed. Check console for details.');
    }
  };

  const analyzeAuthor = () => {
    if (!selectedAuthor.trim()) {
      alert('Please enter an author username');
      return;
    }
    try {
      const casts = getAuthorCasts(selectedAuthor);
      setAuthorCasts(casts);
      setCastHashDetails(null);
    } catch (error) {
      console.error('Author analysis failed:', error);
      alert('Author analysis failed. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Data Analysis Tools</h1>
        
        {/* Main Analysis */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cast Index Analysis</h2>
          <button
            onClick={runAnalysis}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Run Full Analysis
          </button>
          
          {analysisResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Analysis Results:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Total casts: <span className="font-mono">{analysisResult.totalCasts}</span></div>
                <div>Unique hashes: <span className="font-mono">{analysisResult.uniqueHashes}</span></div>
                <div>Unique authors: <span className="font-mono">{analysisResult.uniqueAuthors}</span></div>
                <div>Unique episodes: <span className="font-mono">{analysisResult.uniqueEpisodes}</span></div>
                <div>Duplicate hashes: <span className="font-mono text-red-600">{analysisResult.duplicateHashes}</span></div>
                <div>Duplicate author+hash: <span className="font-mono text-red-600">{analysisResult.duplicateAuthorHashes}</span></div>
              </div>
              
              {analysisResult.duplicateHashDetails.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-red-600">Top Duplicated Cast Hashes:</h4>
                  <div className="mt-2 space-y-1">
                    {analysisResult.duplicateHashDetails.map(([hash, count]: [string, number]) => (
                      <div key={hash} className="text-sm">
                        <span className="font-mono">{hash}</span>: {count} times
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hash Analysis */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Analyze Specific Cast Hash</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={selectedHash}
              onChange={(e) => setSelectedHash(e.target.value)}
              placeholder="Enter cast hash (e.g., 0x5ae4c143)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
            />
            <button
              onClick={analyzeHash}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Analyze
            </button>
          </div>
          
          {castHashDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Cast Hash Details:</h3>
              <div className="space-y-2">
                {castHashDetails.map((cast, index: number) => (
                  <div key={index} className="text-sm border-l-2 border-blue-500 pl-3">
                    <div><strong>Author:</strong> {cast.author_username}</div>
                    <div><strong>Date:</strong> {cast.show_date}</div>
                    <div><strong>Episode:</strong> {cast.source_episode_id}</div>
                    <div><strong>Title:</strong> {cast.show_title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Author Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Analyze Author Casts</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              placeholder="Enter author username"
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
            />
            <button
              onClick={analyzeAuthor}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Analyze
            </button>
          </div>
          
          {authorCasts && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Author Casts ({authorCasts.length} total):</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {authorCasts.map((cast, index: number) => (
                  <div key={index} className="text-sm border-l-2 border-purple-500 pl-3">
                    <div><strong>Hash:</strong> {cast.cast_hash}</div>
                    <div><strong>Date:</strong> {cast.show_date}</div>
                    <div><strong>Episode:</strong> {cast.source_episode_id}</div>
                    <div><strong>Title:</strong> {cast.show_title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold text-yellow-800 mb-2">💡 Tips:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Check the browser console for detailed logs</li>
            <li>• Use the analysis results to identify data quality issues</li>
            <li>• Focus on fixing the most duplicated cast hashes first</li>
            <li>• Consider if duplicates are legitimate (same cast mentioned in multiple episodes)</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 