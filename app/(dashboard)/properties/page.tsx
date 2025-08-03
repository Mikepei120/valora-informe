import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Edit, FileText } from 'lucide-react'

export default async function PropertiesPage() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: properties, error } = await supabase
    .from('properties')
    .select(`
      id,
      title,
      description,
      price,
      property_type,
      bedrooms,
      bathrooms,
      square_feet,
      address,
      created_at,
      property_images(url, is_primary)
    `)
    .eq('agent_id', user!.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching properties:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">Manage your property portfolio and generate valuation reports.</p>
        </div>
        <Button asChild>
          <Link href="/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {properties?.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => {
            const primaryImage = property.property_images?.find(img => img.is_primary)?.url
            const address = property.address as any

            return (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 relative">
                  {primaryImage ? (
                    <img
                      src={primaryImage}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2">
                    {property.property_type}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="line-clamp-1">{property.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {address?.street}, {address?.city}, {address?.state}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-blue-600">
                      ${property.price?.toLocaleString()}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{property.bedrooms} bed</span>
                      <span>{property.bathrooms} bath</span>
                      <span>{property.square_feet?.toLocaleString()} sqft</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={`/properties/${property.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={`/properties/${property.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button size="sm" asChild className="flex-1">
                        <Link href={`/properties/${property.id}/report`}>
                          <FileText className="mr-2 h-4 w-4" />
                          Report
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No properties yet</h3>
                <p className="text-gray-600">Get started by adding your first property.</p>
              </div>
              <Button asChild>
                <Link href="/properties/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Property
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}