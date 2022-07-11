import { useState } from "react";
import  cacheData from "memory-cache";

const endpoint = "https://api.airtable.com/v0/appHcQU9gd0RCCeJS";
const apikey = "keyZLM4ZzL3PgPQyQ"; // Readonly Key as Artable lacks support for public APIs. Dont get cute ideas.

const projectsEndpoint = `${endpoint}/Projects?api_key=${apikey}`;
const tweetsEndpoint = `${endpoint}/Tweets?api_key=${apikey}`;
const videosEndpoint = `${endpoint}/Videos?api_key=${apikey}`;


function makeProject(record) {
    let name = record.fields["Name"];
    let id = name.trim().toLowerCase().replaceAll(' ', '-');
    let category = record.fields["Category"];
    let description = record.fields["Description"];
    let logo_square = `https://picsum.photos/seed/${category}/400/400`;

    if (record.fields["Logo Square"].length > 0 ) {
        logo_square = record.fields["Logo Square"][0].url;
    }

    return {
        id: id,
        name: name,
        category: category,
        logo_square: logo_square,
        description: description,
    }
}

export async function getProjectsData() {
    var projects = cacheData.get("projects");
    if (projects == undefined) {
        console.log("projects is null")
        projects = [];
    }
    console.log("projects.length: ", projects.length)

    if (projects.length > 0) { return projects };
    console.log("fetching: " + projectsEndpoint);
    const res = await fetch(projectsEndpoint);
    const data = await res.json();
    //console.log(data.records);
    data.records.map((record) => {
        projects.push(makeProject(record))
    });
    //console.log(projects)
    cacheData.put("projects", projects);
    return projects;
}

export async function getProjectIDs() {
    const dat = await getProjectsData();
    return dat.map((item) => {
        return {
            params: {
                id: item.id,
            },
        };
    });
}

export async function getProjectData(id) {
    const dat = await getProjectsData();
    let result = "";
    dat.map((item) => {
        if (item.id === id) {
            result = item
            return
        }
    });
    console.log("getting project: " + result.name)
    return result;
}