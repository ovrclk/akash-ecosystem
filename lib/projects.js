import { useState } from "react";
const ecosystemEndpoint = "http://feeds.akash.network/ecosystem";

export async function getEcosystemData() {
    let response = await fetch(ecosystemEndpoint);
    let data = await response.json();
    if (data && data["projects"].length > 0) {
        return data["projects"]
    }
}


export async function getProjectIDs() {
    const dat = await getEcosystemData();
    return dat.map((item) => {
        return {
            params: {
                id: item.slug,
            },
        };
    });
}

export async function getProjectData(slug) {
    const dat = await getEcosystemData();
    let result = "";
    dat.map((project) => {
        if (project.slug === slug) {
            result = project
            return
        }
    });
    console.log("fetching project: " + result.name)
    return result;
}
