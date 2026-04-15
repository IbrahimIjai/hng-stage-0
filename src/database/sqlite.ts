import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export type ProfileRecord = {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  sample_size: number;
  age: number;
  age_group: string;
  country_id: string;
  country_probability: number;
  created_at: string;
};

type ProfileFilters = {
  gender?: string;
  country_id?: string;
  age_group?: string;
};

const dataDirectory = join(process.cwd(), '.data');
mkdirSync(dataDirectory, { recursive: true });

const database = new DatabaseSync(join(dataDirectory, 'profiles.sqlite'));

database.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    gender TEXT NOT NULL,
    gender_probability REAL NOT NULL,
    sample_size INTEGER NOT NULL,
    age INTEGER NOT NULL,
    age_group TEXT NOT NULL,
    country_id TEXT NOT NULL,
    country_probability REAL NOT NULL,
    created_at TEXT NOT NULL
  )
`);

export function findProfileByName(name: string): ProfileRecord | null {
  const statement = database.prepare('SELECT * FROM profiles WHERE name = ? LIMIT 1');
  return (statement.get(name) as ProfileRecord | undefined) ?? null;
}

export function findProfileById(id: string): ProfileRecord | null {
  const statement = database.prepare('SELECT * FROM profiles WHERE id = ? LIMIT 1');
  return (statement.get(id) as ProfileRecord | undefined) ?? null;
}

export function insertProfile(profile: ProfileRecord): ProfileRecord {
  const statement = database.prepare(`
    INSERT INTO profiles (
      id,
      name,
      gender,
      gender_probability,
      sample_size,
      age,
      age_group,
      country_id,
      country_probability,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `);

  return statement.get(
    profile.id,
    profile.name,
    profile.gender,
    profile.gender_probability,
    profile.sample_size,
    profile.age,
    profile.age_group,
    profile.country_id,
    profile.country_probability,
    profile.created_at,
  ) as ProfileRecord;
}

export function listProfiles(filters: ProfileFilters): ProfileRecord[] {
  const clauses: string[] = [];
  const values: string[] = [];

  if (filters.gender) {
    clauses.push('LOWER(gender) = LOWER(?)');
    values.push(filters.gender);
  }

  if (filters.country_id) {
    clauses.push('LOWER(country_id) = LOWER(?)');
    values.push(filters.country_id);
  }

  if (filters.age_group) {
    clauses.push('LOWER(age_group) = LOWER(?)');
    values.push(filters.age_group);
  }

  const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  const statement = database.prepare(
    `SELECT * FROM profiles ${whereClause} ORDER BY created_at ASC`,
  );

  return statement.all(...values) as ProfileRecord[];
}

export function deleteProfile(id: string): void {
  const statement = database.prepare('DELETE FROM profiles WHERE id = ?');
  statement.run(id);
}
