'use client';

import { EnrichedCast } from '@/lib/types';
import { formatCastDate } from '@/lib/api';
import { useMiniApp } from '@neynar/react';
import { sdk } from '@farcaster/miniapp-sdk';

interface CastCardProps {
  cast: EnrichedCast;
}

export default function CastCard({ cast }: CastCardProps) {
  const { isSDKLoaded, context } = useMiniApp();
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return formatCastDate(dateString);
    } catch {
      return null;
    }
  };

  const truncateText = (text: string | null | undefined, maxLength: number = 200) => {
    if (!text) return null; // Return null for no text, let the component handle display
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const isCastNotFound = () => {
    // Cast is not found if enrichment failed or if there's no text AND no embeds
    return cast.enrichment_status === 'failed' || 
           (!cast.text && (!cast.embeds || cast.embeds.length === 0));
  };

  const getEmbedImage = () => {
    if (!cast.embeds || cast.embeds.length === 0) return null;
    const embed = cast.embeds[0];
    if (embed.metadata?.image) {
      return embed.url;
    }
    if (embed.metadata?.html?.ogImage?.[0]?.url) {
      return embed.metadata.html.ogImage[0].url;
    }
    return null;
  };

  const embedImage = getEmbedImage();
  const formattedDate = formatDate(cast.cast_date);
  const isMiniApp = !!context;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2 px-4 pt-4 cursor-pointer" onClick={() => {
        if (isMiniApp) {
          sdk.actions.viewCast({ hash: cast.cast_hash });
        } else {
          window.open(cast.url, '_blank');
        }
      }}>
        <div className="flex items-center space-x-2">
          {cast.author_pfp && (
            // TODO: Migrate to Next.js <Image /> for optimization
            <img 
              src={cast.author_pfp} 
              alt={`${cast.author_username}'s profile`}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div>
            <p className="font-medium text-gray-900">@{cast.author_username}</p>
            {/* FID removed */}
          </div>
        </div>
        {/* Only show time if known */}
        {formattedDate && (
          <span className="text-xs text-gray-400">{formattedDate}</span>
        )}
      </div>
      
      <div className="p-4 cursor-pointer" onClick={() => {
        if (isMiniApp) {
          sdk.actions.viewCast({ hash: cast.cast_hash });
        } else {
          window.open(cast.url, '_blank');
        }
      }}>
        {isCastNotFound() ? (
          <p className="text-gray-500 text-sm italic mb-3">
            Cast not found
          </p>
        ) : (
          <>
            {truncateText(cast.text) && (
              <p className="text-gray-800 text-sm leading-relaxed mb-3">
                {truncateText(cast.text)}
              </p>
            )}
            
            {embedImage && (
              <div className="mt-3">
                {/* TODO: Migrate to Next.js <Image /> for optimization */}
                <img 
                  src={embedImage} 
                  alt="Embed preview"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
      
      <div 
        className="flex items-center justify-center text-xs text-gray-500 py-2 bg-purple-50 cursor-pointer" 
        onClick={() => {
          if (isMiniApp) {
            sdk.actions.openUrl(`https://www.youtube.com/watch?v=${cast.source_episode_id}`);
          } else {
            window.open(`https://www.youtube.com/watch?v=${cast.source_episode_id}`, '_blank');
          }
        }}
      >
        <span>Mentioned on </span>
        <span className="text-purple-600 font-medium ml-1">
          {cast.show_title.replace('GM Farcaster ', '')}
        </span>
        
      </div>
    </div>
  );
} 