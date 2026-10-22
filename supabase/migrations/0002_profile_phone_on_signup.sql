-- Sign-up now requires a phone number; the app passes it in user metadata.
-- Copy it onto the profile when the auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    nullif(new.raw_user_meta_data ->> 'phone', '')
  );
  return new;
end;
$$;

-- Backfill accounts created before this change that put a phone in metadata.
update public.profiles p
set phone = nullif(u.raw_user_meta_data ->> 'phone', '')
from auth.users u
where u.id = p.id and p.phone is null and nullif(u.raw_user_meta_data ->> 'phone', '') is not null;
