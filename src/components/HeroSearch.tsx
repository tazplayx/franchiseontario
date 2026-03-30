'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function HeroSearch() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const go = () => {
    const q = query.trim()
    router.push(q ? `/directory?q=${encodeURIComponent(q)}` : '/directory')
  }

  return (
    <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:border-red-200 transition-colors overflow-hidden focus-within:border-red-400 focus-within:shadow-md max-w-xl">
      <div className="flex items-center pl-5 text-gray-400">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && go()}
        placeholder="Search franchises, categories, or brands..."
        className="flex-1 px-4 py-4 text-sm text-gray-700 outline-none bg-transparent"
      />
      <button
        onClick={go}
        className="btn-red m-2 px-6 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap"
      >
        Search
      </button>
    </div>
  )
}
