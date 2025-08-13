#!/usr/bin/env node
const { parse } = require('regexp-tree');

function explainNode(node) {
    switch (node.type) {
        case 'Character':
            if (node.kind === 'meta') {
                if (node.symbol === '\\d') return 'a digit (0–9)';
                if (node.symbol === '\\w') return 'a letter, digit, or underscore';
                if (node.symbol === '\\s') return 'a whitespace character (space, tab, etc.)';
                if (node.symbol === '.') return 'any character';
            }
            return `"${node.symbol}"`;

        case 'CharacterClass':
            const inside = node.expressions.map(explainNode).join(', ');
            return node.negative
                ? `any single character except ${inside}`
                : `any of: ${inside}`;

        case 'ClassRange':
            return `a character from "${node.from.symbol}" to "${node.to.symbol}"`;

        case 'Repetition':
            const { kind, from, to } = node.quantifier;
            let quantifierText = '';
            if (kind === '+') quantifierText = 'one or more times';
            else if (kind === '*') quantifierText = 'zero or more times';
            else if (kind === '?') quantifierText = 'zero or one time';
            else if (from === to) quantifierText = `${from} times`;
            else quantifierText = `${from} to ${to} times`;
            return `${explainNode(node.expression)} ${quantifierText}`;

        case 'Alternative':
            return node.expressions.map(explainNode).join(' then ');

        case 'Disjunction':
            return `${explainNode(node.left)} or ${explainNode(node.right)}`;

        case 'Assertion':
            if (node.kind === '^') return 'the start of the string';
            if (node.kind === '$') return 'the end of the string';
            if (node.kind === '\\b') return 'a word boundary';
            if (node.kind === '\\B') return 'a non-word boundary';
            return `an assertion (${node.kind})`;

        case 'Group':
            return `(${explainNode(node.expression)})`;

        case 'RegExp':
            return explainNode(node.body);

        default:
            return node.raw || '(something)';
    }
}

function explainRegex(input) {
    let flags = '';
    if (input.startsWith('/') && input.lastIndexOf('/') > 0) {
        flags = input.slice(input.lastIndexOf('/') + 1);
        input = input.slice(1, input.lastIndexOf('/'));
    }
    const ast = parse(`/${input}/${flags}`);
    let explanation = explainNode(ast);

    if (flags) {
        const flagDescriptions = [];
        if (flags.includes('i')) flagDescriptions.push('case-insensitive');
        if (flags.includes('g')) flagDescriptions.push('global (find all matches)');
        if (flags.includes('m')) flagDescriptions.push('multi-line mode');
        if (flags.includes('s')) flagDescriptions.push('dot matches newline');
        if (flagDescriptions.length) {
            explanation += `. Flags: ${flagDescriptions.join(', ')}`;
        }
    }

    return explanation;
}

try {
    const input = process.argv[2];
    console.log(explainRegex(input));
} catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
}
 
//  script explains a regular expression in human-readable terms.