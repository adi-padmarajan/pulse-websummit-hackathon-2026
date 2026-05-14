
ALTER TABLE public.quests
  ADD COLUMN is_viewer boolean NOT NULL DEFAULT false,
  ADD COLUMN role text NOT NULL DEFAULT '',
  ADD COLUMN company text NOT NULL DEFAULT '',
  ADD COLUMN interests text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN bio text NOT NULL DEFAULT '';

-- Demo shortcut: in production, the "viewer" would be derived from the
-- authenticated user (auth.uid()), not stored as a flag on the quests row.
-- Only one row should have is_viewer=true at a time for the demo.
CREATE UNIQUE INDEX quests_single_viewer_idx
  ON public.quests ((is_viewer)) WHERE is_viewer = true;
