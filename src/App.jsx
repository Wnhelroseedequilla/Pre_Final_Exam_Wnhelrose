import { useState } from 'react'

const initialProducts = [
  {
    id: 1,
    name: 'Wireless Mouse',
    category: 'Accessories',
    description: 'A comfortable wireless mouse for studying, office work, and everyday computer use.',
    specification: 'Wireless, USB receiver, ergonomic design',
    rating: 4.8,
    price: 450,
    quantity: 12,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600',
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    category: 'Accessories',
    description: 'A durable keyboard with responsive keys for typing, studying, and gaming.',
    specification: 'USB connection, mechanical keys, full-size layout',
    rating: 4.7,
    price: 1850,
    quantity: 3,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
  },
  {
    id: 3,
    name: 'Headphones',
    category: 'Audio',
    description: 'Comfortable headphones for music, online classes, and video meetings.',
    specification: 'Over-ear design, cushioned ear pads, wired connection',
    rating: 4.5,
    price: 950,
    quantity: 8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
  },
]

const money = (amount) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount)

const emptyForm = {
  name: '',
  category: '',
  description: '',
  specification: '',
  rating: '',
  price: '',
  quantity: '',
  image: '',
}

function App() {
  const [products, setProducts] = useState(initialProducts)
  const [cart, setCart] = useState([])
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState('products')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [slide, setSlide] = useState(0)
  const [detailQuantity, setDetailQuantity] = useState(1)

  const categories = [
    'All',
    ...new Set(products.map((product) => product.category)),
  ]

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      category === 'All' || product.category === category
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalItems = cart.reduce((sum, item) => sum + item.cartQuantity, 0)

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0
  )

  const productTotal = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  )

  // Update stock quantity helper
  function changeStock(id, amount) {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(0, product.quantity + amount) }
          : product
      )
    )
  }

  const addToCart = (product, quantity = 1) => {
    if (quantity < 1 || quantity > product.quantity) {
      alert('Invalid quantity or insufficient stock.')
      return
    }

    // Deduct from stock immediately
    changeStock(product.id, -quantity)

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      )

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + quantity }
            : item
        )
      }

      return [
        ...currentCart,
        {
          ...product,
          cartQuantity: quantity,
        },
      ]
    })

    alert('Product added to cart!')
  }

  function changeCartQuantity(product, amount) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (!existing) return current

      const nextQty = existing.cartQuantity + amount

      if (nextQty <= 0) {
        // Return stock when removed from cart
        changeStock(product.id, existing.cartQuantity)
        return current.filter((item) => item.id !== product.id)
      }

      if (amount > 0 && nextQty > product.quantity) {
        alert('Not enough stock available.')
        return current
      }

      // Update stock when quantity changes
      changeStock(product.id, -amount)

      return current.map((item) =>
        item.id === product.id ? { ...item, cartQuantity: nextQty } : item
      )
    })
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function addProduct(event) {
    event.preventDefault()

    if (Object.values(form).some((value) => String(value).trim() === '')) {
      setError('Please fill in all fields.')
      return
    }

    const price = Number(form.price)
    const quantity = Number(form.quantity)
    const rating = Number(form.rating)

    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      setError(
        'Enter a price above 0, a whole-number quantity of 0 or more, and a rating from 0 to 5.'
      )
      return
    }

    const newProduct = {
      ...form,
      id: Date.now(),
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      specification: form.specification.trim(),
      image: form.image.trim(),
      price,
      quantity,
      rating,
    }

    setProducts((current) => [...current, newProduct])
    setForm(emptyForm)
    setError('')
    setCategory('All')
    setPage('products')
  }

  function openDetails(product) {
    setSelectedProduct(product)
    setDetailQuantity(1)
    setPage('details')
  }

  function goToProducts() {
    setPage('products')
    setSelectedProduct(null)
  }

  // Stock status helper with styling logic
  function StockBadge({ quantity }) {
    if (quantity === 0) {
      return (
        <span className="inline-block rounded-md bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700">
          Out of Stock
        </span>
      )
    }
    if (quantity < 5) {
      return (
        <span className="inline-block rounded-md bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
          Low Stock
        </span>
      )
    }
    return (
      <span className="inline-block rounded-md bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
        In Stock
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-wrap items-center justify-between gap-4">
          <button onClick={goToProducts} className="text-left">
            <h1 className="text-2xl font-extrabold text-pink-700">
              ProductHub
            </h1>
            <p className="text-sm text-slate-500">
              Product Management System
            </p>
          </button>

          <nav className="flex flex-wrap items-center gap-2">
            <button
              onClick={goToProducts}
              className="rounded-lg px-3 py-2 font-semibold hover:bg-green-50"
            >
              Home
            </button>

            <button
              onClick={() => {
                goToProducts()
                setTimeout(() => {
                  document
                    .getElementById('featured-products')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }, 0)
              }}
              className="rounded-lg px-3 py-2 font-semibold hover:bg-pink-50"
            >
              Featured
            </button>

            <button
              onClick={() => setPage('cart')}
              className="rounded-lg bg-pink-700 px-4 py-2 font-semibold text-white hover:bg-pink-800"
            >
              Cart ({totalItems})
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-8">
        {page === 'products' && (
          <>
            <section className="relative mb-10 overflow-hidden rounded-2xl bg-slate-900">
              <div className="grid min-h-64 items-center md:grid-cols-2">
                <div className="z-10 p-7 text-white md:p-10">
                  <p className="font-semibold uppercase tracking-widest text-pink-300">
                    Welcome to ProductHub
                  </p>
                  <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
                    {[
                      'Find Your Perfect Product',
                      'Discover Our Featured Items',
                      'Quality Products, Great Prices',
                    ][slide]}
                  </h2>
                  <p className="mt-4 text-slate-300">
                    Explore our products, discover new favorites, and shop
                    your essentials in one place.
                  </p>
                  <button
                    onClick={() => {
                      document
                        .getElementById('product-list')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="mt-6 rounded-lg bg-pink-600 px-6 py-3 font-bold text-white hover:bg-pink-700"
                  >
                    Shop Now →
                  </button>
                </div>

                <div className="relative h-56 md:h-full">
                  <img
                    src={[
                      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1000',
                      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000',
                      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000',
                    ][slide]}
                    alt="Featured products"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-transparent" />
                </div>
              </div>

              <div className="absolute bottom-4 left-7 flex gap-2 md:left-10">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => setSlide(index)}
                    aria-label={`Show slide ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      slide === index ? 'w-8 bg-white' : 'w-3 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-pink-700">
                    Handpicked for you
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold">
                    Featured Products
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Click any product to explore its details.
                  </p>
                </div>
                <button
                  onClick={() => {
                    document
                      .getElementById('product-list')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-sm font-bold text-pink-700 hover:underline"
                >
                  View All →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {products.slice(0, 5).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => openDetails(product)}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-28 w-full object-cover sm:h-36"
                    />
                    <div className="p-3">
                      <p className="truncate text-sm font-bold">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {product.category}
                      </p>
                      <p className="mt-2 font-extrabold text-pink-700">
                        {money(product.price)}
                      </p>
                      <div className="mt-2">
                        <StockBadge quantity={product.quantity} />
                      </div>
                      <p className="mt-2 text-xs font-semibold text-slate-500">
                        View Product →
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Products</p>
                <p className="mt-2 text-3xl font-bold">{products.length}</p>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Cart Items</p>
                <p className="mt-2 text-3xl font-bold">{totalItems}</p>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Inventory Value</p>
                <p className="mt-2 text-2xl font-bold text-pink-700">
                  {money(productTotal)}
                </p>
              </div>
            </section>

            <div className="mb-6 flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-bold">Our Products</h2>
                <p className="mt-1 text-slate-500">
                  Search and select a product to see its full details.
                </p>
              </div>

              <div id="product-list" className="mb-6 flex flex-col gap-4"></div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search product name or category..."
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-pink-600 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-pink-600"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item === 'All' ? 'All Categories' : item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <button
                    onClick={() => openDetails(product)}
                    className="block w-full text-left"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-52 w-full object-cover"
                    />
                  </button>

                  <div className="p-5">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-800">
                        {product.category}
                      </span>
                      <span className="text-sm text-amber-600">
                        ★ {product.rating}
                      </span>
                    </div>

                    <button
                      onClick={() => openDetails(product)}
                      className="text-left text-xl font-bold hover:text-pink-700"
                    >
                      {product.name}
                    </button>

                    <p className="mt-2 text-2xl font-extrabold text-pink-700">
                      {money(product.price)}
                    </p>

                    <div className="mt-3">
                      <StockBadge quantity={product.quantity} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openDetails(product)}
                        className="rounded-lg border border-pink-700 px-3 py-3 text-sm font-semibold text-pink-700 hover:bg-pink-50"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.quantity === 0}
                        className="rounded-lg bg-pink-700 px-3 py-3 text-sm font-semibold text-white hover:bg-pink-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {product.quantity === 0
                          ? 'Out of Stock'
                          : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  setForm(emptyForm)
                  setError('')
                  setPage('add')
                }}
                className="rounded-lg bg-pink-700 px-6 py-3 font-semibold text-white hover:bg-pink-800"
              >
                + Add New Product
              </button>
            </div>

            {filteredProducts.length === 0 && (
              <p className="rounded-xl bg-white p-8 text-center text-slate-500">
                No products found in this category.
              </p>
            )}
          </>
        )}

        {page === 'details' && selectedProduct && (
          <section className="mx-auto max-w-4xl">
            <button
              onClick={goToProducts}
              className="mb-6 font-semibold text-pink-700"
            >
              ← Back to Products
            </button>

            <div className="grid overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-2">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="h-full min-h-72 w-full object-cover"
              />

              <div className="p-6 md:p-8">
                <span className="rounded-full bg-pink-50 px-3 py-1 text-sm text-pink-800">
                  {selectedProduct.category}
                </span>
                <h2 className="mt-4 text-3xl font-extrabold">
                  {selectedProduct.name}
                </h2>
                <p className="mt-3 text-3xl font-bold text-pink-700">
                  {money(selectedProduct.price)}
                </p>
                <p className="mt-3 text-amber-600">
                  ★ {selectedProduct.rating} / 5
                </p>

                <h3 className="mt-6 font-bold">Description</h3>
                <p className="mt-2 leading-7 text-slate-600">
                  {selectedProduct.description}
                </p>

                <div className="mt-6">
                  <p className="mb-2 font-semibold">Quantity</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        setDetailQuantity((q) => Math.max(1, q - 1))
                      }
                      disabled={detailQuantity <= 1}
                      className="rounded-lg border px-4 py-2 disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="text-lg font-bold">{detailQuantity}</span>
                    <button
                      onClick={() =>
                        setDetailQuantity((q) =>
                          Math.min(selectedProduct.quantity, q + 1)
                        )
                      }
                      disabled={detailQuantity >= selectedProduct.quantity}
                      className="rounded-lg border px-4 py-2 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>

                <h3 className="mt-5 font-bold">Specifications</h3>
                <p className="mt-2 text-slate-600">
                  {selectedProduct.specification}
                </p>

                <div className="mt-4">
                  <p className="mb-2 font-semibold">Available Stock:</p>
                  <p className="text-xl font-bold">{selectedProduct.quantity}</p>
                  <div className="mt-2">
                    <StockBadge quantity={selectedProduct.quantity} />
                  </div>
                </div>

                <button
                  onClick={() => addToCart(selectedProduct, detailQuantity)}
                  disabled={selectedProduct.quantity === 0}
                  className="mt-6 w-full rounded-lg bg-pink-700 px-5 py-3 font-bold text-white hover:bg-pink-800 disabled:bg-slate-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </section>
        )}

        {page === 'add' && (
          <section className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-extrabold">Add New Product</h2>
            <p className="mb-6 mt-2 text-slate-500">
              Fill in all fields to add a product to your list.
            </p>

            <form
              onSubmit={addProduct}
              className="grid gap-5 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2"
            >
              {[
                {
                  name: 'name',
                  label: 'Product Name',
                  type: 'text',
                  placeholder: 'Enter product name',
                },
                {
                  name: 'category',
                  label: 'Product Category',
                  type: 'text',
                  placeholder: 'e.g. Accessories',
                },
                {
                  name: 'image',
                  label: 'Feature Image URL',
                  type: 'url',
                  placeholder: 'https://example.com/image.jpg',
                },
                {
                  name: 'rating',
                  label: 'Rating (0–5)',
                  type: 'number',
                  placeholder: 'e.g. 4.5',
                },
                {
                  name: 'price',
                  label: 'Price (PHP)',
                  type: 'number',
                  placeholder: 'e.g. 500',
                },
                {
                  name: 'quantity',
                  label: 'Stock Quantity',
                  type: 'number',
                  placeholder: 'e.g. 10',
                },
              ].map((field) => (
                <label key={field.name} className="block">
                  <span className="mb-2 block font-semibold">
                    {field.label}
                  </span>
                  <input
                    required
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleFormChange}
                    placeholder={field.placeholder}
                    min={
                      field.name === 'rating' || field.name === 'quantity'
                        ? 0
                        : field.name === 'price'
                        ? 0.01
                        : undefined
                    }
                    max={field.name === 'rating' ? 5 : undefined}
                    step={
                      field.name === 'rating'
                        ? 0.1
                        : field.name === 'price'
                        ? 0.01
                        : field.name === 'quantity'
                        ? 1
                        : undefined
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100"
                  />
                </label>
              ))}

              <label className="block sm:col-span-2">
                <span className="mb-2 block font-semibold">Description</span>
                <textarea
                  required
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Describe the product"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-pink-600"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block font-semibold">
                  Product Specification
                </span>
                <textarea
                  required
                  name="specification"
                  value={form.specification}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Enter product specifications"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-pink-600"
                />
              </label>

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-pink-700 px-6 py-3 font-bold text-white hover:bg-pink-800"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm(emptyForm)
                    setError('')
                    goToProducts()
                  }}
                  className="rounded-lg border px-6 py-3 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {page === 'cart' && (
          <section>
            <section id="featured-products" className="mb-12"></section>
            <h2 className="text-3xl font-extrabold">Shopping Cart</h2>
            <p className="mb-6 mt-2 text-slate-500">
              Manage your selected products and quantities.
            </p>

            {totalItems === 0 ? (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <p className="text-lg text-slate-500">Your cart is empty.</p>
                <button
                  onClick={goToProducts}
                  className="mt-5 rounded-lg bg-pink-700 px-5 py-3 font-semibold text-white"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-wrap items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                    <div className="min-w-32 flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="mt-1 text-slate-500">
                        {money(item.price)} each
                      </p>
                      <div className="mt-2">
                        <StockBadge quantity={item.quantity} />
                      </div>
                      <p className="mt-2 font-bold text-pink-700">
                        Subtotal: {money(item.price * item.cartQuantity)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => changeCartQuantity(item, -1)}
                        className="h-9 w-9 rounded-lg border"
                        aria-label={`Remove one ${item.name} from cart`}
                      >
                        −
                      </button>
                      <span className="font-bold">{item.cartQuantity}</span>
                      <button
                        onClick={() => changeCartQuantity(item, 1)}
                        disabled={item.cartQuantity >= item.quantity}
                        className="h-9 w-9 rounded-lg border disabled:opacity-30"
                        aria-label={`Add one ${item.name} to cart`}
                      >
                        +
                      </button>
                    </div>
                  </article>
                ))}

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-slate-500">Overall Cart Total</p>
                  <p className="mt-2 text-3xl font-extrabold text-pink-700">
                    {money(cartTotal)}
                  </p>
                  <button
                    onClick={() => setCart([])}
                    className="mt-5 rounded-lg border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="mt-10 border-t bg-white px-5 py-6 text-center text-sm text-slate-500">
        ProductHub · React, useState, and Tailwind CSS
      </footer>
    </div>
  )
}

export default App