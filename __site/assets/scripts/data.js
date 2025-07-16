
const data_dir = '/assets/data/'; // Directory where data files are stored
export let data = {};

async function loadData(file) {
    try {
        const response = await fetch(data_dir + file);
        if (!response.ok) {
            throw new Error(`Failed to load data: ${response.statusText}`);
        }
        data = await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

await loadData(data_file);