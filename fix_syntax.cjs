const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix ProblemsNearMeScreen
code = code.replace(
  `      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { getProblemsNearMe } = await import("./api");`,
  `      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { getProblemsNearMe } = await import("./api");`
);

// 2. Fix ProfileScreen mangled block
const mangledBlock = `      setLoading(false);
      }).catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
    });
      console.error(err);
      setLoading(false);
    });
  }, [role]);`;

const correctBlock = `      setLoading(false);
      }).catch((err: any) => {
        console.error(err);
        setLoading(false);
      });
    });
  }, [role]);`;

code = code.replace(mangledBlock, correctBlock);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed both syntax errors.");
