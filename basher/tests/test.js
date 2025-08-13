import { explainRegex } from '../explain.js';

const testCases = {
    'Simple Characters': {
        pattern: '/abc/',
        expected: '"abc"'
    },
    'Digits': {
        pattern: '/\\d+/',
        expected: 'a digit (0–9), one or more times'
    },
    'Word Characters': {
        pattern: '/\\w*/',
        expected: 'a word character (letter, digit, or underscore), zero or more times'
    },
    'Whitespace': {
        pattern: '/\\s?/',
        expected: 'whitespace optionally'
    },
    'Character Class': {
        pattern: '/[a-z]/',
        expected: 'any of: a–z'
    },
    'Negated Character Class': {
        pattern: '/[^0-9]/',
        expected: 'any character except: 0–9'
    },
    'Alternation': {
        pattern: '/cat|dog/',
        expected: 'either "cat" or "dog"'
    },
    'Group': {
        pattern: '/(a|b)c/',
        expected: 'capture group #1: either the character "a" or the character "b" then the character "c"'
    },
    'Optional Group': {
        pattern: '/(ab)?c/',
        expected: 'capture group #1: "ab" optionally then the character "c"'
    },
    'Lookahead': {
        pattern: '/a(?=b)/',
        expected: 'the character "a" then followed by the character "b"'
    },
    'Negated Lookahead': {
        pattern: '/a(?!b)/',
        expected: 'the character "a" then not followed by the character "b"'
    },
    'Start and End Anchors': {
        pattern: '/^a.*z$/',
        expected: 'start of string, then the character "a", then any character, zero or more times, then the character "z" then end of string'
    },
    'Flags': {
        pattern: '/a/gi',
        expected: 'the character "a"\n\nFlags: case-insensitive, global (find all matches)'
    },
    'Complex Nested Group': {
        pattern: '/(a(b|c)*)+/',
        expected: 'capture group #1: the character "a" then capture group #2: either the character "b" or the character "c", zero or more times, one or more times'
    },
    'Lookbehind': {
        pattern: '/(?<=a)b/',
        expected: 'preceded by the character "a" then the character "b"'
    },
    'Negated Lookbehind': {
        pattern: '/(?<!a)b/',
        expected: 'not preceded by the character "a" then the character "b"'
    },
    'Character Class with Ranges': {
        pattern: '/[a-zA-Z0-9_]/',
        expected: 'any of: a–z, A–Z, 0–9, the character "_"'
    },
    'URL Matching': {
        pattern: '/https?:\\/\\/[^\\s/$.?#].[^\\s]*/',
        expected: '"http", then the character "s" optionally, then the character ":", then the literal character "/", then the literal character "/", then any character except: whitespace, the character "/", the character "$", the character ".", the character "?", the character "#", then any character then any character except: whitespace, zero or more times'
    },
    'Mixed Quantifiers': {
        pattern: '/a.*?b+c{2,}/',
        expected: 'the character "a", then any character, zero or more times (non-greedy), then the character "b", one or more times then the character "c", 2 or more times'
    }
};

function runTests() {
    let passed = 0;
    let failed = 0;

    console.log('Running tests...\n');

    for (const testName in testCases) {
        const { pattern, expected } = testCases[testName];
        try {
            const explanation = explainRegex(pattern);
            if (explanation.trim() === expected.trim()) {
                console.log(`✅ ${testName}`);
                passed++;
            } else {
                console.error(`❌ ${testName}`);
                console.error(`   Expected: ${expected}`);
                console.error(`   Got:      ${explanation}`);
                failed++;
            }
        } catch (error) {
            console.error(`❌ ${testName} (error)`);
            console.error(`   ${error.message}`);
            failed++;
        }
    }

    console.log(`\nTests complete. ${passed} passed, ${failed} failed.`);
    return failed === 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}

export { testCases, runTests };
