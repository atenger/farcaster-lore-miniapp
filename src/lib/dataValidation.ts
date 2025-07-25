import castsIndex from '@/data/casts_index.json';

/**
 * Analyze the cast index for data quality issues
 */
export function analyzeCastIndex() {
  const totalCasts = castsIndex.length;
  const uniqueHashes = new Set(castsIndex.map(cast => cast.cast_hash));
  const uniqueAuthors = new Set(castsIndex.map(cast => cast.author_username));
  const uniqueEpisodes = new Set(castsIndex.map(cast => cast.source_episode_id));
  
  // Find duplicate cast hashes
  const hashCounts = new Map<string, number>();
  castsIndex.forEach(cast => {
    hashCounts.set(cast.cast_hash, (hashCounts.get(cast.cast_hash) || 0) + 1);
  });
  
  const duplicateHashes = Array.from(hashCounts.entries())
    .filter(([hash, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);
  
  // Find casts with duplicate hash + author combinations
  const authorHashCounts = new Map<string, number>();
  castsIndex.forEach(cast => {
    const key = `${cast.cast_hash}-${cast.author_username}`;
    authorHashCounts.set(key, (authorHashCounts.get(key) || 0) + 1);
  });
  
  const duplicateAuthorHashes = Array.from(authorHashCounts.entries())
    .filter(([key, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);
  
  console.log('=== Cast Index Analysis ===');
  console.log(`Total casts: ${totalCasts}`);
  console.log(`Unique cast hashes: ${uniqueHashes.size}`);
  console.log(`Unique authors: ${uniqueAuthors.size}`);
  console.log(`Unique episodes: ${uniqueEpisodes.size}`);
  console.log(`Duplicate cast hashes: ${duplicateHashes.length}`);
  console.log(`Duplicate author+hash combinations: ${duplicateAuthorHashes.length}`);
  
  if (duplicateHashes.length > 0) {
    console.log('\n=== Top 10 Most Duplicated Cast Hashes ===');
    duplicateHashes.slice(0, 10).forEach(([hash, count]) => {
      const casts = castsIndex.filter(cast => cast.cast_hash === hash);
      console.log(`${hash}: ${count} times`);
      casts.forEach(cast => {
        console.log(`  - ${cast.author_username} (${cast.show_date})`);
      });
    });
  }
  
  if (duplicateAuthorHashes.length > 0) {
    console.log('\n=== Top 10 Most Duplicated Author+Hash Combinations ===');
    duplicateAuthorHashes.slice(0, 10).forEach(([key, count]) => {
      const [hash, author] = key.split('-');
      console.log(`${author} - ${hash}: ${count} times`);
    });
  }
  
  return {
    totalCasts,
    uniqueHashes: uniqueHashes.size,
    uniqueAuthors: uniqueAuthors.size,
    uniqueEpisodes: uniqueEpisodes.size,
    duplicateHashes: duplicateHashes.length,
    duplicateAuthorHashes: duplicateAuthorHashes.length,
    duplicateHashDetails: duplicateHashes.slice(0, 10),
    duplicateAuthorHashDetails: duplicateAuthorHashes.slice(0, 10),
  };
}

/**
 * Get detailed information about a specific cast hash
 */
export function getCastHashDetails(castHash: string) {
  const casts = castsIndex.filter(cast => cast.cast_hash === castHash);
  
  if (casts.length === 0) {
    console.log(`No casts found with hash: ${castHash}`);
    return null;
  }
  
  console.log(`\n=== Details for Cast Hash: ${castHash} ===`);
  console.log(`Found ${casts.length} entries:`);
  
  casts.forEach((cast, index) => {
    console.log(`${index + 1}. Author: ${cast.author_username}`);
    console.log(`   Date: ${cast.show_date}`);
    console.log(`   Episode: ${cast.source_episode_id}`);
    console.log(`   Title: ${cast.show_title}`);
    console.log(`   URL: ${cast.url}`);
    console.log('');
  });
  
  return casts;
}

/**
 * Find all casts by a specific author
 */
export function getAuthorCasts(authorUsername: string) {
  const casts = castsIndex.filter(cast => 
    cast.author_username.toLowerCase() === authorUsername.toLowerCase()
  );
  
  console.log(`\n=== Casts by ${authorUsername} ===`);
  console.log(`Found ${casts.length} casts:`);
  
  casts.forEach((cast, index) => {
    console.log(`${index + 1}. Hash: ${cast.cast_hash}`);
    console.log(`   Date: ${cast.show_date}`);
    console.log(`   Episode: ${cast.source_episode_id}`);
    console.log(`   Title: ${cast.show_title}`);
    console.log('');
  });
  
  return casts;
}

// Run analysis if this file is executed directly
if (typeof window === 'undefined') {
  // Only run in Node.js environment
  analyzeCastIndex();
} 