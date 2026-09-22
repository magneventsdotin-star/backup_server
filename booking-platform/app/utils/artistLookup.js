import { supabase } from '@database/connection/supabase';

/**
 * Robust artist lookup helper that resolves artist profiles by UUID, name, alias, or slug.
 * Handles space/hyphen mismatches, URL encodings (%20), trailing SEO terms (-live, -band, -singer, etc.),
 * and candidate slug verification.
 */
export async function findArtistBySlugOrId(customSupabase, rawId, selectFields = '*, artist_images(image_url)') {
  const client = customSupabase || supabase;
  if (!rawId) return null;

  let decodedId = '';
  try {
    decodedId = decodeURIComponent(rawId).trim();
  } catch (e) {
    decodedId = String(rawId).trim();
  }

  if (!decodedId) return null;

  const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(decodedId);

  // 1. Direct UUID Lookup
  if (isUUID) {
    const { data } = await client
      .from('artists')
      .select(selectFields)
      .eq('id', decodedId)
      .limit(1)
      .maybeSingle();
    if (data) return data;
  }

  // 2. Prepare normalized target slugs and search strings
  const targetSlug = decodedId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const suffixPattern = /-(live|band|singer|artist|dj|performer|official|musician)$/i;
  const strippedSlug = targetSlug.replace(suffixPattern, '');

  const spaceSearch = decodedId.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  const spaceSearchStripped = spaceSearch.replace(/\s+(live|band|singer|artist|dj|performer|official|musician)$/i, '').trim();

  // Attempt 1: Direct ILIKE match with spaceSearch (is_live: true)
  const { data: directData } = await client
    .from('artists')
    .select(selectFields)
    .eq('is_live', true)
    .or(`alias.ilike.%${spaceSearch}%,name.ilike.%${spaceSearch}%`)
    .limit(1)
    .maybeSingle();

  if (directData) return directData;

  // Attempt 2: ILIKE match with stripped suffix terms (is_live: true)
  if (spaceSearchStripped && spaceSearchStripped !== spaceSearch) {
    const { data: strippedData } = await client
      .from('artists')
      .select(selectFields)
      .eq('is_live', true)
      .or(`alias.ilike.%${spaceSearchStripped}%,name.ilike.%${spaceSearchStripped}%`)
      .limit(1)
      .maybeSingle();

    if (strippedData) return strippedData;
  }

  // Attempt 3: Match candidate live artists by slug generator
  const primaryToken = (spaceSearchStripped || targetSlug).split(/[\s-]/)[0];
  if (primaryToken && primaryToken.length >= 2) {
    const { data: candidates } = await client
      .from('artists')
      .select(selectFields)
      .eq('is_live', true)
      .or(`alias.ilike.%${primaryToken}%,name.ilike.%${primaryToken}%`);

    if (candidates && candidates.length > 0) {
      const slugMatched = candidates.find(artist => {
        const artistName = artist.alias || artist.name || '';
        const artistSlug = artistName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const artistSlugStripped = artistSlug.replace(suffixPattern, '');

        return (
          artistSlug === targetSlug ||
          artistSlug === strippedSlug ||
          artistSlugStripped === strippedSlug ||
          artistSlugStripped === targetSlug
        );
      });

      if (slugMatched) return slugMatched;

      if (candidates.length === 1) return candidates[0];
    }
  }

  // Attempt 4: Fallback search including non-live artists (in case profile is hidden in DB)
  const fallbackTerm = spaceSearchStripped || spaceSearch;
  if (fallbackTerm) {
    const { data: hiddenData } = await client
      .from('artists')
      .select(selectFields)
      .or(`alias.ilike.%${fallbackTerm}%,name.ilike.%${fallbackTerm}%`)
      .limit(1)
      .maybeSingle();

    if (hiddenData) return hiddenData;
  }

  return null;
}
