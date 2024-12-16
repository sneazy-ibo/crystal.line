(() => {
  'use strict';

  class Crystaliner {
    constructor() {
      this.classes = new Map();
      this.baseUrl = 'https://api.github.com/repos/sneazy-ibo/crystal.line/contents/classes?ref=altair';
    }

    async init() {
      try {
        await this.loadAllClasses();
        this.initializeClasses();

        window.Crystaliner = this;
      } catch (error) {
        console.error('Crystaliner initialization failed:', error);
      }
    }

    async loadAllClasses() {
      try {
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch directory contents');
        }

        const files = await response.json();

        for (const file of files) {
          if (file.name.endsWith('.js')) {
            const className = file.name.replace('.js', '');
            await this.loadClass(className);
          }
        }
      } catch (error) {
        console.error('Failed to load classes:', error);
      }
    }

    async loadClass(className) {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/sneazy-ibo/crystal.line/altair/classes/${className}.js`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to load ${className}`);
        }

        const classCode = await response.text();
        const createClass = new Function(classCode + `\nreturn ${className};`);

        this.classes.set(className, createClass());
        
        console.log(`Loaded ${className} successfully`);
      } catch (error) {
        console.error(`Failed to load ${className}:`, error);
      }
    }

    initializeClasses() {
      for (const [className, ClassConstructor] of this.classes) {
        if (ClassConstructor) {
          try {
            const instance = new ClassConstructor();
            if (typeof instance.init === 'function') {
              instance.init();
              console.log(`Initialized ${className} successfully`);
            }
          } catch (error) {
            console.error(`Failed to initialize ${className}:`, error);
          }
        }
      }
    }
  }

  new Crystaliner().init();
})();