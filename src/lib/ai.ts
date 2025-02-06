interface AIResponse {
  message: {
    content: string;
  };
}

export async function generateChallenge(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<{
  title: string;
  description: string;
  startingCode: string;
  testCases: string[];
}> {
  const prompt = `Generate a coding challenge with the following format:
Title: [challenge title]
Difficulty: ${difficulty}
Description: [problem description]
Starting Code: [initial JavaScript function]
Test Cases:
- [test case 1]
- [test case 2]
- [test case 3]

Make sure the challenge is appropriate for ${difficulty.toLowerCase()} difficulty.
The starting code should be a JavaScript function.
Include 3 test cases with input and expected output.
Keep it concise and clear.`;

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-r1:1.5b',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
    });

    const data: AIResponse = await response.json();
    const content = data.message.content;

    // Parse the response
    const title = content.match(/Title: (.*)/)?.[1] || 'Coding Challenge';
    const description = content.match(/Description: ([\s\S]*?)(?=Starting Code:|$)/m)?.[1]?.trim() || '';
    const startingCode = content.match(/Starting Code: ([\s\S]*?)(?=Test Cases:|$)/m)?.[1]?.trim() || '';
    const testCasesMatch = content.match(/Test Cases:[\s\S]*$/m)?.[0] || '';
    const testCases = testCasesMatch
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim());

    return {
      title,
      description,
      startingCode,
      testCases: testCases.length > 0 ? testCases : ['No test cases available'],
    };
  } catch (error) {
    console.error('Failed to generate challenge:', error);
    throw new Error('Failed to generate challenge');
  }
}