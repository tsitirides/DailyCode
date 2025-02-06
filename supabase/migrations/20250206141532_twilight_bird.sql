/*
  # Add completed challenges tracking

  1. New Tables
    - `completed_challenges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `challenge_id` (integer)
      - `completed_at` (timestamp)
      - `code` (text) - stores the successful solution
  
  2. Security
    - Enable RLS on `completed_challenges` table
    - Add policies for users to:
      - Read their own completed challenges
      - Insert new completed challenges
*/

CREATE TABLE IF NOT EXISTS completed_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  challenge_id integer NOT NULL,
  completed_at timestamptz DEFAULT now(),
  code text NOT NULL,
  UNIQUE(user_id, challenge_id)
);

ALTER TABLE completed_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own completed challenges"
  ON completed_challenges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completed challenges"
  ON completed_challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);