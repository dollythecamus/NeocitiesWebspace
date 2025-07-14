
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// biblios -> words, images, meanings, whatever category of thing. object. 
let biblios = {
    // "{biblio}"
    // biblios are words. so any string of characters.
    // doesn't need embued meaning by human language. because we are the ones who give it meaning.
    // we are creating new words, new meanings, new images, new associations.
    "pocmeo" : {
        "_biblio" : "pocmeo", // the biblio itself, the word
        "_id": 0, // unique identifier for the biblio
        "_code_pointer" : undefined, // actual image in png or whatever. a representing of the biblio 
        // { some attribute (in human language) } : { some value (a description of, in human language) } 
        "_attributes": {
            "pronunciation" : "poh-k-meh-oh",
            "sound" : "descriptive a sound",
            "image" : "description of an image",
            "meaning" : "a description of the meaning of the word",
            "secondary-meaning" : "a description of a secondary meaning of the word",
            "texture" : "a description of the texture of the word",
            "color" : "a description of the color of the word",
            "emotion" : "a description of the emotion associated with the word",
            "category" : "a description of the category of the word",
            // anything added by the player as they want.
        }
    },
    "coapos" : {
        "_biblio" : "coapos",
        "_id": 0, // unique identifier for the biblio
        "_code_pointer" : undefined, // actual image in png or whatever. a representing of the biblio 
        "_attributes": {
        }
        // example
        // attributes end up being anything, and added by the player as they want.
    }
}

// stastia -> connections, relationships, links, associations, between each biblios.
let stasias = {
    // "{biblio1}<->{biblio2}" : {}
    "pocmeo-coapos": {
        "relatedness": 10, // 1-255, 
        // 0 = talking about completely different things, 
        // 0.5 = talking about things relating and around the thing, 
        // 1 = talking about the thing itself
        "Agreement" : 255, // 1-255,
        // 0 = disagree completely, 
        // 0.5 = somewhat agree and disagree with parts,
        // 1 = full agreement
        "Sentiment" : 130, // 1-255,
        // 0 = extremely negative, 
        // 0.5 = neutral - nuanced,
        // 1 = extremely positive
        "Operation" : 25 // 1-255,
        // 0 = subtract from / substitute the other,
        // 0.5 = existing neutrally adding to context around the other,
        // 1 = adding to / multiplying with / enforcing the other
    }

}

export let selectedBiblio = null; // currently selected node
export let selectedStasia = null; // currently selected edge

export let currentEdit = null; // currently editing node or edge

// with the connections and relationships, we can create a network of meaning
// and maybe perhaps approaching some new language, but who knows.
// the kind of language this game creates might be described as the language of the mind and completely individual to the player.


function setselectedBiblio(node) {
    if (selectedBiblio !== node) {
        selectedBiblio = node;
        window.dispatchEvent(new CustomEvent('biblioSelected', { detail: { biblio: node } }));
    }
}

function setselectedStasia(edge) {
    if (selectedStasia !== edge) {
        selectedStasia = edge;
        window.dispatchEvent(new CustomEvent('stasiaSelected', { detail: { stasia: edge } }));
    }
}

// Update selectNode and selectEdge to use the setters
function selectBiblio(node) {
    d3.selectAll('.node').classed('selected', false);
    d3.select(`#${node.id}`).classed('selected', true);
    setselectedBiblio(node);
}

function selectStasia(edge) {
    d3.selectAll('.link').classed('selected', false);
    d3.select(`#${edge.key}`).classed('selected', true);
    setselectedStasia(edge);
}

export function updateGraph() {
    // This function can be called to re-render the graph with updated biblios and stasias
    renderGraph();
}

export function addBiblio(biblio) {
    // Add a new biblio to the biblios object
    biblios[biblio.id] = biblio;
    updateGraph();
}

export function addStasia(stasia) {
    // Add a new stasia to the stasias object
    const key = `${stasia.source}-${stasia.target}`;
    stasias[key] = {
        relatedness: stasia.relatedness || 10,
        Agreement: stasia.Agreement || 255,
        Sentiment: stasia.Sentiment || 130,
        Operation: stasia.Operation || 25
    };
    updateGraph();
}

export function editBiblio(id, attributes, to_delete = false) {
    
    if (to_delete) {
        // Delete the biblio if it exists
        if (biblios[id]) {
            delete biblios[id];
            updateGraph();
        } else {
            console.error(`Biblio with id ${id} does not exist.`);
        }
        return;
    }

    // Edit an existing biblio's attributes
    if (biblios[id]) {
        biblios[id]._attributes = { ...biblios[id]._attributes, ...attributes };
        updateGraph();
    } else {
        console.error(`Biblio with id ${id} does not exist.`);
    }
}

export function editStasia(key, properties, to_delete = false) {
    if (to_delete) {
        // Delete the stasia if it exists
        if (stasias[key]) {
            delete stasias[key];
            updateGraph();
        } else {
            console.error(`Stasia with key ${key} does not exist.`);
        }
        return;
    }

    // Edit an existing stasia's properties
    if (stasias[key]) {
        stasias[key] = { ...stasias[key], ...properties };
        updateGraph();
    } else {
        console.error(`Stasia with key ${key} does not exist.`);
    }
}

export function stoppedEditing() {
    selectedBiblio = null; // Clear selected biblio
    selectedStasia = null; // Clear selected stasia
    d3.selectAll('.selected').classed('selected', false); // Remove selection class
    window.dispatchEvent(new CustomEvent('stoppedSelecting', { detail: null }));
}

function drag(simulation) {
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
        stoppedEditing(); // Clear any previous selection when dragging starts
    }
    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }
    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
    return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
}


// --- RENDERING ---
function renderGraph() {
    // Remove old SVG if exists
    d3.select('#biblio-graph').remove();
    // Find the main section
    const main = document.querySelector('main');
    if (!main) return;
    // Create a container div for the graph if not present
    let graphDiv = document.getElementById('biblio-graph-container');
    if (!graphDiv) {
        graphDiv = document.createElement('div');
        graphDiv.id = 'biblio-graph-container';
        main.appendChild(graphDiv);
    }
    // Set up SVG inside the container
    const width = graphDiv.clientWidth || main.clientWidth || 800;
    const height = graphDiv.clientHeight || 400;
    const svg = d3.select(graphDiv)
        .append('svg')
        .attr('id', 'biblio-graph')
        .attr('width', width)
        .attr('height', height)
        .style('display', 'block');

    const nodes = Object.keys(biblios).map(id => ({ id, ...biblios[id] }));
    const links = Object.keys(stasias).map(key => {
        const [source, target] = key.split('-');
        return { source, target, ...stasias[key], key };
    });

    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(180))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
        .attr('stroke', '#aaa')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('class', 'link')
        .on('click', (event, d) => selectStasia(d));

    const node = svg.append('g')
        .attr('stroke', '#fff')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .attr('class', 'node')
        .call(drag(simulation))
        .on('click', (event, d) => selectBiblio(d));

    node.append('circle').attr('r', 32);
    node.append('text').attr('y', 5).attr('text-anchor', 'middle').text(d => d.id);

    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
}

// --- INIT ---
renderGraph();
