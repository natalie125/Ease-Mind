import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactFamilyTree from "react-family-tree";
import { FamilyNode } from "./FamilyNode";
import { NodeDetails } from "./NodeDetails";
import { NODE_WIDTH, NODE_HEIGHT } from "./const";
import { getNodeStyle } from "./utils";

import "./Canopy.css"

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

// methods for updating data in the Flask app
// update information in the tree table
function putTree(url_input, tree_data) {
	axios.put(url_input, null, {params: tree_data})
	.then(function (response) {
		// console.log(response.data)
	})
	.catch(function (error) {
		// console.log(error);
	}) 
}

// methods for deleting data in the Flask app
// delete a tree record
function deleteTree(url_input, tree_data) {
	axios.delete(url_input, {params: tree_data})
	.then(function (response) {
		// console.log(response.data)
	})
	.catch(function (error) {
		// console.log(error);
	}) 
}

// recalculate fh conditions for this tree
function refreshTree(url_input, tree_data) {
	axios.get(url_input, {params: tree_data})
	.then(function (response) {
		if(response.data != "None") {
			alert(response.data);
		}
	})
	.catch(function (error) {
		// console.log(error);
	}) 
}

function EditNode(props) {
	const navigate = useNavigate();
	const location = useLocation();

	// state definitions
	const [id, setID] = useState(location.state?.id);
	const [name, setName] = useState("Tree's Name");
	const [owner, setOwner] = useState("Tree's Owner");
	const [new_name, setNewName] = useState("Tree's New Name");
	const [json_data, setJSONData] = useState({});
	const [owned_nodes, setOwnedNodes] = useState({ids:[], names:[], dobs:[], ethnicities:[], conditions:[]});
	const [loading, setLoading] = useState(true);

	const [tree_nodes, setTreeNodes] = useState([]);
	const [rootId, setRootId] = useState(undefined);
	const [selectId, setSelectId] = useState(undefined);
	const [hoverId, setHoverId] = useState(undefined);
  
	const selected = useMemo(() => tree_nodes.find((item) => item.id === selectId), [
	  tree_nodes,
	  selectId
	]);

	// get data from the tree table
	const getTree = async (url_input, tree_data) => {
		const {data} = await axios.get(url_input, {params: tree_data});
		// alert(JSON.stringify(data));
		setJSONData(data);
		setName(data.names[0]);
		setNewName(data.names[0]);
		setOwner(data.owners[0]);
	}

	// get data of the tree's nodes
	const getTreeNodes = async (url_input, tree_data) => {
		const {data} = await axios.get(url_input, {params: tree_data});

		console.log("returned data");
		console.log(data);

		console.log("set owned nodes");
		setOwnedNodes(data);
		console.log(owned_nodes);

		if(data.ids.length == 0) {
			// console.log("break out of getTreeNodes");
			setLoading(false);
			return;
		}
		let new_tree_nodes = [];
		// for each node in the above data, we want to get it's parents and children
		for(let i = 0; i < data.ids.length; i++) {
			const children_get = await axios.get(BASEURL + "canopy/parent_children/prod", {params: {id: data.ids[i]}});
			// console.log("patient " + data.ids[i] + "'s children");
			// console.log(children_get.data);
			let children_array = []
			for(let j = 0; j < children_get.data.names.length; j++) {
				children_array.push({id: children_get.data.names[j], type: "blood"});
			}
			// console.log(children_array);
			const parents_get = await axios.get(BASEURL + "canopy/child_parents/prod", {params: {id: data.ids[i]}});
			// console.log("patient " + data.ids[i] + "'s parents");
			// console.log(parents_get.data);
			let parents_array = []
			for(let j = 0; j < parents_get.data.names.length; j++) {
				parents_array.push({id: parents_get.data.names[j], type: "blood"});
			}
			// console.log(parents_array);
			const spouses_get = await axios.get(BASEURL + "canopy/patient_spouses/prod", {params: {id: data.ids[i]}});
			// console.log("patient " + data.ids[i] + "'s spouses");
			// console.log(spouses_get.data);
			let spouses_array = []
			for(let j = 0; j < spouses_get.data.names.length; j++) {
				spouses_array.push({id: spouses_get.data.names[j], type: "married"});
			}
			// console.log(spouses_array);
			const family_node = {
				"id": data.names[i],
				"dob": data.dobs[i],
				"gender": data.genders[i],
				"spouses": spouses_array,
				"siblings": [],
				"parents": parents_array,
				"children": children_array
			}
			// console.log(family_node);
			new_tree_nodes.push(family_node);
		}
		console.log("family tree nodes: ");
		console.log(new_tree_nodes);
		setRootId(new_tree_nodes[0].id);
		setTreeNodes(new_tree_nodes);

		console.log("change loading to false: ");
		setLoading(false);
		console.log(loading);
	}

	// function for generating a table from the JSON response
	const generateTable = (response) => {
		let table = []
		let rows = []
		
		// Outer loop to create rows (one row for each id + 1 for the headers)
		for (let i = -1; i < response.ids.length; i++) {
			let columns = []

			// Inner loop to create columns (one column for each unique key in the table)
			for (let j = -1; j <= Object.keys(response).length; j++) {
				// if we're on the first row (headers)
				if(i == -1) {
					if(j == -1) {
						// we're on the first column
						columns.push(<td>{"IDs"}</td>)
					}
					else if(j < Object.keys(response).length) {
						if(Object.keys(response)[j] != "ids") {
							columns.push(<td>{Object.keys(response)[j]}</td>)
						}
					}
					else {
						// on the last column, empty cell
						columns.push(<td></td>)
					}
				}
				else {
					if(j == -1) {
						// we're on the first column
						columns.push(<td>{response.ids[i]}</td>)
					}
					else if(j < Object.keys(response).length) {
						// we're not on the first or last column
						if(Object.keys(response)[j] != "ids") {
							columns.push(<td>{response[Object.keys(response)[j]][i]}</td>)
						}
					}
					else {
						columns.push(<td>
										<Link to='/canopy/canopy_edit_node/' 
										state={{ id: response.ids[i], tree_id: location.state?.id }}>
													<button> Edit </button>
										</Link>
									</td>)
					}
				}
			}

			// Create the parent and add the children
			rows.push(<tr>{columns}</tr>)
		}

		table.push(<tbody>{rows}</tbody>)

		return table
	}

	useEffect(() => {
		getTree(BASEURL + "canopy/tree/prod", { id:location.state?.id });
		getTreeNodes(BASEURL + "canopy/tree_nodes/prod", { id:location.state?.id })
	}, []);
	
	return (
		<div className="App">
			<header className="App-header-primary">
				<h1>Edit Tree Information</h1>
			</header>
			<div className="root">
				<form>
					<h3>
						Tree ID: { id }
					</h3>
					<br />
					
					<h3>
						Tree Name: { name }
					</h3>
					<label>
						New Name:
						<input
						name="new_name"
						type="text"
						value={new_name}
						onChange={e => setNewName(e.target.value)} />
					</label>
					<br /><br />

					<h3>
						Owner: { owner }
					</h3>
					<br />
				</form>

				<div>
					<button onClick={() => {
						putTree(BASEURL + "canopy/tree/prod", {id: id, name: name, owner: owner, new_name: new_name})
						alert("Tree Record ID: " + id + " Saved!")
						navigate(0)
					}}>
						Save Tree Details
					</button>

					<button onClick={() => {
						refreshTree(BASEURL + "canopy/recalculate_tree/prod", {tree_id: id})
					}}>
						Refresh FH Conditions
					</button>
				</div>

				<br />

				<div>
					<button onClick={() => {
						deleteTree(BASEURL + "canopy/tree/prod", {id: id, name: name, owner: owner})
						alert("Tree Record ID: " + id + " Deleted!")
						navigate('/canopy/canopy_show_trees/')
					}}>
						Delete Tree ID: {id}
					</button>
				</div>

				<br />

				<h2>Test Family Tree</h2>
				{tree_nodes.length < 1 && loading && (
					<h3>Tree information is loading...</h3>
				)}
				{tree_nodes.length < 1 && !loading && (
					<h3>Tree is empty...</h3>
				)}
				{selected && (
					<NodeDetails
					node={selected}
					className="details"
					onSelect={setSelectId}
					onHover={setHoverId}
					onClear={() => setHoverId(undefined)}
					/>
				)}
				{tree_nodes.length > 0 && (
					<ReactFamilyTree
						nodes={tree_nodes}
						rootId={rootId}
						width={NODE_WIDTH}
						height={NODE_HEIGHT}
						className="tree"
						renderNode={(node) => (
							<FamilyNode
								key={node.id}
								node={node}
								isRoot={node.id === rootId}
								isHover={node.id === hoverId}
								onClick={setSelectId}
								onSubClick={setRootId}
								style={getNodeStyle(node)}
							/>
						)}
					/>
				)}

				<br />

				<div>
					<table border="1" className="canopy-table">
						{generateTable(owned_nodes)}
					</table>
				</div>

				<br />
				
				<Link to="/canopy/canopy_new_node" state={{ tree_id: location.state?.id }}>
					<button>Add a New Patient to This Tree</button>
				</Link>

				<br />

				<div>
					<button onClick={() => {
						navigate('/canopy/canopy_show_trees/');
					}}> 
						Back 
					</button>
				</div>

				<br />
			</div>
		</div>
	);
}

export default EditNode;
