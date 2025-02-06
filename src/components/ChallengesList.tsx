import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Trophy, Zap, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../lib/store';

const challenges = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target.",
    completedBy: 1234,
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    completedBy: 856,
  },
  {
    id: 3,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    completedBy: 432,
  }
];

export function ChallengesList() {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const { completedChallenges } = useAuthStore();

  const filteredChallenges = selectedDifficulty
    ? challenges.filter(c => c.difficulty === selectedDifficulty)
    : challenges;

  const difficultyColors = {
    Easy: 'bg-green-500/10 text-green-500 ring-green-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-500 ring-yellow-500/20',
    Hard: 'bg-red-500/10 text-red-500 ring-red-500/20',
  };

  const difficultyIcons = {
    Easy: <Brain className="h-5 w-5" />,
    Medium: <Zap className="h-5 w-5" />,
    Hard: <Trophy className="h-5 w-5" />,
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-8">Daily Coding Challenges</h1>
      
      <div className="flex gap-4 mb-8">
        {['Easy', 'Medium', 'Hard'].map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ring-1 transition-all
              ${selectedDifficulty === difficulty ? 'ring-2 scale-105' : 'ring-1 hover:scale-105'}
              ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}
          >
            {difficultyIcons[difficulty as keyof typeof difficultyIcons]}
            {difficulty}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredChallenges.map((challenge) => (
          <div
            key={challenge.id}
            onClick={() => navigate(`/challenge/${challenge.id}`)}
            className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{challenge.title}</h3>
                {completedChallenges.includes(challenge.id) && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${difficultyColors[challenge.difficulty as keyof typeof difficultyColors]}`}>
                {challenge.difficulty}
              </span>
            </div>
            <p className="text-gray-400 mb-4">{challenge.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Trophy className="h-4 w-4 mr-1" />
              {challenge.completedBy.toLocaleString()} developers completed this challenge
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}