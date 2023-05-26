import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { searchLectures } from '@/boundaries/supabase';
import { searchQuerySchema } from '@/schema/searchQuery';

const querySchema = z.string().default('{}');

export const handler: NextApiHandler = async (req, res) => {
  const { q: query } = req.query;

  const parsedQuery = querySchema.safeParse(query);
  if (!parsedQuery.success) {
    res.status(400).end();
    return;
  }

  const searchQuery = searchQuerySchema.safeParse(JSON.parse(parsedQuery.data));
  if (!searchQuery.success) {
    res.status(400).end();
    return;
  }

  const response = await searchLectures(searchQuery.data);

  if (response === undefined) {
    res.status(500).end();
    return;
  }

  res.status(200).json(response);
};
