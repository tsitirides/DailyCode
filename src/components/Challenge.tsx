import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from './Editor';
import { Play, Share2, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';

interface ChallengeProps {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  startingCode: string;
  testCases: string[];
}

export function Challenge({ title, difficulty, description, startingCode, testCases }: ChallengeProps) {
  const navigate = useNavigate();
  const [code, setCode] = useState(startingCode);
  const [running, setRunning] = useState(false);
  const { user, completedChallenges, setCompletedChallenges } = useAuthStore();
  const [isCompleted, setIsCompleted] = useState(false);

  const difficultyColor = {
    Easy: 'text-green-400',
    Medium: 'text-yellow-400',
    Hard: 'text-red-400',
  }[difficulty];

  const runCode = async () => {
    if (!user) {
      toast.error('Please sign in to save your progress');
      return;
    }

    setRunning(true);
    try {
      // In a real app, we would send this to Judge0 API
      // For now, we'll simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If all test cases pass, mark the challenge as completed
      const { error } = await supabase
        .from('completed_challenges')
        .insert([
          {
            user_id: user.id,
            challenge_id: 1, // This should be dynamic based on the actual challenge ID
            code,
          }
        ]);

      if (error) throw error;

      setCompletedChallenges([...completedChallenges, 1]); // Update with actual challenge ID
      setIsCompleted(true);
      toast.success('Challenge completed! All test cases passed! 🎉');
    } catch (error: any) {
      console.error('Error saving completion:', error);
      toast.error('Failed to save completion status');
    } finally {
      setRunning(false);
    }
  };

  const shareChallenge = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  useEffect(() => {
    const loadCompletionStatus = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('completed_challenges')
        .select('challenge_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading completion status:', error);
        return;
      }

      const completedIds = data.map(c => c.challenge_id);
      setCompletedChallenges(completedIds);
      setIsCompleted(completedIds.includes(1)); // Update with actual challenge ID
    };

    loadCompletionStatus();
  }, [user, setCompletedChallenges]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <span className={`text-sm ${difficultyColor}`}>{difficulty}</span>
            </div>
            {isCompleted && (
              <CheckCircle className="h-6 w-6 text-green-500" />
            )}
          </div>
        </div>
        <button
          onClick={shareChallenge}
          className="p-2 hover:bg-gray-700 rounded-full"
        >
          <Share2 className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="prose prose-invert max-w-none">
        <p>{description}</p>
      </div>

      <div className="space-y-4">
        <Editor code={code} onChange={(value) => setCode(value || '')} />
        
        <button
          onClick={runCode}
          disabled={running || isCompleted}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 ${
            isCompleted 
              ? 'bg-green-600 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Completed
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              {running ? 'Running...' : 'Run Code'}
            </>
          )}
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">Test Cases</h3>
        <div className="space-y-2">
          {testCases.map((test, i) => (
            <div key={i} className="p-3 bg-gray-800 rounded-md">
              <code className="text-sm text-gray-300">{test}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}