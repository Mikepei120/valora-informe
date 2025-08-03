import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building, FileText, TrendingUp, Plus, Eye, Download } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get properties count
  const { count: propertiesCount } = await supabase
    .from('properties')
    .select('id', { count: 'exact' })
    .eq('agent_id', user!.id)

  // Get reports count
  const { count: reportsCount } = await supabase
    .from('valuation_reports')
    .select('id', { count: 'exact' })
    .eq('agent_id', user!.id)

  // Get recent properties
  const { data: recentProperties } = await supabase
    .from('properties')
    .select('id, title, price, property_type, created_at')
    .eq('agent_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get recent reports
  const { data: recentReports } = await supabase
    .from('valuation_reports')
    .select(`
      id, 
      title, 
      valuation_estimate, 
      status, 
      created_at,
      properties!inner(title)
    `)
    .eq('agent_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Calculate average property value
  const { data: avgData } = await supabase
    .from('properties')
    .select('price')
    .eq('agent_id', user!.id)

  const avgPrice = avgData?.length 
    ? avgData.reduce((sum, p) => sum + (p.price || 0), 0) / avgData.length 
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your properties and reports.</p>
        </div>
        <Button asChild>
          <Link href="/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            New Property
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertiesCount || 0}</div>
            <p className="text-xs text-muted-foreground">Properties in your portfolio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Valuation reports created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">Average property value</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Properties */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Properties</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/properties">View All</Link>
              </Button>
            </div>
            <CardDescription>Your most recently added properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProperties?.length ? (
                recentProperties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium leading-none">{property.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {property.property_type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          ${property.price?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/properties/${property.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No properties yet. <Link href="/properties/new" className="text-blue-600 hover:underline">Create your first property</Link>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Reports</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/reports">View All</Link>
              </Button>
            </div>
            <CardDescription>Your most recent valuation reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports?.length ? (
                recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium leading-none">{report.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={report.status === 'completed' ? 'default' : 'secondary'}
                        >
                          {report.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          ${report.valuation_estimate?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/reports/${report.id}`}>
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No reports yet. Create a property and generate your first report.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}