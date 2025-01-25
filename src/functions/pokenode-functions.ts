import {allPokemonInput, getPokemonNameById} from "./pokemon.ts"
import {logger} from "./logger.ts"
import _ from "lodash"
import {PokeNode} from "../components/tier-list-maker.tsx"

function nodeToString(node: PokeNode | null): string {
    const parentheses = [
        ["(", ")"],
        ["[", "]"],
        ["{", "}"]
    ]

    function traverse(node: PokeNode | null, level: number): string {
        if (!node) {
            return ""
        }
        const [open, close] = parentheses[level % parentheses.length]
        const children = node.leaves.map(child => traverse(child, level + 1)).join(close + open)
        return node.id + "." + getPokemonNameById(node.id) + (children ? open + children + close : "")
    }

    return traverse(node, 0)
}

export function printAllNodes(nodes: PokeNode[]) {
    logger("-----------", "debug")
    for (let i = 0; i < nodes.length; i++) {
        logger("nodes[" + i + "] = " + nodeToString(nodes[i]), "debug")
    }
}

export function getNodes() {
    const nodes: PokeNode[] = []
    for (const [key] of allPokemonInput) {
        nodes.push({id: key, leaves: []})
    }
    return nodes
}

export function shuffle(array: PokeNode[]) {
    const result = _.cloneDeep(array)
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]]
    }
    return result
}
