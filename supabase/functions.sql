
-- Function to decrement user credits
CREATE OR REPLACE FUNCTION public.decrement_user_credits(amount INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_credits
  SET credits = GREATEST(0, credits - amount),
      last_updated = now()
  WHERE user_id = auth.uid();
END;
$$;
