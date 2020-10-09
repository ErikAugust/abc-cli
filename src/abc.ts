import { exec } from 'child_process';
import { Transform } from 'stream';
import { noteMap } from './note-map';

/**
 * Plays a note AIFF via 'afplay' (only for macOS)
 * @param {string} note 
 */
function playNote(note: string) {
  exec(`afplay notes/Piano.mf.${note}.aiff`);
}

/**
 * Takes a chunk from stdin for each letter to play the mapped note
 */
const musicalTransform: Transform = new Transform({
  transform(chunk, encoding, callback) {
    // PRESS . TO EXIT!
    if (chunk.toString() === '.') {
      process.exit();
    }
    const letter = chunk.toString().toUpperCase();
    playNote(noteMap.get(letter));
    this.push(chunk.toString().toUpperCase() + '\n');
    callback();
  }
});

console.log('Type your ABCs!');
console.log('PRESS . TO EXIT!');

process.stdin.setRawMode(true);
process.stdin.pipe(musicalTransform).pipe(process.stdout);
