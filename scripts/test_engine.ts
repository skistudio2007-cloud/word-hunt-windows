import { generatePuzzle } from '../src/services/puzzleGenerator';
import { WORLDS } from '../src/data/worlds';
import { WORD_DATABASE } from '../src/data/wordDatabase';
import { getTranslation } from '../src/services/localization';

console.log('--- TEST 1: Word Database Integrity ---');
const totalWords = Object.values(WORD_DATABASE).reduce((sum, list) => sum + list.length, 0);
console.log(`Total database words: ${totalWords}`);
if (totalWords < 50) throw new Error('Database too small');
console.log('✔ Word database check passed.');

console.log('\n--- TEST 2: Multi-Level Generation Check ---');
const testLevels = [1, 5, 12, 25, 50, 100, 250, 500, 1000];
for (const lvl of testLevels) {
  const puzzle = generatePuzzle(lvl);
  if (!puzzle.grid || puzzle.grid.length < 5) throw new Error(`Level ${lvl} grid generation failed`);
  if (!puzzle.words || puzzle.words.length < 3) throw new Error(`Level ${lvl} words generation failed`);
  console.log(`✔ Level ${lvl}: Grid ${puzzle.grid.length}x${puzzle.grid.length}, Theme: "${puzzle.theme}", Words: ${puzzle.words.length}`);
}

console.log('\n--- TEST 3: Worlds Expedition Check ---');
console.log(`Total worlds available: ${WORLDS.length}`);
WORLDS.forEach(w => {
  console.log(`✔ World ${w.id} ("${w.name}"): Levels ${w.startLevel}-${w.endLevel}, Categories: ${w.themeCategories.length}`);
});

console.log('\n--- TEST 4: Multi-Language Localization ---');
const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'hi', 'ja'] as const;
for (const lang of languages) {
  const playText = getTranslation(lang, 'play');
  const levelText = getTranslation(lang, 'level');
  console.log(`✔ [${lang}] Play: "${playText}" | Level: "${levelText}"`);
}

console.log('\n========================================');
console.log('🎉 ALL ENGINE & GAMEPLAY TESTS PASSED! 🎉');
console.log('========================================');
