import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to the folder where you keep the master CV file(s)
const masterDir = '/mnt/CHINA/New folder (2)/Docs';

// File names of the master CVs to copy
const files = [
  {
    srcName: 'Musab_Ahmed_Khan_Professional_CV.pdf',
    destName: 'Musab_Ahmed_Khan_Professional_CV.pdf',
  },
  {
    srcName: 'Musab_Ahmed_Khan_Academic_CV.pdf',
    destName: 'Musab_Ahmed_Khan_Academic_CV.pdf',
  },
];

for (const { srcName, destName } of files) {
  const src = path.join(masterDir, srcName);
  const dest = path.resolve(__dirname, '../public/cv', destName);

  try {
    fs.copyFileSync(src, dest);
    console.log(`CV updated from "${src}" to "${dest}"`);
  } catch (err) {
    console.error(`Failed to update CV "${srcName}":`, err);
    process.exitCode = 1;
  }
}

