import type { Product } from '@/data/products'

export type ProductFilters = {
  query: string
  category: string
  sort: 'name' | 'price-asc' | 'price-desc'
  minPrice?: number
  maxPrice?: number
}

export function filterProducts(
  products: Product[],
  filters: ProductFilters,
) {
  const query = filters.query.trim().toLowerCase()

  return products
    .filter((product) => {
      // ค้นหาจากชื่อ
      const matchesQuery = product.name
        .toLowerCase()
        .includes(query)

      // กรองหมวดหมู่
      const matchesCategory =
        filters.category === 'all' ||
        product.category === filters.category

      // กรองราคาต่ำสุด
      const matchesMinPrice =
        filters.minPrice === undefined ||
        product.price >= filters.minPrice

      // กรองราคาสูงสุด
      const matchesMaxPrice =
        filters.maxPrice === undefined ||
        product.price <= filters.maxPrice

      return (
        matchesQuery &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice
      )
    })
    .toSorted((a, b) => {
      if (filters.sort === 'price-asc') {
        return a.price - b.price
      }

      if (filters.sort === 'price-desc') {
        return b.price - a.price
      }

      return a.name.localeCompare(b.name)
    })
}