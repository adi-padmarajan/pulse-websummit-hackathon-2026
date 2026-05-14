
CREATE TABLE public.quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  initial text NOT NULL,
  quest_text text NOT NULL,
  quest_tags text[] NOT NULL DEFAULT '{}',
  time_window_minutes integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  zone text NOT NULL,
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_a_id uuid REFERENCES public.quests(id) ON DELETE CASCADE,
  quest_b_id uuid REFERENCES public.quests(id) ON DELETE CASCADE,
  match_score integer NOT NULL,
  why_explanation text NOT NULL,
  suggested_opener text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read quests" ON public.quests FOR SELECT USING (true);
CREATE POLICY "Public insert quests" ON public.quests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read matches" ON public.matches FOR SELECT USING (true);

ALTER TABLE public.quests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quests;
