import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Code production
{
    files: ["*.js"],
    ignores: ["**/test.js"],  
    languageOptions: {
      globals: {
        ...globals.node,        
        ...globals.es2021       
      },
      ecmaVersion: "latest",
      sourceType: "commonjs"    
    },
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-console": "off",
      "no-unused-vars": "warn"
    }
  },

  // Fichiers de test
  {
      files: ["**/test.js"],
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.jest,        
          ...globals.es2021
        },
        ecmaVersion: "latest",
        sourceType: "commonjs"
      },
      plugins: { js },
      extends: ["js/recommended"]
    }
  ]);

