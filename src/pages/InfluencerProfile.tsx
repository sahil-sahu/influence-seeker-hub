
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, MapPin, Instagram, Youtube, TrendingUp, Users, Heart, MessageCircle, Bookmark, Verified, Award, Shield, Target, Zap } from 'lucide-react';

const InfluencerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: influencer, isLoading } = useQuery({
    queryKey: ['influencer', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('influencers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!influencer) {
    return <div className="flex justify-center items-center min-h-screen">Influencer not found</div>;
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/search')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Discovery
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">Follow Creator</Button>
            <Button>Initiate Outreach</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={influencer.avatar_url} alt={influencer.name} />
                    <AvatarFallback className="text-xl">{influencer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">{influencer.name}</h1>
                      {influencer.verified && <Verified className="h-5 w-5 text-blue-500" />}
                    </div>
                    <p className="text-gray-600 mb-2">@{influencer.username}</p>
                    
                    {/* Platform Stats */}
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-1">
                        <Instagram className="h-4 w-4" />
                        <span className="font-semibold">{formatNumber(influencer.follower_count)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Youtube className="h-4 w-4" />
                        <span className="font-semibold">156K</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-semibold">425K</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{influencer.location}</span>
                      </div>
                      <span>English, Spanish</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mt-4">{influencer.bio}</p>

                <div className="flex gap-2 mt-4">
                  {influencer.categories.map((category) => (
                    <Badge key={category} variant="secondary">{category}</Badge>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <Instagram className="h-5 w-5 text-gray-600" />
                  <Youtube className="h-5 w-5 text-gray-600" />
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Followers</p>
                    <p className="text-2xl font-bold">{formatNumber(influencer.follower_count)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
                    <p className="text-2xl font-bold">{influencer.engagement_rate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Weekly Posts</p>
                    <p className="text-2xl font-bold">{influencer.weekly_posts}-15</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brand Collaborations */}
            <Card>
              <CardHeader>
                <CardTitle>Brand Collaborations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-100 rounded-lg p-4 text-center">
                    <span className="font-semibold text-blue-800">Brand 1</span>
                  </div>
                  <div className="bg-blue-600 text-white rounded-lg p-4 text-center">
                    <span className="font-semibold">Brand 2</span>
                  </div>
                  <div className="bg-blue-800 text-white rounded-lg p-4 text-center">
                    <span className="font-semibold">Brand 3</span>
                  </div>
                  <div className="bg-blue-500 text-white rounded-lg p-4 text-center">
                    <span className="font-semibold">Brand 4</span>
                  </div>
                </div>
                <Button variant="link" className="text-blue-600 p-0">
                  View All Collaborations
                </Button>
              </CardContent>
            </Card>

            {/* Top Performing Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((post) => (
                    <div key={post} className="relative">
                      <div className="aspect-square bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg"></div>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs rounded px-2 py-1">
                        <Instagram className="h-3 w-3 inline mr-1" />
                        2.1M views
                      </div>
                      <p className="text-xs text-gray-600 mt-1">2 days ago</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievement Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Achievement Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Top 1% Fitness Creator</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 rounded-lg p-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Verified Partner</span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-50 rounded-lg p-3">
                    <Target className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">AI Recommended</span>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-50 rounded-lg p-3">
                    <Zap className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium">High Engagement Rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Analytics */}
          <div className="space-y-6">
            {/* Audience Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Gender Distribution</h4>
                  <div className="relative h-32 w-32 mx-auto">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-red-300 to-teal-300"></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Age Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>18-24</span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>25-34</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>35-44</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>45+</span>
                      <span>5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">United States</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">United Kingdom</span>
                    <span className="font-semibold">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Canada</span>
                    <span className="font-semibold">12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Australia</span>
                    <span className="font-semibold">8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Views</p>
                    <p className="text-xl font-bold">125K</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg. Likes</p>
                    <p className="text-xl font-bold">15.2K</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg. Comments</p>
                    <p className="text-xl font-bold">342</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg. Saves</p>
                    <p className="text-xl font-bold">2.1K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;
