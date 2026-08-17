import Link from 'next/link'
import { products } from '@/data/products'
import { filterProducts } from '@/lib/filter-products'

const PAGE_SIZE = 4

type PageProps = {
  searchParams: Promise<{
    q?: string
    category?: string
    sort?: string
    page?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export default async function ProductsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams

  // ==========================================
  // SEARCH
  // ==========================================

  const query = params.q ?? ''

  // ==========================================
  // CATEGORY VALIDATION
  // ==========================================

  const category =
    params.category === 'office' ||
    params.category === 'tech' ||
    params.category === 'lifestyle'
      ? params.category
      : 'all'

  // ==========================================
  // SORT VALIDATION
  // ==========================================

  const sort =
    params.sort === 'price-asc' ||
    params.sort === 'price-desc'
      ? params.sort
      : 'name'

  // ==========================================
  // PRICE VALIDATION
  // ==========================================

  const parsedMinPrice = Number(params.minPrice)
  const parsedMaxPrice = Number(params.maxPrice)

  const minPrice =
    params.minPrice !== undefined &&
    params.minPrice !== '' &&
    Number.isFinite(parsedMinPrice) &&
    parsedMinPrice >= 0
      ? parsedMinPrice
      : undefined

  const maxPrice =
    params.maxPrice !== undefined &&
    params.maxPrice !== '' &&
    Number.isFinite(parsedMaxPrice) &&
    parsedMaxPrice >= 0
      ? parsedMaxPrice
      : undefined

  // ==========================================
  // PAGE VALIDATION
  // ==========================================

  const requestedPage = Number(params.page ?? '1')

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filtered = filterProducts(products, {
    query,
    category,
    sort,
    minPrice,
    maxPrice,
  })

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE),
  )

  /*
    ป้องกัน

    ?page=-5
    ?page=abc
    ?page=999
  */

  const currentPage = Number.isInteger(requestedPage)
    ? Math.min(
        Math.max(requestedPage, 1),
        totalPages,
      )
    : 1

  const start =
    (currentPage - 1) * PAGE_SIZE

  const visibleProducts = filtered.slice(
    start,
    start + PAGE_SIZE,
  )

  // ==========================================
  // CREATE PAGINATION URL
  // ==========================================

  function pageHref(page: number) {
    const nextParams = new URLSearchParams()

    if (query) {
      nextParams.set('q', query)
    }

    if (category !== 'all') {
      nextParams.set('category', category)
    }

    if (sort !== 'name') {
      nextParams.set('sort', sort)
    }

    if (minPrice !== undefined) {
      nextParams.set(
        'minPrice',
        String(minPrice),
      )
    }

    if (maxPrice !== undefined) {
      nextParams.set(
        'maxPrice',
        String(maxPrice),
      )
    }

    nextParams.set('page', String(page))

    return `/products?${nextParams.toString()}`
  }

  // ==========================================
  // PREVIOUS / NEXT
  // ==========================================

  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <main className="min-h-screen bg-[#0a0a09] px-5 py-10 text-stone-200">
      <div className="mx-auto max-w-6xl">

        {/* ==================================
            HEADER
        ================================== */}

        <header className="mb-10 border-b border-[#3a3028] pb-6">
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center border border-[#5a4838] bg-[#171411] text-2xl">
              ⚠
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d8175]">
                Survival Database
              </p>

              <h1 className="mt-1 text-4xl font-bold uppercase tracking-wider text-[#d8d0c7]">
                Product Finder
              </h1>
            </div>

          </div>

          <p className="mt-4 text-sm leading-6 text-[#8d8175]">
            ค้นหา กรอง เรียง และแบ่งหน้าสินค้า
            <br />

            <span className="text-[#6f665e]">
              FIELD DATABASE // ITEM SEARCH SYSTEM
            </span>
          </p>
        </header>

        {/* ==================================
            FILTER FORM
        ================================== */}

        <section className="relative mb-8 border border-[#40352c] bg-[#151311] shadow-2xl">

          <div className="absolute left-0 top-0 h-[2px] w-full bg-[#7d1d1d]" />

          <div className="p-6">

            <div className="mb-5 flex items-center justify-between border-b border-[#302a25] pb-3">

              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#b5aaa0]">
                Search Parameters
              </h2>

              <span className="text-xs text-[#665d55]">
                SYSTEM READY
              </span>

            </div>

            <form
              action="/products"
              method="get"
              className="grid gap-5 md:grid-cols-4"
            >

              {/* SEARCH */}

              <label className="md:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#8d8175]">
                  Search Item
                </span>

                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Enter item name..."
                  className="w-full border border-[#40372f] bg-[#0c0b0a] px-4 py-3 text-sm text-[#ddd5cd] outline-none placeholder:text-[#514a44] focus:border-[#8b2525] focus:ring-1 focus:ring-[#8b2525]"
                />
              </label>

              {/* CATEGORY */}

              <label>
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#8d8175]">
                  Category
                </span>

                <select
                  name="category"
                  defaultValue={category}
                  className="w-full border border-[#40372f] bg-[#0c0b0a] px-4 py-3 text-sm text-[#ddd5cd] outline-none focus:border-[#8b2525] focus:ring-1 focus:ring-[#8b2525]"
                >
                  <option value="all">
                    All Items
                  </option>

                  <option value="office">
                    Office
                  </option>

                  <option value="tech">
                    Tech
                  </option>

                  <option value="lifestyle">
                    Lifestyle
                  </option>
                </select>
              </label>

              {/* SORT */}

              <label>
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#8d8175]">
                  Sort Order
                </span>

                <select
                  name="sort"
                  defaultValue={sort}
                  className="w-full border border-[#40372f] bg-[#0c0b0a] px-4 py-3 text-sm text-[#ddd5cd] outline-none focus:border-[#8b2525] focus:ring-1 focus:ring-[#8b2525]"
                >
                  <option value="name">
                    Name
                  </option>

                  <option value="price-asc">
                    Price: Low → High
                  </option>

                  <option value="price-desc">
                    Price: High → Low
                  </option>
                </select>
              </label>

              {/* MIN PRICE */}

              <label>
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#8d8175]">
                  Minimum Price
                </span>

                <input
                  type="number"
                  name="minPrice"
                  min="0"
                  defaultValue={
                    minPrice !== undefined
                      ? minPrice
                      : ''
                  }
                  placeholder="0"
                  className="w-full border border-[#40372f] bg-[#0c0b0a] px-4 py-3 text-sm text-[#ddd5cd] outline-none placeholder:text-[#514a44] focus:border-[#8b2525] focus:ring-1 focus:ring-[#8b2525]"
                />
              </label>

              {/* MAX PRICE */}

              <label>
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#8d8175]">
                  Maximum Price
                </span>

                <input
                  type="number"
                  name="maxPrice"
                  min="0"
                  defaultValue={
                    maxPrice !== undefined
                      ? maxPrice
                      : ''
                  }
                  placeholder="99999"
                  className="w-full border border-[#40372f] bg-[#0c0b0a] px-4 py-3 text-sm text-[#ddd5cd] outline-none placeholder:text-[#514a44] focus:border-[#8b2525] focus:ring-1 focus:ring-[#8b2525]"
                />
              </label>

              {/* BUTTONS */}

              <div className="flex gap-3 md:col-span-4">

                <button
                  type="submit"
                  className="border border-[#8b2525] bg-[#641b1b] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#eee5dd] transition hover:bg-[#842323]"
                >
                  Search
                </button>

                <Link
                  href="/products"
                  className="border border-[#40372f] bg-[#211c18] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#a69a90] transition hover:bg-[#2b241f]"
                >
                  Reset
                </Link>

              </div>

            </form>
          </div>
        </section>

        {/* ==================================
            RESULT STATUS
        ================================== */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-[#302a25] py-4">

          <p
            role="status"
            className="text-xs uppercase tracking-wider text-[#81766d]"
          >
            Items Found:{' '}

            <span className="font-bold text-[#c4b8ae]">
              {filtered.length}
            </span>
          </p>

          <p className="text-xs uppercase tracking-wider text-[#81766d]">
            Page{' '}

            <span className="font-bold text-[#c4b8ae]">
              {currentPage}
            </span>

            {' '} / {totalPages}
          </p>

        </div>

        {/* ==================================
            EMPTY STATE
        ================================== */}

        {visibleProducts.length === 0 ? (

          <div className="border border-dashed border-[#4a3d34] bg-[#12100e] p-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#4a3d34] bg-[#1b1714] text-2xl text-[#8b2525]">
              ?
            </div>

            <h2 className="mt-6 text-xl font-bold uppercase tracking-wider text-[#c9c0b8]">
              No Items Found
            </h2>

            <p className="mt-2 text-sm text-[#746b63]">
              ลองเปลี่ยนคำค้นหาหรือช่วงราคา
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block border border-[#8b2525] bg-[#641b1b] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#842323]"
            >
              Return to Database
            </Link>

          </div>

        ) : (

          /* ==================================
              PRODUCT LIST
          ================================== */

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {visibleProducts.map((product) => (

              <li
                key={product.id}
                className="group relative border border-[#3b322b] bg-[#151311] p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:border-[#714039] hover:bg-[#1b1815]"
              >

                <div className="absolute right-4 top-4 text-xs text-[#4d443d]">
                  #{String(product.id).padStart(3, '0')}
                </div>

                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8b2525]">
                  {product.category}
                </p>

                <h2 className="mt-4 pr-8 text-lg font-semibold text-[#d5ccc4] group-hover:text-[#eee5dd]">
                  {product.name}
                </h2>

                <div className="my-5 h-px bg-[#302923]" />

                <p className="text-2xl font-bold text-[#c5b9ae]">
                  ฿{product.price.toLocaleString('th-TH')}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-wider text-[#5f5750]">
                  Current Market Value
                </p>

              </li>

            ))}

          </ul>
        )}

        {/* ==================================
            PAGINATION
        ================================== */}

        <nav
          aria-label="Pagination"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >

          {/* PREVIOUS */}

          {hasPrevious ? (

            <Link
              href={pageHref(currentPage - 1)}
              className="border border-[#40372f] bg-[#151311] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#b0a49a] transition hover:border-[#8b2525] hover:bg-[#211c18] hover:text-white"
            >
              ← Previous
            </Link>

          ) : (

            <span
              aria-disabled="true"
              className="cursor-not-allowed border border-[#29231f] bg-[#0f0e0c] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#403a35]"
            >
              ← Previous
            </span>

          )}

          {/* PAGE NUMBERS */}

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1,
          ).map((page) => (

            <Link
              key={page}
              href={pageHref(page)}
              aria-current={
                page === currentPage
                  ? 'page'
                  : undefined
              }
              className={`min-w-10 border px-4 py-2 text-center text-xs font-bold transition ${
                page === currentPage
                  ? 'border-[#8b2525] bg-[#641b1b] text-[#eee5dd] shadow-[0_0_12px_rgba(139,37,37,0.2)]'
                  : 'border-[#40372f] bg-[#151311] text-[#81766d] hover:border-[#714039] hover:bg-[#211c18] hover:text-[#cfc5bc]'
              }`}
            >
              {page}
            </Link>

          ))}

          {/* NEXT */}

          {hasNext ? (

            <Link
              href={pageHref(currentPage + 1)}
              className="border border-[#40372f] bg-[#151311] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#b0a49a] transition hover:border-[#8b2525] hover:bg-[#211c18] hover:text-white"
            >
              Next →
            </Link>

          ) : (

            <span
              aria-disabled="true"
              className="cursor-not-allowed border border-[#29231f] bg-[#0f0e0c] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#403a35]"
            >
              Next →
            </span>

          )}

        </nav>

        {/* ==================================
            FOOTER
        ================================== */}

        <footer className="mt-12 border-t border-[#302a25] pt-5 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#4f4740]">
            PRODUCT DATABASE // SURVIVAL SYSTEM
          </p>
        </footer>

      </div>
    </main>
  )
}