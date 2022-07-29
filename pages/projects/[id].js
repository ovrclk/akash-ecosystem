import { getProjectData, getProjectIDs } from "../../lib/projects";
import Head  from 'next/head';
import Link from 'next/link';
import { ExternalLinkIcon, ArrowSmLeftIcon } from '@heroicons/react/solid'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'

export async function getStaticPaths() {
    const paths = await getProjectIDs();
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const prjData = await getProjectData(params.id);
    return { props: { prjData } };
}

export function TwitterButton({ prjData }) {
    if (prjData.twitter != "") {
        return (
            <a href={`https://twitter.com/${prjData.twitter}`} target="_blank" rel="noreferrer">
                <button type="button" className="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                    <svg width="20" height="20" fill="currentColor" className="-ml-1 mr-2 h-5 w-5"><path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path></svg>
                    <span>@{prjData.twitter}</span>
                </button>
            </a>
        )
    }
}

export function HomepageButton({ prjData }) {
    return (
        <a href={prjData.homepage} target="_blank" rel="noreferrer">
            <button type="button" className="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                <ExternalLinkIcon className="-ml-1 mr-2 h-5 w-5"></ExternalLinkIcon>
                <span>Homepage</span>
            </button>
        </a>
    )
}

export function BackButton() {
    return (
            <Link href="/">
                
            <button type="button" className="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                <ArrowSmLeftIcon className="-ml-1 mr-2 h-5 w-5"></ArrowSmLeftIcon>
                <span>Back</span>
            </button>
            </Link>
    )
}


export default function Project({ prjData }) {
    return (
        <div>
            <Head>
                <title>Akash Network Ecosystem | {prjData.name}</title>
                <meta name="description" content="Browse and search projects hosted on Akash Network" />
                <link rel="icon" href="/favicon.png" />
                <meta name="twitter:card" content="summary_large_image"></meta>
                <meta name="twitter:site" content="@akashnet_"></meta>
                <meta name="twitter:creator" content="@akashnet_"></meta>
                <meta property="og:image:width" content="1200"></meta>
                <meta property="og:image:height" content="630"></meta>
                <meta property="og:image:alt" content="The Akash Network Ecosystem"></meta>
                <meta property="og:image" content="/images/og-image.png" />
                <meta property="og:description" content="Browse and search projects hosted on Akash Network." />
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
                            <p className="pt-12">
                                <BackButton></BackButton>
                            </p>

                            <div className="flex flex-col items-center justify-center pt-12">
                                <img className="w-40 h-40 bg-gray-300 rounded-lg" src={prjData.logo_square}></img>
                                <p className="text-gray-900 text-4xl font-medium truncate py-8">{prjData.name}</p>
                            </div>
                            <div className="flex items-center justify-center space-x-4">
                                <TwitterButton prjData={prjData}></TwitterButton>
                                <HomepageButton prjData={prjData}></HomepageButton>
                            </div>
                            <div className="flex items-center justify-center pt-8">
                                <article className="prose prose-slate">
                                    <ReactMarkdown linkTarget="_blank">{prjData.description}</ReactMarkdown>
                                </article>
                            </div>
                            <div className="flex items-center justify-center pt-8">
                                <article className="prose prose-slate">
                                    <ReactMarkdown linkTarget="_blank">{prjData.notes}</ReactMarkdown>
                                </article>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white">
                    <div> </div>
                </div>
            </main>
        </div>
    );
}