const endpoint = "https://api.airtable.com/v0/appHcQU9gd0RCCeJS";
const apikey = "keyZLM4ZzL3PgPQyQ";
const projectsEndpoint = `${endpoint}/Projects?api_key=${apikey}`;
const categoriesEndpoint = `${endpoint}/Categories?api_key=${apikey}`;


const projects = [];


function makeProject(record){
        let name = record.fields["Name"];
        let id = name.trim().toLowerCase().replaceAll(' ','-');
        let category = record.fields["Category"];
        return {
            id: id, 
            name: name,
            category: category,
        }
}

export async function getProjectsData() {
    if (projects.length > 0) { return projects };
    console.log("fetching: " + projectsEndpoint);
    const res = await fetch(projectsEndpoint);
    const data = await res.json();
    console.log(data.records);
    data.records.map((record) => {
        projects.push(makeProject(record))
    });
    console.log(projects)
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