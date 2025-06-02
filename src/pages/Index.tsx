
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Users, Target, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Perfect Influencers with
            <span className="text-blue-600"> Natural Language</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Search for influencers using everyday language like "top 20 food bloggers with budget 20k" 
            and discover creators that perfectly match your campaign needs.
          </p>
          <Link to="/search">
            <Button size="lg" className="text-lg px-8 py-4">
              <Search className="mr-2 h-5 w-5" />
              Start Searching
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Natural Language Search</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Search using plain English. No complex filters or forms - just describe what you're looking for.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Smart Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our algorithm understands your requirements and ranks influencers by relevance to your campaign.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-purple-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Budget Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Set your budget and find influencers that fit your campaign goals without breaking the bank.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Describe Your Needs</h3>
              <p className="text-gray-600">
                Type what you're looking for in natural language, like "fitness influencers in NYC with 100k followers"
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Smart Results</h3>
              <p className="text-gray-600">
                Our AI analyzes your query and returns ranked results based on relevance and engagement
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Campaign</h3>
              <p className="text-gray-600">
                Save your favorites and reach out to influencers that perfectly match your brand
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Influencers?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of brands already using our platform to connect with top creators
          </p>
          <Link to="/search">
            <Button size="lg" className="text-lg px-8 py-4">
              <Zap className="mr-2 h-5 w-5" />
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
