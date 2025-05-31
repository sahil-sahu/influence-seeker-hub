
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MapPin, Users, TrendingUp, Verified, Search as SearchIcon, Filter, Instagram, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [followerRange, setFollowerRange] = useState([1, 10]);
  const [engagementRange, setEngagementRange] = useState([0, 20]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const categories = ['All Categories', 'Fashion', 'Beauty', 'Tech', 'Fitness', 'Lifestyle', 'Food'];
  const platforms = ['Instagram', 'YouTube', 'TikTok', 'Twitter'];

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
        if (error.code === '23505') {
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

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Discover Creators</h1>
          </div>
          <p className="text-gray-600 mb-6">Find the perfect creators for your brand</p>
          
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Try 'Fitness creators in India with 100k+ followers'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-base py-3"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              size="lg"
              disabled={isLoading}
              className="px-8"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-80 bg-white rounded-lg p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </h3>
              <Button variant="outline" size="sm">
                Apply Filters (3)
              </Button>
            </div>

            <div className="space-y-6">
              {/* Platforms */}
              <div>
                <h4 className="font-medium mb-3">Platforms</h4>
                <div className="space-y-2">
                  {platforms.map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform}
                        checked={selectedPlatforms.includes(platform)}
                        onCheckedChange={() => handlePlatformToggle(platform)}
                      />
                      <label htmlFor={platform} className="text-sm flex items-center gap-2">
                        {platform === 'Instagram' && <Instagram className="h-4 w-4" />}
                        {platform === 'YouTube' && <Youtube className="h-4 w-4" />}
                        {platform}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follower Range */}
              <div>
                <h4 className="font-medium mb-3">Follower Range</h4>
                <div className="px-2">
                  <Slider
                    value={followerRange}
                    onValueChange={setFollowerRange}
                    max={10}
                    min={1}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1K</span>
                    <span>10M</span>
                  </div>
                </div>
              </div>

              {/* Engagement Rate */}
              <div>
                <h4 className="font-medium mb-3">Engagement Rate</h4>
                <div className="px-2">
                  <Slider
                    value={engagementRange}
                    onValueChange={setEngagementRange}
                    max={20}
                    min={0}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="font-medium mb-3">Location</h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <MapPin className="h-4 w-4" />
                      {selectedLocation || 'Select Country'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onClick={() => setSelectedLocation('United States')}>
                      United States
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLocation('India')}>
                      India
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLocation('United Kingdom')}>
                      United Kingdom
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLocation('Canada')}>
                      Canada
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-medium mb-3">Categories</h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      Select Categories
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {categories.slice(1).map((category) => (
                      <DropdownMenuItem key={category}>
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Language */}
              <div>
                <h4 className="font-medium mb-3">Language</h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      Select Language
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedLanguage('English')}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLanguage('Spanish')}>
                      Spanish
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLanguage('French')}>
                      French
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLanguage('German')}>
                      German
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">Search failed. Please try again.</p>
              </div>
            )}

            {/* AI Recommended Creators */}
            {results && results.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">AI Recommended Creators</h2>
                  <Button variant="link" className="text-blue-600">
                    View All →
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {results.slice(0, 4).map((influencer) => (
                    <Card key={influencer.id} className="text-center">
                      <CardHeader className="pb-2">
                        <Avatar className="h-16 w-16 mx-auto mb-2">
                          <AvatarImage src={influencer.avatar_url} alt={influencer.name} />
                          <AvatarFallback>{influencer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg flex items-center justify-center gap-1">
                            {influencer.name}
                            {influencer.verified && <Verified className="h-4 w-4 text-blue-500" />}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{influencer.username}</p>
                        </div>
                        <div className="flex justify-center gap-1 mt-2">
                          {influencer.platforms.includes('Instagram') && <Instagram className="h-4 w-4 text-gray-600" />}
                          {influencer.platforms.includes('YouTube') && <Youtube className="h-4 w-4 text-gray-600" />}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-500">Followers</p>
                            <p className="font-semibold">{formatNumber(influencer.follower_count)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Engagement</p>
                            <p className="font-semibold">{influencer.engagement_rate}%</p>
                          </div>
                        </div>
                        <Button className="w-full" size="sm">
                          View Profile
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Creators */}
            {results && results.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">All Creators</h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Sort by: Most Relevant
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Most Relevant</DropdownMenuItem>
                      <DropdownMenuItem>Highest Engagement</DropdownMenuItem>
                      <DropdownMenuItem>Most Followers</DropdownMenuItem>
                      <DropdownMenuItem>Lowest Price</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {results.slice(4).map((influencer) => (
                    <Card key={influencer.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={influencer.avatar_url} alt={influencer.name} />
                              <AvatarFallback>{influencer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1">
                                <CardTitle className="text-base">{influencer.name}</CardTitle>
                                {influencer.verified && <Verified className="h-3 w-3 text-blue-500" />}
                              </div>
                              <p className="text-xs text-gray-600">{influencer.username}</p>
                              <div className="flex gap-1 mt-1">
                                {influencer.platforms.includes('Instagram') && <Instagram className="h-3 w-3 text-gray-600" />}
                                {influencer.platforms.includes('YouTube') && <Youtube className="h-3 w-3 text-gray-600" />}
                              </div>
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
                      
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {influencer.categories.slice(0, 2).map((category) => (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-gray-500">Followers</p>
                            <p className="font-semibold">{formatNumber(influencer.follower_count)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Engagement</p>
                            <p className="font-semibold">{influencer.engagement_rate}%</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Posts</p>
                            <p className="font-semibold">{influencer.weekly_posts * 4}</p>
                          </div>
                        </div>

                        <Button className="w-full" size="sm" variant="outline">
                          View Profile
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {searchTriggered && results && results.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No influencers found matching your criteria</p>
                <p className="text-gray-500 mt-2">Try adjusting your search query or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
