import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { getProjectsData } from '../lib/projects';

export async function getStaticProps() {
  const allProjectsData = await getProjectsData();
  return {
    props: { allProjectsData }
  };
}

export default function Home({ allProjectsData }) {
  return (
    <div>
      <Head>
        <title>Akash Network Ecosystem</title>
        <meta name="description" content="Browse and search projects hosted on Akash Network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
                <Image src="/images/akash-red.svg" width="100" height="100"></Image>
              </div>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-7xl">
                Akash Ecosystem
              </p>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                Browse and search projects hosted on Akash Network.
              </p>
            </div>
          </div>
        </div>
        <ul>
          {allProjectsData.map((item) =>
            <li key={item.id}>
              <Link href={`/projects/${item.id}`}>
                <a> {item.name}   ({item.category})
                </a>
              </Link>
            </li>
          )}
        </ul>
      </main>
      <footer>
      </footer>
    </div>
  )
}
