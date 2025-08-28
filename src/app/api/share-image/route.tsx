import { ImageResponse } from '@vercel/og'

/**
 * Share Image API - Generates personalized OG images for Farcaster Lore sharing
 * 
 * Query Parameters:
 * - sharedby: Farcaster user ID who shared the miniapp
 * 
 * Usage Examples:
 * - Get personalized image: /api/share-image?sharedby=12345
 * - Get fallback image: /api/share-image (no params)
 * 
 * Behavior:
 * 1. Fetches user data from Farcaster API using the sharedby FID
 * 2. Generates personalized image with their PFP, username, and achievement
 * 3. Uses loredark_image as background with Farcaster Lore branding
 * 4. Image is cached for 10 minutes by Vercel
 * 5. FALLBACK: If FID is invalid, API errors occur, or user not found, 
 *    shows generic "Explore casts featured on GM Farcaster" message
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sharedbyFid = searchParams.get('sharedby');
  
  console.log('Query params:', { sharedbyFid });
  
  // Get user data and cast count if we have a FID
  let username: string | null = null;
  let pfpUrl: string | null = null;
  let castCount = 0;
  let hasValidUser = false;
  
  // Type for cast data
  interface CastData {
    author_username: string;
    author_fid?: number;
  }
  
  if (sharedbyFid) {
    try {
      // First, get username from Neynar API
      const neynarResponse = await fetch(
        `https://api.neynar.com/v2/farcaster/user/bulk?fids=${sharedbyFid}`,
        {
          headers: {
            'api_key': process.env.NEYNAR_API_KEY || '',
          }
        }
      );
      
      if (neynarResponse.ok) {
        const neynarData = await neynarResponse.json();
        if (neynarData.users && neynarData.users[0]) {
          username = neynarData.users[0].username;
          pfpUrl = neynarData.users[0].pfp_url;
          hasValidUser = true;
          console.log('Found username for FID', sharedbyFid, ':', username);
          console.log('PFP URL:', pfpUrl);
          
          // Now search for casts by username
          try {
            const castsData = await import('../../../data/casts_index.json');
            castCount = castsData.default.filter((cast: CastData) => 
              cast.author_username === username
            ).length;
            console.log('Cast count for username', username, ':', castCount);
          } catch (castError) {
            console.error('Error loading cast data:', castError);
            // Continue with castCount = 0, but still show user info
          }
        } else {
          console.log('No user found for FID:', sharedbyFid);
        }
      } else {
        console.log('Neynar API error:', neynarResponse.status);
      }
    } catch (error) {
      console.error('Error fetching user data or cast count:', error);
    }
  }
  
  // Log final state for debugging
  console.log('Final image generation state:', {
    sharedbyFid,
    hasValidUser,
    username,
    castCount,
    pfpUrl: pfpUrl ? 'present' : 'missing'
  });
  
  // Generate the image with fallback handling
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          
          color: 'white',
          fontSize: '48px',
          fontWeight: 'bold',
          position: 'relative',
        }}
      >
        {/* Background image overlay */}
        <img
          src="https://lore.gmfarcaster.com/loredark_image.png"
          alt="Background Logo"
          width="1200"
          height="630"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '630px',
            objectFit: 'cover',
            opacity: 1.00,
            pointerEvents: 'none',
          }}
        />
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            zIndex: 10,
            position: 'relative',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: '96px',
              fontWeight: 'bold',
              textAlign: 'center',
              textShadow: '0 6px 16px rgba(0,0,0,0.6)',
            }}
          >
            Farcaster Lore
          </div>
          
          {/* User PFP - only show if we have a valid user */}
          {hasValidUser && pfpUrl && (
            <img
              src={pfpUrl}
              alt="User Profile"
              width="160"
              height="160"
              style={{
                borderRadius: '80px',
                border: '6px solid white',
                boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
              }}
            />
          )}
          
          {/* Achievement Message */}
          <div
            style={{
              fontSize: '48px',
              maxWidth: '900px',
              lineHeight: '1.3',
              textAlign: 'center',
              textShadow: '0 4px 12px rgba(0,0,0,0.6)',
            }}
          >
            {hasValidUser ? (
              castCount === 0 ? `${username} hasn't been mentioned on GM Farcaster yet` :
              `${castCount} of ${username}'s casts have been mentioned on GM Farcaster`
            ) : (
              'Explore casts featured on GM Farcaster'
            )}
          </div>
          
          {/* Call to Action */}
          <div
            style={{
              fontSize: '42px',
              maxWidth: '900px',
              lineHeight: '1.2',
              textAlign: 'center',
              textShadow: '0 4px 12px rgba(0,0,0,0.6)',
              marginTop: '20px',
              fontWeight: 'bold',
            }}
          >
            HAVE YOU BEEN MENTIONED ON FARCASTER&apos;S #1 NEWS SHOW? CHECK NOW!
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate',
        //Browser cache time of 1 hour,  CDN cache of 24 hours, Serve stale content while updating
        'Content-Type': 'image/png',
      },
    }
  );
}
