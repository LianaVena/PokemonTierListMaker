import PairChooser from "./pair-chooser.tsx"
import {allPokemonInput, PokemonObject} from "../pokemon.ts"
import * as React from "react"
import {useState} from "react"
import {logger} from "../logging/logger.tsx"
import _ from "lodash"

export interface PokeNode {
    node: number
    left: PokeNode | null
    right: PokeNode | null
}

export default function TierListMaker() {
    const [nodes, setNodes] = useState<PokeNode[]>(shuffle(getNodes()))
    const [node1, setNode1] = useState<PokeNode | null>(null)
    const [node2, setNode2] = useState<PokeNode | null>(null)
    const [pokemon1, setPokemon1] = useState<PokemonObject | null>(null)
    const [pokemon2, setPokemon2] = useState<PokemonObject | null>(null)
    const [tierList, setTierList] = useState<PokemonObject[]>([])
    const [done, setDone] = useState<boolean>(false)

    logger("Number of nodes: " + nodes.length, "debug")
    printAllNodes(nodes)

    function choosePokemon(pokemon: PokemonObject) {
        if (pokemon) {
            mergeNodes(node1, node2, pokemon, nodes, setNode1, setNode2, setNodes)
        }
    }

    if (!done) {
        if (node1 === null || node2 === null) {
            const pair = popNodePair(nodes, setNode1, setNode2, setNodes, tierList, setTierList, setDone)
            if (pair) {
                setPokemon1(getPokemonById(pair[0].node) || null)
                setPokemon2(getPokemonById(pair[1].node) || null)
            }
        }
    }

    return (
        <> {done ? (
            <>
                <h2>Your Tier List:</h2>
                {tierList.map((pokemon) =>
                    <div key={pokemon.id} className="pokemon">
                        <img src={pokemon.imageUrl} alt={pokemon.name} width="50px" height="50px"/>
                        <p>{pokemon.id + ". " + pokemon.name}</p>
                    </div>
                )}
            </>
        ) : (
            <PairChooser pokemon1={pokemon1}
                         pokemon2={pokemon2}
                         onChosenChange={choosePokemon}>

            </PairChooser>
        )}
        </>
    )
}

function popNodePair(
    nodes: PokeNode[],
    setNode1: React.Dispatch<React.SetStateAction<PokeNode | null>>,
    setNode2: React.Dispatch<React.SetStateAction<PokeNode | null>>,
    setNodes: React.Dispatch<React.SetStateAction<PokeNode[]>>,
    tierList: PokemonObject[],
    setTierList: React.Dispatch<React.SetStateAction<PokemonObject[]>>,
    setDone: React.Dispatch<React.SetStateAction<boolean>>
) {
    logger("POP PAIR...", "debug")
    if (nodes.length > 1) {
        const n1 = nodes[0]
        const n2 = nodes[1]
        setNode1(n1)
        setNode2(n2)
        const nodesCopy = _.cloneDeep(nodes)
        nodesCopy.shift()
        nodesCopy.shift()
        setNodes(nodesCopy)
        return [n1, n2]
    } else {
        setWinnerAndRestart(nodes, tierList, setNodes, setTierList, setDone)
    }
}

function setWinnerAndRestart(
    nodes: PokeNode[],
    tierList: PokemonObject[],
    setNodes: React.Dispatch<React.SetStateAction<PokeNode[]>>,
    setTierList: React.Dispatch<React.SetStateAction<PokemonObject[]>>,
    setDone: React.Dispatch<React.SetStateAction<boolean>>
) {
    if (nodes.length === 0) {
        setDone(true)
    } else {
        const node0 = nodes[0]
        const winner = getPokemonById(node0.node)
        if (winner) {
            const tierListCopy = _.cloneDeep(tierList)
            tierListCopy.push(winner)
            setTierList(tierListCopy)
            printTierList(tierListCopy)
            const newNodes: PokeNode[] = []
            if (node0.left) {
                newNodes.push(node0.left)
            }
            if (node0.right) {
                newNodes.push(node0.right)
            }
            setNodes(newNodes)
        } else {
            alert("No Winner????")
        }
    }
}

function pushUpdatedNode(
    n1: PokeNode,
    n2: PokeNode,
    nodes: PokeNode[],
    setN1: React.Dispatch<React.SetStateAction<PokeNode | null>>,
    setN2: React.Dispatch<React.SetStateAction<PokeNode | null>>,
    setNodes: React.Dispatch<React.SetStateAction<PokeNode[]>>
) {
    logger("PUSH NODE...", "debug")
    const nodesCopy = _.cloneDeep(nodes)
    if (n1.left === null) {
        n1.left = n2
        nodesCopy.push(n1)
        setNodes(nodesCopy)
        setN1(null)
        setN2(null)
    } else if (n1.right === null) {
        n1.right = n2
        nodesCopy.push(n1)
        setNodes(nodesCopy)
        setN1(null)
        setN2(null)
    } else {
        logger("COULD NOT PUSH NODES", "warn")
    }
}

function mergeNodes(
    node1: PokeNode | null,
    node2: PokeNode | null,
    chosenPokemon: PokemonObject | null,
    nodes: PokeNode[],
    setNode1: React.Dispatch<React.SetStateAction<PokeNode | null>>,
    setNode2: React.Dispatch<React.SetStateAction<PokeNode | null>>,
    setNodes: React.Dispatch<React.SetStateAction<PokeNode[]>>
) {
    logger("MERGE NODES...", "debug")
    if (node1 && node2 && chosenPokemon) {
        if (node1.node === chosenPokemon.id) {
            pushUpdatedNode(node1, node2, nodes, setNode1, setNode2, setNodes)
        } else if (node2.node === chosenPokemon.id) {
            pushUpdatedNode(node2, node1, nodes, setNode2, setNode1, setNodes)
        } else {
            logger("Chosen pokemon " + chosenPokemon.name + " not in nodes: " +
                getPokemonNameById(node1.node) + " " + getPokemonNameById(node2.node), "warn")
        }
    } else {
        logger("NULL VALUE: chosenPokemon=" +
            (chosenPokemon ? chosenPokemon.name : "null") +
            " node1=" + (node1 ? getPokemonNameById(node1.node) : "null") +
            " node2=" + (node2 ? getPokemonNameById(node2.node) : "null"), "warn")
    }
}

function getPokemonById(id: number) {
    return allPokemonInput.get(id)
}

function getPokemonNameById(id: number) {
    const pokemon = allPokemonInput.get(id)
    if (pokemon) {
        return pokemon.name
    }
    return ""
}

function nodeToString(node: PokeNode | null): string {
    const parentheses = [
        ["(", ")"],
        ["[", "]"],
        ["{", "}"]
    ];

    function traverse(node: PokeNode | null, level: number): string {
        if (!node) {
            return "";
        }
        const [open, close] = parentheses[level % parentheses.length];
        const leftSubtree = traverse(node.left, level + 1);
        const rightSubtree = traverse(node.right, level + 1);
        if (leftSubtree || rightSubtree) {
            return `${node.node + ". " + getPokemonNameById(node.node)}${open}${leftSubtree}${close}${open}${rightSubtree}${close}`;
        }
        return `${node.node + ". " + getPokemonNameById(node.node)}`;
    }
    return traverse(node, 0);
}

function printAllNodes(nodes: PokeNode[]) {
    logger("-----------", "debug")
    for (let i = 0; i < nodes.length; i++) {
        logger("nodes[" + i + "] = " + nodeToString(nodes[i]), "debug")
    }
}

function printTierList(tierList: PokemonObject[]) {
    let result = "Result: "
    for (const pokemon of tierList) {
        result += pokemon.name + " "
    }
    logger(result, "debug")
}

function getNodes() {
    const nodes: PokeNode[] = []
    for (const [key] of allPokemonInput) {
        nodes.push({node: key, left: null, right: null})
    }
    return nodes
}

function shuffle(array: PokeNode[]) {
    const result = _.cloneDeep(array)
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]]
    }
    return result
}
