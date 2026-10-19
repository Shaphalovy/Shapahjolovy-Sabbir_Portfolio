-- Split projects into two homepage sections: AI Automation and Web Apps.
-- Safe to run on a live database: additive, existing projects stay "automation".

alter table public.projects
  add column if not exists project_type text not null default 'automation'
  check (project_type in ('automation', 'webapp'));

create index if not exists projects_type_idx on public.projects (project_type);

-- Rename the existing section and add a new one right after it.
update public.sections set label = 'Automation Projects' where key = 'projects';

update public.sections set sort_order = sort_order + 1
  where sort_order >= 3 and key <> 'webapps'
  and not exists (select 1 from public.sections where key = 'webapps');

insert into public.sections (key, label, sort_order) values
  ('webapps', 'Web App Projects', 3)
on conflict (key) do nothing;
