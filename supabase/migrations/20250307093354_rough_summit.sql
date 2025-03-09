/*
  # Fix RLS policies for projects table

  1. Changes
    - Drop existing RLS policy
    - Create new policies for CRUD operations
    - Ensure authenticated users can only access their own projects

  2. Security
    - Enable RLS on projects table
    - Add policies for:
      - Creating new projects (INSERT)
      - Reading own projects (SELECT)
      - Updating own projects (UPDATE)
      - Deleting own projects (DELETE)
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their own projects" ON projects;

-- Create specific policies for each operation
CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);