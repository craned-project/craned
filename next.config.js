/** @type {import('next').NextConfig} */
console.log(process.env.NEXT_PUBLIC_SMALL_SUPABASE_URL)
const nextConfig = {
  images: {
    domains: [process.env.NEXT_PUBLIC_SMALL_SUPABASE_URL]
  }
}

module.exports = nextConfig
