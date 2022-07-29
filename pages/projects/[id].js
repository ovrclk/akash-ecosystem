import { getProjectData, getProjectIDs } from "../../lib/projects";

export async function getStaticPaths() {
    const paths = await getProjectIDs();
    return { paths, fallback: false};
}

export async function getStaticProps({ params }) {
    const prjData = await getProjectData(params.id);
    return { props: { prjData } };
}

export default function Project({ prjData }) {
    return (
        <div className="container mx-auto">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-center">{prjData.name}</h1>
                <div className="flex flex-col items-center justify-center">
                    <img src={prjData.logo_square} alt={prjData.name} className="w-full" />
                    <div className="text-center">
                        <a href={prjData.url} className="text-blue-500 underline">
                            {prjData.url}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}