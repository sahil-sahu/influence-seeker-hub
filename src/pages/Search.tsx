
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MapPin, Users, TrendingUp, Verified, Search as SearchIcon } from 'lucide-react';
import { toast } from 'sonner';

interface InfluencerResult {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar_url: string;
  follower_count: number;
  engagement_rate: number;
  location: string;
  languages: string[];
  platforms: string[];
  categories: string[];
  weekly_posts: number;
  rate_per_post: number;
  verified: boolean;
  relevance_score: number;
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxBudget, setMaxBudget] = useState<number | null>(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['search-influencers', searchQuery, maxBudget],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      const { data, error } = await supabase.rpc('search_influencers_nl', {
        search_query: searchQuery,
        max_budget: maxBudget
      });

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      return data as InfluencerResult[];
    },
    enabled: searchTriggered && !!searchQuery.trim()
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    setSearchTriggered(true);
  };

  const handleFavorite = async (influencerId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please log in to save favorites');
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, influencer_id: influencerId });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('Already in favorites');
        } else {
          throw error;
        }
      } else {
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Favorite error:', error);
      toast.error('Failed to add to favorites');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Perfect Influencers</h1>
          <p className="text-xl text-gray-600">Search using natural language like "top 20 food bloggers with budget 20k"</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="e.g., top 20 food bloggers with budget 20k, fitness influencers in LA, tech reviewers"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg py-3"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Budget per Post ($)
                </label>
                <Input
                  type="number"
                  placeholder="Optional budget limit"
                  value={maxBudget || ''}
                  onChange={(e) => setMaxBudget(e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
              <Button 
                onClick={handleSearch}
                size="lg"
                className="mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Search failed. Please try again.</p>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="mb-4">
            <p className="text-lg text-gray-700">
              Found <span className="font-semibold">{results.length}</span> influencers matching your search
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results?.map((influencer) => (
            <Card key={influencer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={influencer.avatar_url} alt={influencer.name} />
                      <AvatarFallback>{influencer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <CardTitle className="text-lg">{influencer.name}</CardTitle>
                        {influencer.verified && <Verified className="h-4 w-4 text-blue-500" />}
                      </div>
                      <p className="text-sm text-gray-600">{influencer.username}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFavorite(influencer.id)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 line-clamp-2">{influencer.bio}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{formatNumber(influencer.follower_count)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <span>{influencer.engagement_rate}%</span>
                  </div>
                </div>

                {influencer.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{influencer.location}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {influencer.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1">
                  {influencer.platforms.map((platform) => (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-gray-600">Rate per post</span>
                  <span className="font-semibold">${influencer.rate_per_post}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Relevance Score</span>
                  <Badge variant={influencer.relevance_score > 100 ? "default" : "secondary"}>
                    {influencer.relevance_score}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {searchTriggered && results && results.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No influencers found matching your criteria</p>
            <p className="text-gray-500 mt-2">Try adjusting your search query or budget</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
