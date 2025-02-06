import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { useAuthStore } from './lib/store';
import { AuthForm } from './components/AuthForm';
import { Challenge } from './components/Challenge';
import { ChallengesList } from './components/ChallengesList';
import { Code2, Trophy, Flame } from 'lucide-react';

const sampleChallenge = {
  title: "Two Sum",
  difficulty: "Easy" as const,
  description: "Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target.",
  startingCode: `function twoSum(nums, target) {
  // Your code here
}`,
  testCases: [
    "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
    "Input: nums = [3,2,4], target = 6\nOutput: [1,2]",
    "Input: nums = [3,3], target = 6\nOutput: [0,1]"
  ]
};

function App() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Daily Coding Challenges</h1>
          <p className="text-gray-400">Sign in to start solving challenges</p>
        </div>
        <AuthForm />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Code2 className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold">CodeDaily</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="ml-1">7 day streak</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="ml-1">150 points</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<ChallengesList />} />
            <Route path="/challenge/:id" element={<Challenge {...sampleChallenge} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Toaster position="bottom-right" />
    </Router>
  );
}

export default App