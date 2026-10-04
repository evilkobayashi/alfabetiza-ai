const fs = require('fs');
const content = fs.readFileSync('src/components/VoiceRecorder.tsx', 'utf8');
let stack = [];
let regex = /<\/?([a-zA-Z0-9\.]+)[^>]*>/g;
let match;
while ((match = regex.exec(content)) !== null) {
  let tag = match[1];
  let full = match[0];
  if (full.endsWith('/>')) continue;
  if (full.startsWith('</')) {
    if (stack.length > 0 && stack[stack.length - 1] === tag) stack.pop();
    else console.log("Mismatched close:", full, "expected", stack[stack.length - 1], "at index", match.index);
  } else {
    stack.push(tag);
  }
}
console.log("Remaining stack:", stack);
