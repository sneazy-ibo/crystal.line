(() => {
  'use strict';

  class Crystaliner {
    constructor() {
      this.classes = {
        PowerlineUI: null,
        // Add future classes here as they're created
        // Example:
        // CustomClass: null,
      };
    }

    async init() {
      try {
        // Load PowerlineUI
        await this.loadClass('PowerlineUI');
        
        // Initialize loaded classes
        this.initializeClasses();

        // Set up a global reference
        window.Crystaliner = this;
      } catch (error) {
        console.error('Crystaliner initialization failed:', error);
      }
    }

    async loadClass(className) {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/sneazy-ibo/crystal.line/refs/heads/altair/classes/${className}.js`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to load ${className}`);
        }

        const classCode = await response.text();
        
        // Create a new Function to evaluate the class code in the global scope
        const createClass = new Function(classCode + `\nreturn ${className};`);
        
        // Store the class constructor
        this.classes[className] = createClass();
        
      } catch (error) {
        console.error(`Failed to load ${className}:`, error);
      }
    }

    initializeClasses() {
      // Initialize each loaded class
      for (const [className, ClassConstructor] of Object.entries(this.classes)) {
        if (ClassConstructor) {
          try {
            const instance = new ClassConstructor();
            if (typeof instance.init === 'function') {
              instance.init();
            }
          } catch (error) {
            console.error(`Failed to initialize ${className}:`, error);
          }
        }
      }
    }
  }

  // Initialize Crystaliner
  new Crystaliner().init();
})();