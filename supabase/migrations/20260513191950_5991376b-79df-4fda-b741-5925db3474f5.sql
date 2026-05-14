
ALTER TABLE public.quests
  ADD COLUMN IF NOT EXISTS just_attended text,
  ADD COLUMN IF NOT EXISTS free_until text,
  ADD COLUMN IF NOT EXISTS conversation_goal text,
  ADD COLUMN IF NOT EXISTS context_type text,
  ADD COLUMN IF NOT EXISTS current_situation text;

ALTER TABLE public.quests
  DROP CONSTRAINT IF EXISTS quests_context_type_check;

ALTER TABLE public.quests
  ADD CONSTRAINT quests_context_type_check
  CHECK (context_type IS NULL OR context_type IN ('session', 'topic', 'situation'));
