const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix showLangModal initial state
code = code.replace(
  'const [showLangModal, setShowLangModal] = useState(true);',
  'const [showLangModal, setShowLangModal] = useState(() => !localStorage.getItem("jsic_lang"));'
);

// Fix initial screen state
code = code.replace(
  'const [screen, setScreen] = useState<Screen>("landing");',
  'const [screen, setScreen] = useState<Screen>(() => (localStorage.getItem("active_screen") as Screen) || "landing");'
);

// Fix navigate to save active screen
code = code.replace(
  'setScreen(s);\n        window.scrollTo(0, 0);',
  'setScreen(s);\n        localStorage.setItem("active_screen", s);\n        window.scrollTo(0, 0);'
);

// Add onAuthStateChanged to App()
let lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const timer = setTimeout(() => setInitialLoading(false), 500);')) {
     lines.splice(i+1, 0, `      let unsubscribe = () => {};
      import("./firebase/config").then(({ auth }) => {
        unsubscribe = auth.onAuthStateChanged(user => {
          if (!user) {
            setScreen("landing");
            localStorage.removeItem("active_screen");
          }
        });
      });`);
     break;
  }
}

// Ensure the return from useEffect cleans up correctly
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('return () => clearTimeout(timer);')) {
     lines[i] = '      return () => { clearTimeout(timer); unsubscribe(); };';
     break;
  }
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('Fixed auth persistence and language modal popup');
