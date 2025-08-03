import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, FileText, Bot, Download } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Real Estate 
            <span className="text-blue-600"> Valuations</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Generate professional property valuation reports with artificial intelligence. 
            Create detailed market analyses, property descriptions, and PDF reports in minutes.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/auth/login">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for Professional Valuations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform combines property management, AI content generation, and professional reporting 
            to streamline your valuation workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Property Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Complete property database with images, details, and comprehensive information management.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">AI Content Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Generate professional descriptions, market analysis, and executive summaries with AI.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Professional Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Create stunning PDF valuation reports with your branding and professional formatting.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Instant Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Generate and download professional PDF reports instantly, ready to share with clients.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Valuations?</h2>
          <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
            Join real estate professionals who are already using AI to create better, 
            faster property valuations.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/auth/login">Start Free Trial</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}