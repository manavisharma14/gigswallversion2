"use strict";
require('ts-node').register({ compilerOptions: { module: 'ESNext' } }); // Ensure ts-node uses ESNext for modules
require('./server.ts'); // Loads and runs your server.ts file
