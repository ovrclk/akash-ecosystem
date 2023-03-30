import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { getEcosystemData } from '../lib/projects';

export async function getServerSideProps() {
  const allProjectsData = await getEcosystemData();
  return { props: { allProjectsData }
  };
}

export default function Home({ allProjectsData }) {
  return (
    <div>
      <Head>
        <title>Akash Network Ecosystem</title>
        <meta name="description" content="Browse and search projects hosted on Akash Network" />
        <link rel="icon" href="/favicon.png" />
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="@akashnet_"></meta>
        <meta name="twitter:creator" content="@akashnet_"></meta>
        <meta property="og:image:width" content="1200"></meta>
        <meta property="og:image:height" content="630"></meta>
        <meta property="og:image:alt" content="The Akash Network Ecosystem"></meta>
        <meta property="og:image" content="/images/og-image.png"/>
        <meta property="og:description" content="Browse and search projects hosted on Akash Network."/>
        <meta property="og:site_name" content="The Akash Network Ecosystem"></meta>
        <meta property="og:title" content="The Akash Network Ecosystem"></meta>
      </Head>

      <main className="container mx-auto">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
                <a href="https://akash.network">
                  <Image src="/images/akash-red.svg" width="100" height="100"></Image>
                </a>
              </div>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-7xl">
                Akash Ecosystem
              </p>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                Browse and search projects powered by Akash Network.
              </p>
            </div>
          </div>
        </div>
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allProjectsData.map((item) =>
            <li key={item.slug} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
              <Link href={`/projects/${item.slug}`}>
                <a>
                  <div className="w-full flex items-center justify-left p-6 space-x-6">
                    <img className="w-20 h-20 bg-gray-300 rounded-lg" src={item.logo_square}></img>
                    <div className='className="flex-1 truncate"'>
                      <div className="flex items-left space-x-3">
                        <h3 className="text-gray-900 text-xl font-medium truncate">{item.name}</h3>
                      <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-md font-medium bg-green-100 rounded-full"> {item.category} </span>
                      </div>
                      <p className="mt-1 text-gray-500 text-sm">{item.description}</p>
                    </div>
                  </div>
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
