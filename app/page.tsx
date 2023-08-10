import Image from 'next/image'
import Post from '@/stories/Post'

export default function Home() {
  return (
    <Post name='hello' username='Ee' date='9 Aug 2023' pfp='https://storage.googleapis.com/pai-images/cb1d89d709204f5589e0a6714433c471.jpeg' desc='Hello!' image = 'https://storage.googleapis.com/pai-images/cb1d89d709204f5589e0a6714433c471.jpeg'></Post>
  )
}
