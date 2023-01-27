import path from 'path';
import {
  appendKeysToENV,
  removeKeysFromENV,
} from '../utils/config_utils/env_io';

const envPath = path.resolve(__dirname, '../../.env');

function appendToENV() {
  appendKeysToENV(envPath);
}

process.on('exit', () => {
  removeKeysFromENV(envPath);
});

appendToENV();
require('dotenv').config();
