const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('const VOCAB_DATA =');
const end = html.indexOf('// ==================== APP STATE', start);

if (start < 0 || end < 0) {
  throw new Error('VOCAB_DATA block not found');
}

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${html.slice(start, end)}\nresult = VOCAB_DATA;`, sandbox);

const data = sandbox.result;
const problems = [];
const seen = new Map();
let total = 0;

if (!Array.isArray(data)) {
  problems.push('VOCAB_DATA must be an array');
} else if (data.length !== 60) {
  problems.push(`Expected 60 days, got ${data.length}`);
}

data.forEach((words, dayIdx) => {
  const dayLabel = `DAY ${dayIdx + 1}`;
  if (!Array.isArray(words)) {
    problems.push(`${dayLabel}: must be an array`);
    return;
  }
  if (words.length !== 20) {
    problems.push(`${dayLabel}: expected 20 words, got ${words.length}`);
  }

  const daySeen = new Set();
  words.forEach((word, wordIdx) => {
    total += 1;
    const where = `${dayLabel} #${wordIdx + 1}`;
    if (!word || typeof word.en !== 'string' || typeof word.ko !== 'string') {
      problems.push(`${where}: invalid word shape`);
      return;
    }

    const en = word.en.trim();
    const ko = word.ko.trim();
    if (!en) problems.push(`${where}: empty English`);
    if (!ko) problems.push(`${where}: empty Korean`);
    if (/\uFFFD/.test(en + ko)) problems.push(`${where}: replacement character found`);

    const normalized = en.toLowerCase();
    if (daySeen.has(normalized)) {
      problems.push(`${where}: duplicate English within day: ${en}`);
    }
    daySeen.add(normalized);

    if (seen.has(normalized)) {
      problems.push(`${where}: duplicate English with ${seen.get(normalized)}: ${en}`);
    } else {
      seen.set(normalized, where);
    }
  });
});

if (problems.length) {
  console.error(`Vocabulary validation failed with ${problems.length} problem(s):`);
  problems.forEach(problem => console.error(`- ${problem}`));
  process.exitCode = 1;
} else {
  console.log(`Vocabulary validation passed: ${data.length} days, ${total} words.`);
}
