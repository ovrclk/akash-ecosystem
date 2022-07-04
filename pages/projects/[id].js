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
    <h1>{ prjData.name }</h1>
    )
}