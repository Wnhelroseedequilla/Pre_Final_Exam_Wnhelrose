
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
  const [cart, setCart] = useState({})
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState('products')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  

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

  

  const totalItems = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  )

  const cartTotal = products.reduce(
    (sum, product) =>
      sum + product.price * (cart[product.id] || 0),
    0
  )

  const productTotal = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  )



  function changeStock(id, amount) {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: Math.max(0, product.quantity + amount),
            }
          : product
      )
    )
  }

  function addToCart(product) {
    if (product.quantity < 1) return

    setCart((current) => {
      const inCart = current[product.id] || 0

      if (inCart >= product.quantity) return current

      return {
        ...current,
        [product.id]: inCart + 1,
      }
    })
  }

  function changeCartQuantity(product, amount) {
    setCart((current) => {
      const next = (current[product.id] || 0) + amount

      if (next <= 0) {
        const updated = { ...current }
        delete updated[product.id]
        return updated
      }

      if (next > product.quantity) return current

      return { ...current, [product.id]: next }
    })
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function addProduct(event) {
    event.preventDefault()

    if (
      Object.values(form).some(
        (value) => String(value).trim() === ''
      )
    ) {
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
    setPage('details')
  }

  function goToProducts() {
    setPage('products')
    setSelectedProduct(null)
  }

  function stockLabel(quantity) {
    if (quantity === 0) return 'Out of Stock'
    if (quantity < 5) return 'Low Stock'
    return 'In Stock'
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

          <nav className="flex flex-wrap gap-2">
            <button
              onClick={goToProducts}
              className="rounded-lg px-4 py-2 font-semibold hover:bg-pink-50"
            >
              Products
            </button>
            <button
              onClick={() => setPage('add')}
              className="rounded-lg px-4 py-2 font-semibold hover:bg-pi-50"
            >
              + Add Product
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
       

            <section className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Products</p>
                <p className="mt-2 text-3xl font-bold">
                  {products.length}
                </p>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Cart Items</p>
                <p className="mt-2 text-3xl font-bold">{totalItems}</p>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Inventory Value
                </p>
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

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm text-slate-500">
                          Stock Quantity
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={() => changeStock(product.id, -1)}
                            disabled={product.quantity === 0}
                            className="h-8 w-8 rounded-lg border disabled:opacity-30"
                            aria-label={`Remove one ${product.name} from stock`}
                          >
                            −
                          </button>
                          <span className="min-w-5 text-center font-bold">
                            {product.quantity}
                          </span>
                          <button
                            onClick={() => changeStock(product.id, 1)}
                            className="h-8 w-8 rounded-lg border"
                            aria-label={`Add one ${product.name} to stock`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          product.quantity < 5
                            ? 'bg-red-100 text-red-700'
                            : 'bg-pink-100 text-pink-700'
                        }`}
                      >
                        {stockLabel(product.quantity)}
                      </span>
                    </div>

                    <div className="mt-4 rounded-lg bg-slate-50 p-3">
                      <p className="text-sm text-slate-500">Subtotal</p>
                      <p className="font-bold">
                        {money(product.price * product.quantity)}
                      </p>
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
                        disabled={
                          product.quantity === 0 ||
                          (cart[product.id] || 0) >= product.quantity
                        }
                        className="rounded-lg bg-pink-700 px-3 py-3 text-sm font-semibold text-white hover:bg-pink-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {product.quantity === 0
                          ? 'Out of Stock'
                          : (cart[product.id] || 0) >= product.quantity
                            ? 'Stock Limit'
                            : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <p className="rounded-xl bg-white p-8 text-center text-slate-500">
                No products found in this category.
              </p>
            )}

            <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold">Total Inventory Value</h3>
              <p className="mt-2 text-sm text-slate-500">
                Sum of all product prices multiplied by their stock quantities.
              </p>
              <p className="mt-3 text-3xl font-extrabold text-pink-700">
                {money(productTotal)}
              </p>
            </section>
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

                <h3 className="mt-5 font-bold">Specifications</h3>
                <p className="mt-2 text-slate-600">
                  {selectedProduct.specification}
                </p>

                <p className="mt-5">
                  <span className="font-semibold">Available stock: </span>
                  {selectedProduct.quantity}
                </p>

                <p className={`mt-2 font-semibold ${
                  selectedProduct.quantity < 5
                    ? 'text-red-600'
                    : 'text-pink-700'
                }`}>
                  {stockLabel(selectedProduct.quantity)}
                </p>

                <button
                  onClick={() => addToCart(selectedProduct)}
                  disabled={
                    selectedProduct.quantity === 0 ||
                    (cart[selectedProduct.id] || 0) >= selectedProduct.quantity
                  }
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
                      field.name === 'rating' ||
                      field.name === 'quantity'
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
                <span className="mb-2 block font-semibold">
                  Description
                </span>
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
            <h2 className="text-3xl font-extrabold">Shopping Cart</h2>
            <p className="mb-6 mt-2 text-slate-500">
              Manage your selected products and quantities.
            </p>

            {totalItems === 0 ? (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <p className="text-lg text-slate-500">
                  Your cart is empty.
                </p>
                <button
                  onClick={goToProducts}
                  className="mt-5 rounded-lg bg-pink-700 px-5 py-3 font-semibold text-white"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {products
                  .filter((product) => cart[product.id] > 0)
                  .map((product) => (
                    <article
                      key={product.id}
                      className="flex flex-wrap items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-24 w-24 rounded-lg object-cover"
                      />

                      <div className="min-w-32 flex-1">
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="mt-1 text-slate-500">
                          {money(product.price)} each
                        </p>
                        <p className="mt-2 font-bold text-pink-700">
                          Subtotal: {money(
                            product.price * cart[product.id]
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => changeCartQuantity(product, -1)}
                          className="h-9 w-9 rounded-lg border"
                          aria-label={`Remove one ${product.name} from cart`}
                        >
                          −
                        </button>
                        <span className="font-bold">
                          {cart[product.id]}
                        </span>
                        <button
                          onClick={() => changeCartQuantity(product, 1)}
                          disabled={cart[product.id] >= product.quantity}
                          className="h-9 w-9 rounded-lg border disabled:opacity-30"
                          aria-label={`Add one ${product.name} to cart`}
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
                    onClick={() => setCart({})}
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
